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

use Drupal\backlist\Utils\Utils;

/**
 * Provides a resource to create new article.
 *
 * @RestResource(
 *   id = "search_api_resource",
 *   label = @Translation("Banlist : Search api"),
 *   uri_paths = {
 *     "create" = "/v1/search",
 *   }
 * )
 */
class SearchApiResource extends ResourceBase {

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

  /**
   * Responds to POST requests.
   */
  public function post($data) {
    $response_array = array();

    if(empty($data)){
        throw new AccessDeniedHttpException();
    }

    try {

        $key_word= trim( $data['key_word'] );

        if(empty( $key_word )){
            $response_array['result']   = FALSE;
            $response_array['message']  = "Empty params";
            return new JsonResponse( $response_array );
        }

        $offset  = trim( $data['offset'] );
        $type    = trim( $data['type'] );
        $full_text_fields = array('title', 'field_sales_person_name', 'field_sales_person_surname', 'body', 'field_selling_website');
        
        if(isset($data['full_text_fields'])){
            $full_text_fields = json_decode($content['full_text_fields']);
        }

        $response_array = Utils::search_api($key_word, $offset, $type, $full_text_fields);
        
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
}