<?php

namespace Drupal\backlist\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Drupal\bigcard\Utils\Utils;

/**
 * Provides a 'Bigcard' block.
 *
 * @Block(
 *   id = "footer_backlist",
 *   admin_label = @Translation("Backlist: Footer")
 * )
 */
class FooterBacklistBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    // $footer_array = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('footer');
    // // dpm($footer_array);
    // $footer_tree = array();
    // foreach($footer_array as $footer_key => $footer_item){
    //   // dpm($footer_item);

    //   $parent = $footer_item->parents[0];
    //   $name = $footer_item->name;
    //   $tid = $footer_item->tid;

    //   $link = '/' .\Drupal::languageManager()->getCurrentLanguage()->getId();
    //   if(!empty(\Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid)->get('field_link')->getValue())){
    //     $link = '/' .\Drupal::languageManager()->getCurrentLanguage()->getId() .\Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid)->get('field_link')->getValue()[0]['value'];
    //   }
      
    //   if($parent == '0'){
    //     // no parent
    //     $footer_tree[$tid] = array();
    //     $footer_tree[$tid]['name'] = $name;
    //     $footer_tree[$tid]['link'] = $link;
    //   }else{
    //     // has parent
    //     $footer_tree[$parent][$tid]['name'] = $name;
    //     $footer_tree[$parent][$tid]['link'] = $link;
    //   }
    // }
    // // dpm($footer_tree);

    $params = array();
    $params['module_path'] = drupal_get_path('module', 'backlist');

    $block = array();
    $block =[
              '#theme'     => 'footer-backlist-block',
              '#params'    => $params,
            ];

            // drupal_get_path('module', 'backlist')

    $build['footer_backlist'] = $block;
    return $build;
  }
}
