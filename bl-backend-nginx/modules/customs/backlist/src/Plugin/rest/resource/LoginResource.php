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
 *   id = "login_resource",
 *   label = @Translation("Banlist : login"),
 *   uri_paths = {
 *     "create" = "/v1/login",
 *   }
 * )
 */
class LoginResource extends ResourceBase {

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
   code : 
    - 101 : 
    - 102 : 
    - 103 : 
    - 104 : 
  */

  /**
   * Responds to POST requests.
   */
  public function post($data) {
    $response_array = array();
    try {
      $time1    = microtime(true);
  
      $content      = $data; // json_decode( $request->getContent(), TRUE );
      $name         = strtolower( trim( $content['name'] ) );
      $password     = trim( $content['password'] );
      // $unique_id    = trim( $content['unique_id'] );
  
      if( empty($name) || empty($password) ){
        $response_array['result']   = FALSE;
        $response_array['code']     = '102';
        $response_array['message']  = 'Empty name or password.';
  
        return new JsonResponse( $response_array );
      }else{
        /*
        * case is email with use user_load_by_mail reture name
        */
        if(\Drupal::service('email.validator')->isValid( $name )){
          $user_load = user_load_by_mail($name);
          if(!$user_load){
            $response_array['result']     = FALSE;
            $response_array['code']       = '103';
            $response_array['message']    = 'Unrecognized ' . $name . '. please sign up';
            return new JsonResponse( $response_array );
          }

          $name = user_load_by_mail($name)->getDisplayName();
        }
  
        $uid = \Drupal::service('user.auth')->authenticate($name, $password);
        if(!empty($uid)){
          $user = User::load($uid);
          $user_login_finalize = user_login_finalize($user);

          \Drupal::logger('Login')->notice(serialize($user_login_finalize));

          // $name    = $user->getDisplayName();
          $display_name    = '';
          $field_display_name = $user->get('field_display_name')->getValue();
          if(!empty($field_display_name)){
            $display_name    = $field_display_name[0]['value'];
          }

          $email   = $user->getEmail();
          $image_url = '';  
          if (!$user->get('user_picture')->isEmpty()) {
            $image_url = file_create_url($user->get('user_picture')->entity->getFileUri());
          }

          $user = array(
                    'uid'       =>  $uid,
                    'name'      =>  $display_name,
                    'email'     =>  $email,
                    'image_url' =>  $image_url,
                    'session'   =>  \Drupal::service('session')->getId(),
                    'basic_auth'=>  base64_encode(sprintf('%s:%s', $name, $password))
                  );

          $response_array['result']           = TRUE;
          $response_array['execution_time']   = microtime(true) - $time1;
          $response_array['user']             = $user;

          // $response_array['follow_ups']       = array();

          //   // /api/login , unique_id

          //   // ---------------- follow_ups -----------------
          //   Utils::node_login($unique_id);

          //   $response_array['follow_ups'] = Utils::node_fetch____follow_up();
          //   // ---------------- follow_ups -----------------


          //   // ---------------- follower_post -----------------

            // $response_array['follower_post'] =array();

          //   // $storage = \Drupal::entityTypeManager()->getStorage('node');
          //   $storage = $this->entityTypeManager->getStorage('node');
          //   $query   = $storage->getQuery();
          //   // $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
          //   $query->condition('type', 'back_list');

          //   $query->condition('uid', $uid);
          //   $posts = array_values($query->execute());

          //   if(!empty($posts)){
          //     $response_array['follower_post'] = Utils::node_follower_post(  $posts );
          //   }

          //   // ---------------- follower_post -----------------

            
          //   // -----  my_apps  -------
          //   $storage = $this->entityTypeManager->getStorage('node');
          //   $query   = $storage->getQuery();
          //   $query->condition('type', 'back_list');
          //   $query->condition('uid', $uid);

          //   $response_array['my_apps'] = json_encode(array_values($query->execute()));
          //   // -----  my_apps  -------
        }else{

          if(empty(user_load_by_name($name))){
            $response_array['result']     = FALSE;
            $response_array['code']       = '105';
            $response_array['message']    = 'Unrecognized ' . $name . '. please sign up';
            return new JsonResponse( $response_array );
          }

          $response_array['result']           = FALSE;
          $response_array['code']             = '104';
          $response_array['execution_time']   = microtime(true) - $time1;
          $response_array['message']          = "Password incorrect";
        }
        return new JsonResponse( $response_array );
      }
    } catch (\Throwable $e) {
      \Drupal::logger('Login')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['code']     = '101';
      $response_array['message']  = $e->__toString();

      return new JsonResponse( $response_array );
    }
  }
}