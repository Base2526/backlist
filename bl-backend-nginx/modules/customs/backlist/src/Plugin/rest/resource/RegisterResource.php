<?php

namespace Drupal\backlist\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\user\Entity\User;

use Drupal\backlist\Utils\Utils;

/**
 * Provides a resource to create new article.
 *
 * @RestResource(
 *   id = "register_resource",
 *   label = @Translation("Banlist : register"),
 *   uri_paths = {
 *     "create" = "/v1/register",
 *   }
 * )
 */
class RegisterResource extends ResourceBase {

  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Constructs a new CreateArticleResource object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Session\AccountProxyInterface $current_user
   *   A current user instance.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    AccountProxyInterface $current_user) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('dummy'),
      $container->get('current_user')
    );
  }

  /*
    type
     0 : api
     1 : facebook
     2 : google
  */
  /**
   * Responds to POST requests.
   */
  public function post($data) {
    $response_array = array();
    try {
      $time1    = microtime(true);
      $content  = $data ;//json_decode( $request->getContent(), TRUE );
      $type     = trim( $content['type'] );

      switch($type){
        case 0:{
          $email    = trim( $content['email'] );
          $name     = trim( $content['name'] );
          $password = trim( $content['password'] );

          if(empty($email) || empty($name) || empty($password)){
            $response_array['result']   = FALSE;
            $response_array['message']  = 'Empty email and name and password.';

            return new JsonResponse( $response_array );
          }else{
            
            /*
              * case is email with use user_load_by_mail reture name
            */
            if(!\Drupal::service('email.validator')->isValid( $email )){
              $response_array['result']   = FALSE;
              $response_array['message']  = t('The email address @email invalid.', array('@email' => $email))->__toString();
              return new JsonResponse( $response_array );
            }

            $user = user_load_by_mail($email);
            if(!empty($user)){
              $response_array['result']   = FALSE;
              $response_array['message']  = t('The email address @email is already taken.', array('@email' => $email))->__toString();
              return new JsonResponse( $response_array );
            }

            // Create user
            $user = User::create();

            // Mandatory settings
            $user->setPassword($password);
            $user->set("langcode", 'en');
            $user->enforceIsNew();
            $user->setEmail($email);
            $user->setUsername($name);
            // $user->addRole('authenticated');
            
            // Optional settings
            $user->activate();

            // Save user
            $user->save();

            // User login
            user_login_finalize($user);

            _user_mail_notify('register_no_approval_required', $user, 'en');

            $response_array['result']           = TRUE;
            $response_array['execution_time']   = microtime(true) - $time1;
            // $response_array['data']      = $user;

            return new JsonResponse( $response_array );
          }

          break;
        }
        case 1: {
          /*
          name,
            id
          */
          // $email      = trim( $content['email'] );
          // $family_name= trim( $content['family_name'] );
          // $given_name = trim( $content['given_name'] );
          $id         = trim( $content['id'] );
          $name       = trim( $content['name'] );
          // $photo      = trim( $content['photo'] );

          if( empty($id) && empty($name)){
            $response_array['result']   = FALSE;
            $response_array['message']  = 'Empty id and name.';

            return new JsonResponse( $response_array );
          }

          $ids = \Drupal::entityQuery('user')
                  ->condition('name', $id)
                  ->range(0, 1)
                  ->execute();

          $password = base64_encode($id);
          if(empty($ids)){
            // Create user
            $user = User::create();

            // Mandatory settings
            $user->setPassword($password);
            $user->set("langcode", 'en');
            $user->enforceIsNew();
            $user->setEmail($id . '@local.local');
            $user->setUsername($id);
            // $user->addRole('authenticated');

            $user->set('field_type_login', 29);

            // Optional settings
            $user->activate();

            // Save user
            $user->save();

          }
          
          $uid = \Drupal::service('user.auth')->authenticate( $id, base64_encode($id));

          $data = array(
                        'uid'       =>  $uid,
                        'name'      =>  $name,
                        'email'     =>  $id . '@local.local',
                        'image_url' => '',
                        'basic_auth'=>  base64_encode(sprintf('%s:%s', $id, $password))
                      );

          $user = User::load($uid);
          // if(!empty($user)){
          //   if(!Utils::is_404($photo)){
          //     $path_parts = pathinfo($photo);
  
          //     $ext = pathinfo(
          //         parse_url($photo, PHP_URL_PATH), 
          //         PATHINFO_EXTENSION
          //     ); 
  
          //     $filename = \Drupal::service('transliterate_filenames.sanitize_name')->sanitizeFilename($path_parts['filename']);
          //     $file = file_save_data(file_get_contents($photo), 'public://'. $filename .'.'.$ext, FileSystemInterface::EXISTS_REPLACE);
                   
          //     $user->set('user_picture', $file->id());
          //     $user->save();

          //     $data['image_url'] = file_create_url($file->getFileUri());
          //   }
          // }

          // User login
          user_login_finalize($user);

          // $response_array['image_url']  =  file_create_url($file->getFileUri());

          /*
          "email": "android.somkid@gmail.com",
          "familyName": "Simajarn",
          "givenName": "Somkid",
          "id": "112378752153101585347",
          "name": "Somkid Simajarn",
          "photo": "https://lh3.googleusercontent.com/a-/AOh14GjRHy1wQSwtRVgkCj8xs4ujUZxLuCYTlvy4Y-BTyg=s96-c"
          */

          $response_array['result']           = TRUE;
          $response_array['execution_time']   = microtime(true) - $time1;
          $response_array['data']             = $data;

          return new JsonResponse( $response_array );

        }
        case 2: {
          $email      = trim( $content['email'] );
          // $family_name= trim( $content['family_name'] );
          // $given_name = trim( $content['given_name'] );
          $id         = trim( $content['id'] );
          $name       = trim( $content['name'] );
          $photo      = trim( $content['photo'] );

          if(empty($email) && empty($id) && empty($name) && empty($photo)){
            $response_array['result']   = FALSE;
            $response_array['message']  = 'Empty email and id and name and photo.';

            return new JsonResponse( $response_array );
          }

          $ids = \Drupal::entityQuery('user')
                  ->condition('name', $id)
                  ->range(0, 1)
                  ->execute();

          $password = base64_encode($id);
          if(empty($ids)){
            // Create user
            $user = User::create();

            // Mandatory settings
            $user->setPassword($password);
            $user->set("langcode", 'en');
            $user->enforceIsNew();
            $user->setEmail($email);
            $user->setUsername($id);
            // $user->addRole('authenticated');

            $user->set('field_type_login', 30);

            // Optional settings
            $user->activate();

            // Save user
            $user->save();

          }
          
          $uid = \Drupal::service('user.auth')->authenticate( $id, base64_encode($id));

          $data = array(
                        'uid'       =>  $uid,
                        'name'      =>  $name,
                        'email'     =>  $email,
                        'image_url' => '',
                        'basic_auth'=>  base64_encode(sprintf('%s:%s', $id, $password))
                      );

          $user = User::load($uid);
          if(!empty($user)){
            if(!Utils::is_404($photo)){
              $path_parts = pathinfo($photo);
  
              $ext = pathinfo(
                  parse_url($photo, PHP_URL_PATH), 
                  PATHINFO_EXTENSION
              ); 
  
              $filename = \Drupal::service('transliterate_filenames.sanitize_name')->sanitizeFilename($path_parts['filename']);
              $file = file_save_data(file_get_contents($photo), 'public://'. $filename .'.'.$ext, FileSystemInterface::EXISTS_REPLACE);
                   
              $user->set('user_picture', $file->id());
              $user->save();

              $data['image_url'] = file_create_url($file->getFileUri());
            }
          }

          // User login
          user_login_finalize($user);

          // $response_array['image_url']  =  file_create_url($file->getFileUri());

          /*
          "email": "android.somkid@gmail.com",
          "familyName": "Simajarn",
          "givenName": "Somkid",
          "id": "112378752153101585347",
          "name": "Somkid Simajarn",
          "photo": "https://lh3.googleusercontent.com/a-/AOh14GjRHy1wQSwtRVgkCj8xs4ujUZxLuCYTlvy4Y-BTyg=s96-c"
          */

          $response_array['result']           = TRUE;
          $response_array['execution_time']   = microtime(true) - $time1;
          $response_array['data']             = $data;

          return new JsonResponse( $response_array );
        }
        default:{
          $response_array['result']   = FALSE;
          $response_array['message']  = 'Empty type.';
          return new JsonResponse( $response_array );
        }
      }
    } catch (\Throwable $e) {
      \Drupal::logger('Login')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();

      return new JsonResponse( $response_array );
    }
  }
}