<?php

namespace Drupal\example_rest\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\Entity\Node;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Psr\Log\LoggerInterface;
#use Drupal\token_auth\Authentication\Provider\TokenAuth;
/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "example_post_rest_resource",
 *   label = @Translation("Custom rest resource"),
 *   serialization_class = "Drupal\node\Entity\Node",
 *   uri_paths = {
 *     "canonical" = "/api/custom",
 *     "https://www.drupal.org/link-relations/create" = "/api/custom"
 *   }
 * )
 */

class ExamplePostRestResource extends ResourceBase {
  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  //protected $tokenAuth;

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
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
   // $this->tokenAuth = $tokenAuth;
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
      $container->get('logger.factory')->get('example_rest'),
      $container->get('current_user')
     // $container->get('authentication.token_auth')
    );
  }

  /**
   * Responds to POST requests.
   *
   * Returns a list of bundles for specified entity.
   *
   * @param $node_type
   * @param $data
   * @return \Drupal\rest\ResourceResponse Throws exception expected.
   * Throws exception expected.
   */
  public function post($data) {
    \Drupal::logger('example_rest')->info('Node Type: ' . print_r($data, TRUE));
    // You must to implement the logic of your REST Resource here.
    // Use current user after pass authentication to validate access.
    if (!$this->currentUser->hasPermission('access content')) {
      throw new AccessDeniedHttpException();
    }
    // Prepare Node Object
    // $node = Node::create(
    //   array(
    //     'type' => $data['type'][0]['target_id'],
    //     'title' => $data['title'][0]['value'],
    //     'body' => [
    //       'summary' => '',
    //       'value' => $data['body'][0]['value'],
    //       'format' => 'full_html',
    //     ],
    //   )
    // );
    // // Node Save
    // $node->save();
    // Return Response
    return new ResourceResponse( $data );

  }
}