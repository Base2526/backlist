<?php


namespace Drupal\backlist\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;

use Drupal\Core\Url;

use Drupal\backlist\Utils\Utils;

/**
 * Provides a 'Bigcard' block.
 *
 * @Block(
 *   id = "top_head_content_block",
 *   admin_label = @Translation("Bigcard: Top head content")
 * )
 */
class TopHeadContentBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $block  = array();
    $params = array();

    $language =  \Drupal::languageManager()->getCurrentLanguage()->getId();

    // $menu_name = 'menu-my-bigcard';

    // $menu_tree = \Drupal::menuTree();
    // $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    // $parameters->setMinDepth(0);
    // //Delete comments to have only enabled links
    // //$parameters->onlyEnabledLinks();

    // $tree = $menu_tree->load($menu_name, $parameters);
    // $manipulators = array(
    //   array('callable' => 'menu.default_tree_manipulators:checkAccess'),
    //   array('callable' => 'menu.default_tree_manipulators:generateIndexAndSort'),
    // );
    // $tree = $menu_tree->transform($tree, $manipulators);
    // $params = [];

    // foreach ($tree as $item) {
     
    //   $title = $item->link->getTitle();
    //   $url = $item->link->getUrlObject()->toString();
    //   $params[] = array('title'=>$title, 'url'=>$url);//Link::fromTextAndUrl($title, $url);
    // }
    $path_en = Utils::get_base_url()  . 'en';
    $path_th = Utils::get_base_url()  . 'th';
    // if(!\Drupal::service('path.matcher')->isFrontPage()){
    //   $path_en .= \Drupal::service('path.current')->getPath();
    //   $path_th .= \Drupal::service('path.current')->getPath();
    // }
    $params['language']['en'] = $path_en;
    $params['language']['th'] = $path_th; 

    $logged_in = \Drupal::currentUser()->isAuthenticated();

    $params['active'] = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $params['lang'] = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $params['logged_in'] = $logged_in;

    $block =[
              '#theme'     => 'top-head-content-block',
              '#params'    => $params,
            ];

    $build['top_head_content_block'] = $block;
    return $build;
  }
}