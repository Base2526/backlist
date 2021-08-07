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
use Drupal\node\Entity\Node;

use Drupal\backlist\Utils\Utils;

/**
 * Provides a resource to create new article.
 *
 * @RestResource(
 *   id = "get_html_resource",
 *   label = @Translation("Banlist : get html"),
 *   uri_paths = {
 *     "create" = "/v1/get_html",
 *   }
 * )
 */
class GetHTMLResource extends ResourceBase {

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

    $time1    = microtime(true);
    try{
      $content = $data;//json_decode( $request->getContent(), TRUE );
      $nid = trim( $content['nid'] );

      if(!empty($nid)){
        $node = Node::load($nid);
        $body = $node->get('body')->getValue();
        if(!empty($body)){
          $response_array['data']  = $body[0]['value'];
        }

        $response_array['result']  = TRUE;
        $response_array['execution_time']   = microtime(true) - $time1;

        return new JsonResponse( $response_array );
      }

      $response_array['result']  = FALSE;
      $response_array['execution_time']   = microtime(true) - $time1;
      return new JsonResponse( $response_array );
    } catch (\Throwable $e) {
      \Drupal::logger('GetHTML')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      $response_array['execution_time']   = microtime(true) - $time1;
      
      return new JsonResponse( $response_array );
    }
  }
}