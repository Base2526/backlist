<?php

namespace Drupal\backlist\Plugin\search_api\processor;

use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Processor\ProcessorPluginBase;
use Drupal\search_api\Processor\ProcessorProperty;

use Drupal\paragraphs\Entity\Paragraph;

/**
 * Adds a custom type filter to the indexed data.
 *
 * @SearchApiProcessor(
 *   id = "banlist_book_bank",
 *   label = @Translation("Banlist - Book bank field"),
 *   description = @Translation("Add a Book bank field to search index"),
 *   stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = false,
 * )
 */
// refer : https://gist.github.com/DuaelFr/90aed6d0e956b2351f6cd6327f2d4a61
class BanlistBookBankField extends ProcessorPluginBase {

  /**
   * machine name of the processor.
   * @var string
   */
  protected $processor_id = 'banlist_book_bank_field';

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {
    $properties = array();

    if (!$datasource) {
      $definition = array(
        'label' => $this->t('Banlist - Book bank field'),
        'description' => $this->t('Banlist - Book bank field'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
      );
      $properties[$this->processor_id] = new ProcessorProperty($definition);
    }

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function addFieldValues(ItemInterface $item) {
    // $entity = $item->getOriginalObject()->getValue();

    // $custom_field = '';//$entity->getEntityType()->id();

    $bank_accounts = array();

    /*
    // $result_nid = $entity->getField('nid')->getValues();
    // if(!empty($result_nid)){
    //     $custom_field = $result_nid[0];
    // }

    if ($entity->getEntityType()->id() == 'node') {
        $custom_field = $entity->get('title')->getString();

        // dpm($entity->get('title'));

        // field_merchant_bank_account
        $field_merchant_bank_account = $entity->get('field_merchant_bank_account');
        \Drupal::logger('addFieldValues  field_merchant_bank_account : ')->notice( $field_merchant_bank_account->getString() );
        \Drupal::logger('addFieldValues  nid : ')->notice( $entity->get('nid')->getString() );

        // 
        \Drupal::logger('addFieldValues  field_images : ')->notice( $entity->get('field_images')->getString() );

    }
    // $result->getField('title')->getValues();
    */

    // จะเป็น Node สามารถดึงค่าได้ปกติ
    $node = $item->getOriginalObject()->getValue();
    // \Drupal::logger('addFieldValues  $paragraph->bundle() : ')->notice( $node );

    if(!empty($node)){

      try {
        $node_field_merchant_bank_account = $node->get('field_merchant_bank_account');
        foreach ($node_field_merchant_bank_account->getValue() as $value){
          $p = Paragraph::load( $value['target_id'] );
        
          // เลขบัญชี
          $field_bank_account = $p->get('field_bank_account')->getValue();
          if(!empty($field_bank_account)){
              $bank_accounts[] = trim( $field_bank_account[0]['value'] );
          } 
        }
      } catch (\Throwable $e) {
        \Drupal::logger('SearchApi BanlistBookBankField : ')->notice($e->__toString());
      }
    }
    
    // dpm($bank_accounts);

    // Loop through paragraphs to find a timeline.
    // foreach ($node->field_description as $description_item) {
    //     $paragraph = $description_item->entity;
    //     \Drupal::logger('addFieldValues  $paragraph->bundle() : ')->notice( $paragraph->bundle() );
    //     // if ($paragraph->bundle() === 'timeline') {
    //     //   $delta = $paragraph->field_timeline_dates->count() - 1;
    //     //   $value = $paragraph->field_timeline_dates->get($delta)->entity->field_date->value;
    //     //   break;
    //     // }
    // }

    // Use $entity to get custom field.

    $fields = $this->getFieldsHelper()
      ->filterForPropertyPath($item->getFields(), NULL, $this->processor_id);
    foreach ($fields as $field) {
    //   $field->addValue($custom_field);
    //   $field->addValue($custom_field);

      foreach($bank_accounts as $bank_account){
        $field->addValue($bank_account);
      }
    }
  }
}
