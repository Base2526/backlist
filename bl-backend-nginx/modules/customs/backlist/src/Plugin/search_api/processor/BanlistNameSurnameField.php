<?php

namespace Drupal\backlist\Plugin\search_api\processor;

use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Processor\ProcessorPluginBase;
use Drupal\search_api\Processor\ProcessorProperty;

// use Drupal\paragraphs\Entity\Paragraph;

/**
 * Adds a custom type filter to the indexed data.
 *
 * @SearchApiProcessor(
 *   id = "banlist_name_surname",
 *   label = @Translation("Banlist - Name Surname field"),
 *   description = @Translation("Add a Name Surname field to search index"),
 *   stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = false,
 * )
 */
// refer : https://gist.github.com/DuaelFr/90aed6d0e956b2351f6cd6327f2d4a61
class BanlistNameSurnameField extends ProcessorPluginBase {

  /**
   * machine name of the processor.
   * @var string
   */
  protected $processor_id = 'banlist_name_surname_field';

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {
    $properties = array();

    if (!$datasource) {
      $definition = array(
        'label' => $this->t('Banlist - Name Surname field'),
        'description' => $this->t('Banlist - Name Surname field'),
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
    $name_surname = '';

    // จะเป็น Node สามารถดึงค่าได้ปกติ
    $node = $item->getOriginalObject()->getValue();
    if(!empty($node)){

      $sales_person_name = '';
      try {
        // 1. ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
        $node_field_sales_person_name =  $node->get('field_sales_person_name');
        if(!empty($node_field_sales_person_name)){
          $field_sales_person_name = $node_field_sales_person_name->getValue();
          if(!empty($field_sales_person_name)){
            $sales_person_name = $field_sales_person_name[0]['value'];
          }
        }
      } catch (\Throwable $e) {
        \Drupal::logger('SearchApi images : ')->notice($e->__toString());
      }
      
      $sales_person_surname = '';
      try {
        // 2. นามสกุลผู้รับเงินโอน
        $node_field_sales_person_surname = $node->get('field_sales_person_surname');
        if(!empty($node_field_sales_person_surname)){
          $field_sales_person_surname = $node_field_sales_person_surname->getValue();
          if(!empty($field_sales_person_surname)){
            $sales_person_surname = $field_sales_person_surname[0]['value'];
          }
        }
      } catch (\Throwable $e) {
        \Drupal::logger('SearchApi BanlistNameSurnameField : ')->notice($e->__toString());
      }
     
      $name_surname = trim( trim( $sales_person_name ) .' '. trim( $sales_person_surname ) );
    }
    
    $fields = $this->getFieldsHelper()
      ->filterForPropertyPath($item->getFields(), NULL, $this->processor_id);
    foreach ($fields as $field) {
      $field->addValue( $name_surname );
    }
  }
}
