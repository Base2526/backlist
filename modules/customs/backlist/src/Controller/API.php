<?php

/**
 * @file
 * Contains \Drupal\test_api\Controller\APIController.
 */

namespace Drupal\backlist\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\paragraphs\Entity\Paragraph;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\DependencyInjection\ContainerInterface;
// use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

use Drupal\user\Entity\User;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Drupal\file\Entity\File;

use Drupal\config_pages\Entity\ConfigPages;
use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\File\FileSystemInterface;

use \Datetime;

use Drupal\search_api\Entity\Index;

use Drupal\backlist\Utils\Utils;
/**
 * Controller routines for test_api routes.
 * https://www.chapterthree.com/blog/custom-restful-api-drupal-8
 */
class API extends ControllerBase {

  /**
   * Entity query factory.
   *
   * @var \Drupal\Core\Entity\Query\QueryFactory
   */
  protected $entityTypeManager;

  /**
  * Constructs a new CustomRestController object.
  * @param \Drupal\Core\Entity\Query\QueryFactory $entityQuery
  * The entity query factory.
  */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    // $this->entityQuery = $entity_query;
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      // $container->get('entity.query')
      $container->get('entity_type.manager')
    );
  }

  /*
   code : 
    - 101 : 
    - 102 : 
    - 103 : 
    - 104 : 
  */
  public function Login(Request $request){
    $response_array = array();
    try {
      $time1    = microtime(true);
  
      $content      = json_decode( $request->getContent(), TRUE );
      $name         = strtolower( trim( $content['name'] ) );
      $password     = trim( $content['password'] );
      $unique_id    = trim( $content['unique_id'] );
  
      if(empty($name) || empty($password) || empty($unique_id) ){
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

          $response_array['follow_ups']       = array();

          // /api/login , unique_id

          // ---------------- follow_ups -----------------
          Utils::node_login($unique_id);

          $response_array['follow_ups'] = Utils::node_fetch____follow_up();
          // ---------------- follow_ups -----------------


          // ---------------- follower_post -----------------

          $response_array['follower_post'] =array();

          // $storage = \Drupal::entityTypeManager()->getStorage('node');
          $storage = $this->entityTypeManager->getStorage('node');
          $query   = $storage->getQuery();
          // $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
          $query->condition('type', 'back_list');

          $query->condition('uid', $uid);
          $posts = array_values($query->execute());

          if(!empty($posts)){
            $response_array['follower_post'] = Utils::node_follower_post(  $posts );
          }

          // ---------------- follower_post -----------------

          
          // -----  my_apps  -------
          $storage = $this->entityTypeManager->getStorage('node');
          $query   = $storage->getQuery();
          $query->condition('type', 'back_list');
          $query->condition('uid', $uid);

          $response_array['my_apps'] = json_encode(array_values($query->execute()));
          // -----  my_apps  -------
        }else{

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

  /*
    type
     0 : api
     1 : facebook
     2 : google
  */
  public function Register(Request $request){
    $response_array = array();
    try {
      $time1    = microtime(true);
      $content  = json_decode( $request->getContent(), TRUE );
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

  /* https://stackoverflow.com/questions/4247405/how-do-i-send-an-email-notification-when-programatically-creating-a-drupal-user/10603541
  * @param $op
  *   The operation being performed on the account. Possible values:
  *   - 'register_admin_created': Welcome message for user created by the admin.
  *   - 'register_no_approval_required': Welcome message when user
  *     self-registers.
  *   - 'register_pending_approval': Welcome message, user pending admin
  *     approval.
  *   - 'password_reset': Password recovery request.
  *   - 'status_activated': Account activated.
  *   - 'status_blocked': Account blocked.
  *   - 'cancel_confirm': Account cancellation request.
  *   - 'status_canceled': Account canceled.
  */
  public function ResetPassword(Request $request){
    $response_array = array();
    try {
      
      $time1    = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      $email = strtolower(trim( $content['email']));

      if( empty($email) ){
        $response_array['result'] = FALSE;
        return new JsonResponse( $response_array );
      }

      $user = NULL;
      if(\Drupal::service('email.validator')->isValid( $email )){
        $user = user_load_by_mail($email);
        if(empty( $user )){
          $response_array['result']   = FALSE;
          $response_array['message']  = t('@email is not recognized an email address.', array('@email' => $email))->__toString();
          return new JsonResponse( $response_array );
        }
      }else{
        // $user = user_load_by_name($email);
        // if(empty( $user )){
          $response_array['result']   = FALSE;
          $response_array['message']  = t('@email is not recognized as a username.', array('@email' => $email))->__toString();
          return new JsonResponse( $response_array );
        // }
      }

      // $name = $this->requestStack->getCurrentRequest()->query->get('name');
      // // TODO: Add destination.
      // // $page_destination = $this->requestStack->getCurrentRequest()->query->get('destination');

      // $langcode =  $this->languageManager->getCurrentLanguage()->getId();
      // // Try to load by email.
      // $users =  $this->entityTypeManager->getStorage('user')->loadByProperties(array('mail' => $name));
      // if (empty($users)) {
      //   // No success, try to load by name.
      //   $users =  $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $name));
      // }
      // $account = reset($user);
      // Mail one time login URL and instructions using current language.
      // $mail = _user_mail_notify('password_reset', $account);

      _user_mail_notify('password_reset', $user, 'en');

      // if (!empty($mail)) {
      //   $this->logger->notice('Password reset instructions mailed to %name at %email.', ['%name' => $account->getAccountName(), '%email' => $account->getEmail()]);
      //   $this->messenger->addStatus($this->t('Further instructions have been sent to your email address.'));
      // }

      $response_array['result']   = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      $response_array['$account'] = $user;
      
      // $response['message']  = t('@id | @name |  @email', array('@id'=>$user->id(), '@name' => $user->getUsername(), '@email' => $user->getEmail()))->__toString();
      return new JsonResponse( $response_array );

    } catch (\Throwable $e) {
      \Drupal::logger('ResetPassword')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  /*
   - แก้ปัญหากรณีเปิดหลายๆ เครื่องระหว่างนี้มีการ follow up, .... จะไม่ได้ current data เราต้อง syc เพอืให้ข้อมูลเท่ากัน
  */
  public function SycNodeJs(Request $request){
    $response_array = array();
    try {
      $time1      = microtime(true);
      $content    = json_decode( $request->getContent(), TRUE );

      $uid = \Drupal::currentUser()->id();

      // ---------------- follow_ups -----------------
      $response_array['follow_ups'] = Utils::node_fetch____follow_up();
      // ---------------- follow_ups -----------------

      // ---------------- follower_post -----------------
      $response_array['follower_post'] =array();

      // $storage = \Drupal::entityTypeManager()->getStorage('node');
      $storage = $this->entityTypeManager->getStorage('node');
      $query   = $storage->getQuery();
      // $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
      $query->condition('type', 'back_list');

      $query->condition('uid', $uid);
      $posts = array_values($query->execute());

      if(!empty($posts)){
        $response_array['follower_post'] = Utils::node_follower_post(  $posts );
      }
      // ---------------- follower_post -----------------

      // -----  my_apps  -------
      $storage = $this->entityTypeManager->getStorage('node');
      $query   = $storage->getQuery();
      $query->condition('type', 'back_list');
      $query->condition('uid', $uid);

      $response_array['my_apps'] = json_encode(array_values($query->execute()));
      // -----  my_apps  -------


      // ----- notification -------
      $response_array['notification'] = Utils::node_fetch_notification();
      // ----- notification -------


      $response_array['result']           = TRUE;
      // $response_array['data']          = $data;
      $response_array['execution_time']   = microtime(true) - $time1;
    } catch (\Throwable $e) {
      \Drupal::logger('SycNodeJs')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
    }

    return new JsonResponse( $response_array );
  }

  /*
   Search for banlist have 3 way
   1. name, subname
   2. bank account
   3. id card or pass port
   4. websit self
  */
  public function CheckBanlist(Request $request){
    $response_array = array();
    try {
     
      $time1    = microtime(true);

      // if ( Utils::verify($request, FALSE) ) {
        $content = json_decode( $request->getContent(), TRUE );
        $type         = trim( $content['type'] );

        if(!empty( $type )){
          switch($type){
            // find by name, subname
            case '1':{
              $name         = trim( $content['name'] );
              $surname      = trim( $content['surname'] );

              if( empty($name) || empty($surname) ){

                // $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery();
                // $storage = \Drupal::entityTypeManager()->getStorage('node');

                $storage = $this->entityTypeManager->getStorage('node');
                $query = $storage->getQuery();
                $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
                $query->condition('type', 'back_list');

                $or = $query->orConditionGroup();
                if(!empty($name)){
                  $or->condition('field_sales_person_name', $name, 'CONTAINS');
                }
                if(!empty($surname)){
                  $or->condition('field_sales_person_surname', $surname, 'CONTAINS');
                }
                $query->condition($or);

                $query->condition('status', 1);
                $nids = $query->execute();

                $datas = array();
                foreach ($storage->loadMultiple($nids) as $node) {
                  
                  $datas[] = API::GetFieldNode($node);
                }

                
                $response_array['result']           = TRUE;
                $response_array['execution_time']   = microtime(true) - $time1;
                $response_array['count']            = count($datas);
                $response_array['datas']            = $datas;

              }else{
                $response_array['result']   = FALSE;
                $response_array['message']  = 'Empty name, subname.';
              }
              break;
            }

            // find by bank account
            case '2':{
              $bank_account = trim( $content['bank_account'] );
              if( !empty($bank_account) ){
                $pids = \Drupal::entityQuery('paragraph')
                        ->condition('type', 'item_merchant_bank_account')
                        ->condition('field_bank_account', $bank_account, 'CONTAINS')
                        ->execute();

                $datas = array();
                foreach ($pids as $pid) {
                  $p = Paragraph::load($pid);
                  $parent = $p->getParentEntity();

                  if(!empty($parent)){
                    $node = Node::load($parent->id());
                    $datas[] = API::GetFieldNode($node);
                  }
                }

                $response_array['result']           = TRUE;
                $response_array['execution_time']   = microtime(true) - $time1;
                $response_array['count']            = count($datas);
                $response_array['datas']            = $datas;
              }else{
                $response_array['result']   = FALSE;
                $response_array['message']  = 'Empty bank account.';
              }
              break;
            }

            // id card or pass port
            case '3':{
              $id_card      = trim( $content['id_card'] );

              if( !empty($id_card) ){

                // $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery();
                // $storage = \Drupal::entityTypeManager()->getStorage('node');

                $storage = $this->entityTypeManager->getStorage('node');
                $query = $storage->getQuery();
                $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
                $query->condition('type', 'back_list');
                $query->condition('field_id_card_number', $id_card, 'CONTAINS');

                // $or = $query->orConditionGroup();
                // if(!empty($name)){
                  // $or->condition('field_id_card_number', $id_card, 'CONTAINS');
                // }
                // $query->condition($or);

                // $query->condition('status', 1);
                $nids = $query->execute();

                $datas = array();
                foreach ($storage->loadMultiple($nids) as $node) {
                  
                  $datas[] = API::GetFieldNode($node);
                }

                $response_array['result']           = TRUE;
                $response_array['execution_time']   = microtime(true) - $time1;
                $response_array['count']            = count($datas);
                $response_array['datas']            = $datas;

              }else{
                $response_array['result']   = FALSE;
                $response_array['message']  = 'Empty id_card';
              }

              break;
            }

            // websit self
            case '4':{

              $selling_website      = trim( $content['selling_website'] );

              if( !empty($selling_website) ){

                // $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery();
                // $storage = \Drupal::entityTypeManager()->getStorage('node');

                $storage = $this->entityTypeManager->getStorage('node');
                $query = $storage->getQuery();
                $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
                $query->condition('type', 'back_list');
                $query->condition('field_selling_website', $selling_website, 'CONTAINS');

                $nids = $query->execute();

                $datas = array();
                foreach ($storage->loadMultiple($nids) as $node) {
                  
                  $datas[] = API::GetFieldNode($node);
                }

                $response_array['result']           = TRUE;
                $response_array['execution_time']   = microtime(true) - $time1;
                $response_array['count']            = count($datas);
                $response_array['datas']            = $datas;

              }else{
                $response_array['result']   = FALSE;
                $response_array['message']  = 'Empty selling_website';
              }
              break;
            }

            default:{
              $response_array['result']   = FALSE;
              $response_array['message']  = 'Not match type.';
            }
          }
        }else{
          $response_array['result']   = FALSE;
          $response_array['message']  = 'Not match type.';
        }
        // return new JsonResponse( $response );  

        // Add the node_list cache tag so the endpoint results will update when nodes are
        // updated.
        $cache_metadata = new CacheableMetadata();
        $cache_metadata->setCacheTags(['check_banlist']);

        // Create the JSON response object and add the cache metadata.
        $response = new CacheableJsonResponse($response_array);
        $response->addCacheableDependency($cache_metadata);

        return $response;
      // }

      // $response['result']   = FALSE;
      // return new JsonResponse( $response );
    } catch (\Throwable $e) {
      \Drupal::logger('CheckBanlist')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  private function GetFieldNode($node){
    $data = array();
    $data['owner_id'] = $node->getOwnerId();
    $data['id']       = $node->id();
    $data['title']    = $node->label();

    // 2. ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
    $sales_person_name = '';
    $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
    if(!empty($field_sales_person_name)){
        $sales_person_name = $field_sales_person_name[0]['value'];
    }

    $data['name']  = $sales_person_name;

    // 3. นามสกุลผู้รับเงินโอน
    $sales_person_surname = '';
    $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
    if(!empty($field_sales_person_surname)){
        $sales_person_surname = $field_sales_person_surname[0]['value'];
    }

    $data['surname']  = $sales_person_surname;

    // รายละเอียด
    $detail = '';
    $body = $node->get('body')->getValue();
    if(!empty($body)){
      $detail = htmlspecialchars($body[0]['value']);
    }
    $data['detail']  = $detail;

    $merchant_bank_accounts = array();
    foreach ($node->get('field_merchant_bank_account')->getValue() as $mi=>$mv){
        
      $merchant_bank_account = array();
      $p = Paragraph::load( $mv['target_id'] );
      
      // เลขบัญชี
      $field_bank_account = $p->get('field_bank_account')->getValue();
      if(!empty($field_bank_account)){
          $bank_account = $field_bank_account[0]['value'];
          $merchant_bank_account['bank_account'] = $bank_account;
      } 

      // ธนาคาร/ระบบ Wallet
      $bank_wallet_target_id = $p->get('field_bank_wallet')->target_id;
      if(!empty($bank_wallet_target_id)){
        $bank_wallet = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($bank_wallet_target_id);
        $merchant_bank_account['bank_wallet'] = $bank_wallet_target_id;//$bank_wallet->label();
      }
      
      $merchant_bank_accounts[] = $merchant_bank_account;
    }
    $data['banks']  = $merchant_bank_accounts;

    // รูปภาพประกอบ
    $images = array();
    foreach ($node->get('field_images')->getValue() as $imi=>$imv){
      // dpm( Utils::get_file_uri($imv['target_id']) );
      // $images[] = Utils::get_file_url($imv['target_id']);

      $images['medium'][]    = array('fid'=>$imv['target_id'], 'url'=> Utils::ImageStyle_BN($imv['target_id'], 'bn_medium')) ;
      $images['thumbnail'][] = array('fid'=>$imv['target_id'], 'url'=> Utils::ImageStyle_BN($imv['target_id'], 'bn_thumbnail')) ;
    }
    $data['images']  = $images;

    // ยอดเงิน
    $transfer_amount = number_format($node->get('field_transfer_amount')->getValue()[0]['value'], 2, '.', ',');

    $data['transfer_amount']  = $transfer_amount;
    $data['link']  = Utils::get_base_url() . 'node/' . $node->id();

    // id card or pass port
    $id_card = '';
    $field_id_card_number = $node->get('field_id_card_number')->getValue();
    if(!empty($field_id_card_number)){
      $id_card = $field_id_card_number[0]['value'];
    } 
    $data['id_card'] = $id_card;

    // field_selling_website
    $selling_website = '';
    $field_selling_website = $node->get('field_selling_website')->getValue();
    if(!empty($field_selling_website)){
      $selling_website = $field_selling_website[0]['value'];
    } 
    $data['selling_website'] = $selling_website;


    // field_transfer_date
    $transfer_date = '';
    $field_transfer_date = $node->get('field_transfer_date')->getValue();
    if(!empty($field_transfer_date)){
      $transfer_date = $field_transfer_date[0]['value'];
    } 
    $data['transfer_date'] = $transfer_date;

    return $data;
  }

  public function AddedBanlist(Request $request){
    $response_array = array();
    try {
      
      $time1    = microtime(true);

      // $response_array['result']   = TRUE;
      // $response_array['_REQUEST'] = $_REQUEST;
      // $response_array['_FILES']   = $_FILES;

      // $response_array['items_merchant_bank_account']   =json_decode($_REQUEST['items_merchant_bank_account']);

      // $response_array['total'] = count($_FILES['files']['name']);
      // $response_array['execution_time']   = microtime(true) - $time1;
      // return new JsonResponse( $response_array ); 

      // if ( Utils::verify($request, FALSE) ) {


      // $response['images']   = $content['images'];//\Drupal::request()->files->get('files', array());  ;

      /*
      $response['target'] = $request->query->get('attached_file');//isset(\Drupal::request()->request->get('attached_file')) ? \Drupal::request()->request->get('attached_file') : FALSE;

      $postReq = \Drupal::request()->request->all();

      $response['attached_file'] = $postReq['attached_file'];
      $response['postReq'] = mb_convert_encoding($postReq, 'UTF-8', 'UTF-8') ;

      // \Drupal::logger('added-banlist')->notice(serialize($postReq));

      // $response['$_FILES']  = serialize( $_FILES["photo"] );

      if(!empty($_FILES)){
        // $target = 'sites/default/files/'. $_FILES['attached_file']['name'];
        // move_uploaded_file( $_FILES['attached_file']['tmp_name'], $target);

        // $attached_file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'.png' , FILE_EXISTS_RENAME);

        $response['$_FILES']  = 'YES';
      }else{
        $response['$_FILES']  = 'NO';
      }
      */

      // $node = Node::create([
      //   'type'                   => 'user_deposit',
      //   'uid'                    => $uid,
      //   'status'                 => 1,
      //   'title'                  => "ฝากเงิน : " . $user->getUsername(),

      //   'field_huay_list_bank'   => $hauy_id_bank,        // ธนาคารของเว็บฯ ที่โอนเข้า
      //   'field_list_bank'        => $user_id_bank,        // ธนาคารที่ทำการโอนเงินเข้ามา
      //   'field_transfer_method'  => $transfer_method,     // ช่องทางการโอนเงิน
      //   'field_amount'           => $amount,              // จำนวนเงินที่โอน
      //   'field_attached_file'    => empty($attached_file) ? array() : array('target_id'=>$attached_file->id()),
      //   'field_date_transfer'    => date('Y-m-d\TH:i:s', $date_transfer/1000),       // วัน-เวลาโอน
      //   'body'                   => $note,                // หมายเหตุ
      // ]);
      // $node->save();

      /*
      product_type   : สินค้า/ประเภท
      transfer_amount: ยอดเงิน
      person_name    : ชื่อบัญชี ผู้รับเงินโอน
      person_surname : นามสกุล ผู้รับเงินโอน
      id_card_number : เลขบัตรประชาชนคนขาย
      selling_website: เว็บไซด์ประกาศขายของ
      transfer_date  : วันโอนเงิน
      details        : รายละเอียดเพิ่มเติม

      merchant_bank_account : บัญชีธนาคารคนขาย
      // options
      // 1: ธนาคารกรุงศรีอยุธยา
      // 2: ธนาคารกรุงเทพ
      // 3: ธนาคารซีไอเอ็มบี  
      // 4: ธนาคารออมสิน
      // 5: ธนาคารอิสลาม
      // 6: ธนาคารกสิกรไทย
      // 7: ธนาคารเกียรตินาคิน
      // 8: ธนาคารกรุงไทย
      // 9: ธนาคารไทยพาณิชย์
      // 10: Standard Chartered
      // 11: ธนาคารธนชาติ
      // 12: ทิสโก้แบงค์
      // 13: ธนาคารทหารไทย
      // 14: ธนาคารยูโอบี
      // 15: ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
      // 16: True Wallet
      // 17: พร้อมเพย์ (PromptPay)
      // 18: ธนาคารอาคารสงเคราะห์
      // 19: AirPay (แอร์เพย์)
      // 20: mPay
      // 21: 123 เซอร์วิส
      // 22: ธ.ไทยเครดิตเพื่อรายย่อย
      // 23: ธนาคารแลนด์แอนด์เฮ้าส์
      // 24: เก็บเงินปลายทาง 

      images                : รูปภาพประกอบ
      */

      /*
      product_type   : สินค้า/ประเภท
      transfer_amount: ยอดเงิน
      person_name    : ชื่อบัญชี ผู้รับเงินโอน
      person_surname : นามสกุล ผู้รับเงินโอน
      id_card_number : เลขบัตรประชาชนคนขาย
      selling_website: เว็บไซด์ประกาศขายของ
      transfer_date  : วันโอนเงิน
      details        : รายละเอียดเพิ่มเติม
      */

      /*
      $uid            = trim( $_REQUEST['uid'] );

      if(!empty($_FILES)){
        $target = 'sites/default/files/'. $_FILES['file']['name'];
        move_uploaded_file( $_FILES['file']['tmp_name'], $target);

        $file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'_'.mt_rand().'.png' , FileSystemInterface::EXISTS_REPLACE);

        $user = User::load($uid);
        if(!empty($user)){
          $user->set('user_picture', $file->id());
          $user->save();
        }

        $response_array['image_url']  =  file_create_url($file->getFileUri());
      }
      */

      // $content        = json_decode( $request->getContent(), TRUE );

      // $basic_auth     = trim( $_REQUEST['basic_auth'] );

      $nid        = trim( $_REQUEST['nid'] );            // new/edit
      $product_type   = trim( $_REQUEST['product_type'] );       // สินค้า/ประเภท
      $transfer_amount= trim( $_REQUEST['transfer_amount'] );    // ยอดเงิน
      $person_name    = trim( $_REQUEST['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
      $person_surname = trim( $_REQUEST['person_surname'] );     // นามสกุล ผู้รับเงินโอน
      $id_card_number = trim( $_REQUEST['id_card_number'] );     // เลขบัตรประชาชนคนขาย
      $selling_website= trim( $_REQUEST['selling_website'] );    // เว็บไซด์ประกาศขายของ
      $transfer_date  = trim( $_REQUEST['transfer_date'] );      // วันโอนเงิน
      $details        = trim( $_REQUEST['detail'] );            // รายละเอียดเพิ่มเติม
      $merchant_bank_account   = json_decode($_REQUEST['merchant_bank_account']); // บัญชีธนาคารคนขาย
      // $images         = $content['images'];            // รูปภาพประกอบ
      
      // $response_array['result']   = TRUE;
      // $response_array['execution_time']   = microtime(true) - $time1;
      // $response_array['merchant_bank_account'] = $merchant_bank_account;
      // $response_array['eee'] = $_REQUEST['merchant_bank_account'];
      // return new JsonResponse( $response_array ); 

      /*
          { "product_type"   : "product_type 1",
            "transfer_amount": 500,
            "person_name"    : "person_name 1",
            "person_surname" : "person_surname 1",
            "id_card_number" : 2138123412,
            "selling_website": "http://banlist.info",
            "transfer_date"  : "2021-01-19",
            "details"        : "details 1",
            "images":[{"type": "type 1", "image":'', "name":"name 1", "extension": "png"}, 
                      {"type": "type 2", "image":"dfasfd", "name":"name 2", "extension": "png"}, 
                      {"type": "type 3", "image":"dfasfd", "name":"name 3", "extension": "png"}],

            "merchant_bank_account":[{"bank_account": "1234", "bank_wallet": 15}]
          }
      */
      if( empty(trim($product_type))   || 
          empty(trim($person_name))    || 
          empty(trim($person_surname)) ||
          empty(trim($transfer_date)) ||
          empty(trim($details)) ){

        $response_array['result']   = FALSE;
        $response_array['product_type']   = $product_type;
        $response_array['person_name']   = $person_name;
        $response_array['person_surname']   = $person_surname;
        $response_array['transfer_date']   = $transfer_date;
        $response_array['details']   = $details;
        $response_array['message']  = 'Empty product_type or person_name or person_surname or transfer_date or details';
        // $response['execution_time']   = microtime(true) - $time1;
        return new JsonResponse( $response_array );  
      }

      $merchant_bank_account_paragraphs =array();
      foreach ($merchant_bank_account as $ii=>$vv){
        $item_merchant = Paragraph::create([
          'type'                    => 'item_merchant_bank_account',
          'field_bank_account'      => $vv->bank_account,
          'field_bank_wallet'       => $vv->bank_wallet, 
        ]);
        $item_merchant->save();
        $merchant_bank_account_paragraphs[] = array('target_id'=> $item_merchant->id(), 'target_revision_id' => $item_merchant->getRevisionId());
      }
      
      // $images_fids = array();
      // foreach ($images as $imi=>$imv){
      //   $file = file_save_data(base64_decode($imv['image']), 'public://'. date('m-d-Y_hia') . '.' . ( empty($imv['extension']) ? 'png': $imv['extension']), FileSystemInterface::EXISTS_RENAME);
      //   $images_fids[] = array(
      //     'target_id' => $file->id(),
      //     'alt' => '',
      //     'title' => empty($imv['name']) ? '' : $imv['name']
      //   );
      // }

  

      // $response['images_fids']  = $images_fids;
      /*
      $product_type   = trim( $content['product_type'] );       // สินค้า/ประเภท
      $transfer_amount= trim( $content['transfer_amount'] );    // ยอดเงิน
      $person_name    = trim( $content['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
      $person_surname = trim( $content['person_surname'] );     // นามสกุล ผู้รับเงินโอน
      $id_card_number = trim( $content['id_card_number'] );     // เลขบัตรประชาชนคนขาย
      $selling_website= trim( $content['selling_website'] );    // เว็บไซด์ประกาศขายของ
      $transfer_date  = trim( $content['transfer_date'] );      // วันโอนเงิน
      $details        = trim( $content['details'] );            // รายละเอียดเพิ่มเติม
      $merchant_bank_account   = $content['merchant_bank_account']; // บัญชีธนาคารคนขาย
      $images         = $content['images'];                     // รูปภาพประกอบ
      */
      
      if(!empty($nid) && $nid !=  'undefined' ){
        $node = Node::load($nid);
        $node->setChangedTime((new \DateTime('now'))->getTimestamp());

        if( strcmp($node->label(), $product_type) != 0 ){
          $node->title = $product_type;
        }

        $field_transfer_amount = $node->field_transfer_amount->getValue();
        if(!empty($field_transfer_amount)){
          $field_transfer_amount = $field_transfer_amount[0]['value'];

          if( strcmp($field_transfer_amount, $transfer_amount) != 0 ){
            $node->field_transfer_amount = $transfer_amount;
          }
        }else{
          $node->field_transfer_amount = $transfer_amount;
        }

        $field_sales_person_name = $node->field_sales_person_name->getValue();
        if(!empty($field_sales_person_name)){
          $field_sales_person_name = $field_sales_person_name[0]['value'];

          if( strcmp($field_sales_person_name, $person_name) != 0 ){
            $node->field_sales_person_name = $person_name;
          }
        }else{
          $node->field_sales_person_name = $person_name;
        }

        $field_sales_person_surname = $node->field_sales_person_surname->getValue();
        if(!empty($field_sales_person_surname)){
          $field_sales_person_surname = $field_sales_person_surname[0]['value'];

          if( strcmp($field_sales_person_surname, $person_surname) != 0 ){
            $node->field_sales_person_surname = $person_surname;
          }
        }else{
          $node->field_sales_person_surname = $person_surname;
        }

        $field_id_card_number = $node->field_id_card_number->getValue();
        if(!empty($field_id_card_number)){
          $field_id_card_number = $field_id_card_number[0]['value'];

          if( strcmp($field_id_card_number, $id_card_number) != 0 ){
            $node->field_id_card_number = $id_card_number;
          }
        }else{
          $node->field_id_card_number = $id_card_number;
        }


        $field_selling_website = $node->field_selling_website->getValue();
        if(!empty($field_selling_website)){
          $field_selling_website = $field_selling_website[0]['value'];

          if( strcmp($field_selling_website, $selling_website) != 0 ){
            $node->field_selling_website = $selling_website;
          }
        }else{
          $node->field_selling_website = $selling_website;
        }

        $body = $node->body->getValue();
        if(!empty($body)){
          $body = $body[0]['value'];
          if( strcmp($body, $details) != 0 ){
            $node->body = $details;
          }
        }else{
          $node->body = $details;
        }

        $node->save();

      }else{

        $images_fids = array();
        $total = count($_FILES['files']['name']);
        // Loop through each file
        for( $i=0 ; $i < $total ; $i++ ) {
  
          $target = 'sites/default/files/'. $_FILES['files']['name'][$i];
          move_uploaded_file( $_FILES['files']['tmp_name'][$i], $target);
  
          $file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'_'.mt_rand().'.png' , FileSystemInterface::EXISTS_REPLACE);
          $images_fids[] = array(
            'target_id' => $file->id(),
            'alt' => '',
            'title' => empty($_FILES['files']['name'][$i]) ? '' : $_FILES['files']['name'][$i]
          );
        }

        $node = Node::create([
          'type'                   => 'back_list',
          'uid'                    => \Drupal::currentUser()->id(),
          'status'                 => 1,
          'field_channel'          => 32,                // ถูกสร้างผ่านช่องทาง 31: Web, 32: Api
  
          'title'                  => $product_type,     // สินค้า/ประเภท
          'field_transfer_amount'  => $transfer_amount,  // ยอดเงิน
          'field_sales_person_name'=> $person_name,      // ชื่อบัญชี ผู้รับเงินโอน
          'field_sales_person_surname' => $person_surname, // นามสกุล ผู้รับเงินโอน
          'field_id_card_number'    => $id_card_number,  // เลขบัตรประชาชนคนขาย
          'field_selling_website'   => $selling_website, // เว็บไซด์ประกาศขายของ
          'field_transfer_date'     => date('Y-m-d',  $transfer_date),   // วันโอนเงิน
          'body'                    => $details,         // หมายเหตุ
          'field_merchant_bank_account' => $merchant_bank_account_paragraphs, // บัญชีธนาคารคนขาย
          'field_images'            => $images_fids      // รูปภาพประกอบ
        ]);
        $node->save();
      }
      
      // ------------ noti to user and fetch all my_apps new
      Utils::node_my_apps(\Drupal::currentUser()->id());
      // ------------
      
      $response_array['result']   = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      return new JsonResponse( $response_array );  
    } catch (\Throwable $e) {
      \Drupal::logger('AddedBanlist')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function SearchApi(Request $request){
    $response_array = array();
    try {
      $content = json_decode( $request->getContent(), TRUE );
      $key_word= trim( $content['key_word'] );
      $offset  = trim( $content['offset'] );
      $type    = trim( $content['type'] );
      $full_text_fields = array();
      
      if(isset($content['full_text_fields'])){
        $full_text_fields = json_decode($content['full_text_fields']);
      }
      
      
      \Drupal::logger('SearchApi, full_text_fields : ')->notice( serialize($full_text_fields) );
/*
      if(!empty($key_word)){

        // \Drupal::logger('SearchApi')->notice( 'offset = %offset, type = %type, key_word = %key_word', 
        //                                       array('%offset'=>$offset, '%type'=>$type, '%key_word'=>$key_word));

        $index = Index::load('content_back_list');
        $query = $index->query();

        // Change the parse mode for the search.
        $parse_mode = \Drupal::service('plugin.manager.search_api.parse_mode')->createInstance('direct');
        $parse_mode->setConjunction('OR');
        $query->setParseMode($parse_mode);

        $query->addCondition('type', 'back_list');

       

        
        // type : 
        //    default : all
        //    1 : title
        //    2 : name
        //    3 : surname
        //    4 : detail
        //    5 : name & surname


        //    8 : by nids ex. nids = array(1,2,3,4)
        

        switch($type){
          case 0:{
            $query->sort('nid', 'DESC');
            // $query->range(2,2);

            break;
          }

          case 1:{
            $query->addCondition('title', $key_word);
            break;
          }

          case 2:{
            $query->addCondition('field_sales_person_name', $key_word);
            break;
          }

          case 3:{
            $query->addCondition('field_sales_person_surname', $key_word);
            break;
          }

          case 4:{
            $query->addCondition('body', $key_word);
            break;
          }

          case 5:{
            $ky = explode("&", $key_word);
            if(count($ky) > 1){
              $query->addCondition('field_sales_person_name', $ky[0]);
              $query->addCondition('field_sales_person_surname', $ky[1]);
            }else{
              $query->addCondition('field_sales_person_name', $ky[0]);
            }

            break;
          }

          case 8:{
            $key_word = json_decode($key_word);
            // \Drupal::logger('SearchApi, case 8')->notice($key_word);
            $query->addCondition('nid', $key_word, "IN");
            break;
          }

          default:{
            // Set fulltext search keywords and fields.
            $query->keys($key_word);
            $query->setFulltextFields([ 'title', 'field_sales_person_name', 'field_sales_person_surname', 'body', 'field_selling_website']);

            break;
          }

        }

        // Set additional conditions.
        $query->addCondition('status', 1);

        // Restrict the search to specific languages.
        // $query->setLanguages(['th', 'en']);

        $pagging = 30; 

        $start = 0;
        $end   = $pagging;
        if(empty($offset)){
        
        }else{
          if($offset > 0){
            $start = ($pagging * $offset) + 1;
            // $end   = $pagging * ($offset + 1);
          }
        }

        $query->range($start, $end);

        // Execute the search.
        $results = $query->execute();

        $count = count($results->getResultItems());
        // echo "Result count: { $count }\n";

        // $ids = implode(', ', array_keys($results->getResultItems()));
        // echo "Returned IDs: $ids.\n";

        $datas = array();
        foreach ($results as $result) {

          // $title[0]->getText()
          $item = array();

          $owner_id = 0;
          $result_uid    = $result->getField('uid')->getValues();
          if(!empty($result_uid)){
            $owner_id = $result_uid[0];
          }
          
          $nid = 0;
          $result_nid    = $result->getField('nid')->getValues();
          if(!empty($result_nid)){
            $nid = $result_nid[0];
          }

          $title  = '';
          $result_title  = $result->getField('title')->getValues();
          if(!empty($result_title)){
            $title = $result_title[0];// ->getText();
          }

          $body   = '';
          $result_body   = $result->getField('body')->getValues();
          if(!empty($result_body)){
            $body = $result_body[0];//->getText();
          }

          $transfer_amount = 0;
          $result_transfer_amount = $result->getField('field_transfer_amount')->getValues();  
          if(!empty($result_transfer_amount)){
            $transfer_amount = $result_transfer_amount[0];
          }

          $name = '';
          $result_name = $result->getField('field_sales_person_name')->getValues();
          if(!empty($result_name)){
            $name = $result_name[0];// ->getText();
          }

          $surname = '';
          $result_surname = $result->getField('field_sales_person_surname')->getValues();
          if(!empty($result_surname)){
            $surname = $result_surname[0];// ->getText();
          }

          // รูปภาพประกอบ
          $images = array();
          try {
            foreach ($result->getField('field_images')->getValues() as $imi=>$imv){
              // $images[] = Utils::get_file_url($imv) ;
              $images['medium'][]    = array('fid'=>$imv, 'url'=> Utils::ImageStyle_BN($imv, 'bn_medium')) ;
              $images['thumbnail'][] = array('fid'=>$imv, 'url'=> Utils::ImageStyle_BN($imv, 'bn_thumbnail')) ;

              // \Drupal::logger('SearchApi')->notice($imv);
            }
          } catch (\Throwable $e) {
            \Drupal::logger('SearchApi')->notice($e->__toString());
          }

          // field_transfer_date
          $transfer_date = '';
          $field_transfer_date = $result->getField('field_transfer_date')->getValues();
          
          if(!empty($field_transfer_date)){
            $transfer_date = $field_transfer_date[0];
            // \Drupal::logger('SearchApi transfer_date')->notice( $transfer_date );
            // foreach ($transfer_date as $key => $value){
            //   \Drupal::logger('SearchApi transfer_date')->notice( 'key : ' . $key . ' value : ' . $value );
            // }
            
          }

          // ;
          $item = array('owner_id'=> $owner_id,
                        'id'      => $nid, 
                        'name'    => $name, 
                        'surname' => $surname, 
                        'title'   => $title,
                        'detail'  => $body,
                        'transfer_amount' => $transfer_amount,
                        'images'  => $images,
                        'transfer_date' => empty($transfer_date) ? '' : date('Y-m-d', strtotime($transfer_date))  );

          $datas[] = $item;
          
        }
        // dpm($output);

        $response_array['result']           = TRUE;
        $response_array['execution_time']   = microtime(true) - $time1;
        $response_array['count']            = $count;//count($response_array);
        $response_array['datas']            = $datas;
      }else{
        $response_array['result']   = FALSE;
        $response_array['message']  = 'Empty key_word.';
        $response_array['content']  = $content;
      }
*/

      if(empty($full_text_fields)){
        $response_array = Utils::search_api($key_word, $offset, $type);
      }else{
        $response_array = Utils::search_api($key_word, $offset, $type, $full_text_fields);
      }
      

      // Add the node_list cache tag so the endpoint results will update when nodes are
      // updated.
      $cache_metadata = new CacheableMetadata();
      $cache_metadata->setCacheTags(['search_api']);

      // Create the JSON response object and add the cache metadata.
      $response = new CacheableJsonResponse($response_array);
      $response->addCacheableDependency($cache_metadata);

      return $response;
    } catch (\Throwable $e) {
      \Drupal::logger('SearchApi')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function FetchApi(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      $nid_last= trim( $content['nid_last'] );

      // if(!empty($nid_last)){

        // $storage = \Drupal::entityTypeManager()->getStorage('node');

        $storage = $this->entityTypeManager->getStorage('node');
        $query = $storage->getQuery();
        $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
        $query->condition('type', 'back_list');

        if($nid_last){
          $query->condition('nid', $nid_last, '<');
        }

        $query->sort('nid', 'DESC');
        $query->range(0, 30);
        // $query->condition('field_id_card_number', $id_card, 'CONTAINS');

        // $or = $query->orConditionGroup();
        // if(!empty($name)){
        // $or->condition('field_id_card_number', $id_card, 'CONTAINS');
        // }
        // $query->condition($or);

        // $query->condition('status', 1);
        $nids = $query->execute();

        $datas = array();
        foreach ($storage->loadMultiple($nids) as $node) {
          $datas[] = API::GetFieldNode($node);
        }

        $response_array['result']           = TRUE;
        $response_array['execution_time']   = microtime(true) - $time1;
        $response_array['count']            = count($datas);
        $response_array['datas']            = $datas;

        // $response_array['result']           = TRUE;
        // $response_array['execution_time']   = microtime(true) - $time1;
        // $response_array['count']            = $count;//count($response_array);
        // $response_array['datas']            = $datas;
      // }else{
      //   $response_array['result']   = FALSE;
      //   $response_array['message']  = 'Empty offset.';
      // }

      // Add the node_list cache tag so the endpoint results will update when nodes are
      // updated.
      $cache_metadata = new CacheableMetadata();
      $cache_metadata->setCacheTags(['fetch_api']);

      // Create the JSON response object and add the cache metadata.
      $response = new CacheableJsonResponse($response_array);
      $response->addCacheableDependency($cache_metadata);

      return $response;
    } catch (\Throwable $e) {
      \Drupal::logger('FetchApi')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function FetchProfile(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);
      $content        = json_decode( $request->getContent(), TRUE );
      
      if (\Drupal::currentUser()->isAuthenticated()) {
        // This user is logged in.

        $user = User::load( \Drupal::currentUser()->id() );
        $name    = $user->getDisplayName();

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

        $profile = array( 'name'      =>  $display_name,
                          'email'     =>  $email,
                          'image_url' =>  $image_url,
                        );

        $response_array['result']           = TRUE;
        $response_array['profile']          = $profile;
        $response_array['execution_time']   = microtime(true) - $time1;
      } else {
        // This user is not logged in.
        
        $response_array['result']   = FALSE;
        $response_array['message']  = ' This user is not logged in.';
      }

      return new JsonResponse( $response_array );
    } catch (\Throwable $e) {
      \Drupal::logger('FetchProfile')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function UpdateProfile(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);
      $content        = json_decode( $request->getContent(), TRUE );
      $type            = trim( $_REQUEST['type'] );

      /*
      type: 
        1 = Display name
        2 = Image profile
      */
      switch($type){
        case 1:{
          $field_display_name            = trim( $_REQUEST['display_name'] );

          $user = User::load(\Drupal::currentUser()->id());
          if(!empty($user)){
            $user->set('field_display_name', $field_display_name);
            $user->save();
          }
         
          break;
        }

        case 2:{
          if(!empty($_FILES)){
            $target = 'sites/default/files/'. $_FILES['file']['name'];
            move_uploaded_file( $_FILES['file']['tmp_name'], $target);
    
            $file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'_'.mt_rand().'.png' , FileSystemInterface::EXISTS_REPLACE);
    
            $user = User::load(\Drupal::currentUser()->id());
            if(!empty($user)){
              $user->set('user_picture', $file->id());
              $user->save();
            }
    
            $response_array['image_url']  =  file_create_url($file->getFileUri());
          }

          break;
        }
      }

      

      $response_array['result']           = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      
      return new JsonResponse( $response_array );
    } catch (\Throwable $e) {
      \Drupal::logger('UpdateProfile')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function Report(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      $chioce  = json_decode($content['chioce']);
      $message = trim( $content['message'] );

      // $offset= trim( $content['offset'] );

      if( empty($chioce) || empty($message) ){
        $response_array['result']           = FALSE;
        $response_array['execution_time']   = microtime(true) - $time1;
        return new JsonResponse( $response_array );
      }

      \Drupal::logger('report')->notice('chioce : %chioce, message: %message',
      array(
          '%chioce' => $content['chioce'],
          '%message' => $message,
      ));

      $response_array['result']           = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      
      return new JsonResponse( $response_array );

    } catch (\Throwable $e) {
      \Drupal::logger('SearchApi')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function FetchMyPost(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      // $chioce  = json_decode($content['chioce']);
      // $message = trim( $content['message'] );

      // // $offset= trim( $content['offset'] );

      // if( empty($chioce) || empty($message) ){
      //   $response_array['result']           = FALSE;
      //   $response_array['execution_time']   = microtime(true) - $time1;
      //   return new JsonResponse( $response_array );
      // }

      // \Drupal::logger('report')->notice('chioce : %chioce, message: %message',
      // array(
      //     '%chioce' => $content['chioce'],
      //     '%message' => $message,
      // ));

      // $node = Node::load($parent->id());
      // $datas[] = API::GetFieldNode($node);

      // $storage = \Drupal::entityTypeManager()->getStorage('node');

      $storage = $this->entityTypeManager->getStorage('node');
      $query   = $storage->getQuery();
      // $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
      $query->condition('type', 'back_list');

      $query->condition('uid', \Drupal::currentUser()->id());
      $nids = $query->execute();

      $datas = array();
      foreach ($storage->loadMultiple($nids) as $node) {
        $datas[] = API::GetFieldNode($node);
      }

      // dpm(count($nids));

      $response_array['result']           = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      // $response_array['uid']              = \Drupal::currentUser()->id();
      // $response_array['session']          = \Drupal::service('session')->getId();
      $response_array['datas']               = $datas;
      return new JsonResponse( $response_array );

    } catch (\Throwable $e) {
      \Drupal::logger('FetchMyPost')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function FetchPostById(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      $data    = json_decode($content['data']);
      $datas   = array();
      foreach ($data as $nid) {
        $datas[] = API::GetFieldNode(Node::load($nid));
      }

      $response_array['result']           = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      $response_array['datas']            = $datas;
      return new JsonResponse( $response_array );

    } catch (\Throwable $e) {
      \Drupal::logger('FetchPostById')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function FetchProfileById(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      $data    = json_decode($content['data']);
      $datas   = array();
      foreach ($data as $uid) {
        $user = User::load($uid);
        $name    = $user->getDisplayName();
        $email   = $user->getEmail();
        $image_url = '';  
        if (!$user->get('user_picture')->isEmpty()) {
          $image_url = file_create_url($user->get('user_picture')->entity->getFileUri());
        }

        $datas[] = array(
                  'uid'       =>  $uid,
                  'name'      =>  $name,
                  'email'     =>  $email,
                  'image_url' =>  $image_url
                );
      }

      $response_array['result']           = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      $response_array['datas']            = $datas;
      return new JsonResponse( $response_array );

    } catch (\Throwable $e) {
      \Drupal::logger('SearchApi')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

  public function DeleteMyApp(Request $request){
    $response_array = array();
    try {
      $time1          = microtime(true);

      $content = json_decode( $request->getContent(), TRUE );
      $nid = trim( $content['nid'] );

      if(!empty($nid)){
        $node = $this->entityTypeManager->getStorage('node')->load($nid);
        // Check if node exists with the given nid.
        if ($node) {
          $node->delete();
        }

        $response_array['result']           = TRUE;
        $response_array['execution_time']   = microtime(true) - $time1;
      }else{
        $response_array['result']           = FALSE;
        $response_array['execution_time']   = microtime(true) - $time1;
      }

      return new JsonResponse( $response_array );
    } catch (\Throwable $e) {
      \Drupal::logger('SearchApi')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }

}
