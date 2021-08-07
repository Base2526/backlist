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
 *   id = "reset_password_resource",
 *   label = @Translation("Banlist : reset password"),
 *   uri_paths = {
 *     "create" = "/v1/reset_password",
 *   }
 * )
 */
class ResetPasswordResource extends ResourceBase {

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
  /**
   * Responds to POST requests.
   */
  public function post($data) {
    $response_array = array();
    try {
      $time1    = microtime(true);

      $content = $data;//json_decode( $request->getContent(), TRUE );
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
}