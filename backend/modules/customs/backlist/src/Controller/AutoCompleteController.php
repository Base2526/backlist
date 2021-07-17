<?php

namespace Drupal\backlist\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Entity\Element\EntityAutocomplete;

use Drupal\backlist\Utils\Utils;
/**
 * Defines a route controller for watches autocomplete form elements.
 */
class AutoCompleteController extends ControllerBase {

  /**
   * The node storage.
   *
   * @var \Drupal\node\NodeStorage
   */
  protected $nodeStorage;

  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->nodeStroage = $entity_type_manager->getStorage('node');
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    // Instantiates this form class.
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * Handler for autocomplete Sales Person Name request.
   */
  public function handleAutocomplete(Request $request) {
    $results = [];
    $input = $request->query->get('q');
    $vid   = $request->query->get('vid');

    \Drupal::logger('handleAutocomplete')->error($vid);

    // Get the typed string from the URL, if it exists.
    if (!$input) {
      return new JsonResponse($results);
    }

    $input = Xss::filter($input);

    // switch($vid){
    //   case 'product_type':{

    //   break;
    //   }

    //   case 'sales_person_name':{

    //   break;
    //   }

    //   case 'reportor':{

    //   break;
    //   }
    // }

    if($vid == 'product_type' || $vid == 'sales_person_name'){

      $query = $this->nodeStroage->getQuery()
                ->condition('type', 'back_list')
                ->condition('title', $input, 'CONTAINS')
                ->groupBy('nid')
                ->sort('created', 'DESC')
                ->range(0, 10);
      if($vid == 'sales_person_name'){
        $query = $this->nodeStroage->getQuery()
                ->condition('type', 'back_list')
                ->condition('field_sales_person_name', $input, 'CONTAINS')
                ->groupBy('nid')
                ->sort('created', 'DESC')
                ->range(0, 10);
      }

      $ids = $query->execute();
      $nodes = $ids ? $this->nodeStroage->loadMultiple($ids) : [];

      foreach ($nodes as $node) {
        switch ($node->isPublished()) {
          case TRUE:
            $availability = '✅';
            break;

          case FALSE:
          default:
            $availability = '🚫';
            break;
        }

        
        $label = [
          $node->getTitle(),
          // '<small>(' . $node->id() . ')</small>',
          $availability,
        ];

        if($vid == 'sales_person_name'){
          $label = [
            Utils::truncate($node->get('field_sales_person_name')->getValue()[0]['value'], 50, ''),
            // '<small>(' . $node->id() . ')</small>',
            $availability,
          ];
        }

        $results[] = [
          'value' => $label[0],//EntityAutocomplete::getEntityLabels([$node]),
          'label' => implode(' ', $label),
        ];
      }

      \Drupal::logger('handleAutocomplete > v')->error(serialize($results));

      return new JsonResponse($results);
    }else if($vid == 'reportor'){
      // $results[] = [
      //   'value' => 'test(10)',
      //   'label' => implode(' ', 'test'),
      // ];

      $userStorage = \Drupal::entityTypeManager()->getStorage('user');

      $query = $userStorage->getQuery();
      $uids = $query
        // ->condition('status', '1')
        // ->condition('roles', 'moderator')
        ->condition('name', $input, 'CONTAINS')
        ->execute();

      // dpm($uids);

      $users = $userStorage->loadMultiple($uids);
      foreach ($users as $user){
        $name = $user->get('name')->value;
        // dpm($name);

        $results[] = [
          'value' => $name,
          'label' => implode(' ', $name),
        ];
      }

      return new JsonResponse($results);
    }
  }
}