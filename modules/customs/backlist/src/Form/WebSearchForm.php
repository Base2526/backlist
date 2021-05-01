<?php

/**
 * @file
 * Contains \Drupal\demo\Form\Multistep\MultistepTwoForm.
 */

namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\FormBase;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\RedirectCommand;

class WebSearchForm extends FormBase {

    // private $session;
    // public function __construct() {
    //     $this->session = \Drupal::request()->getSession();
    // }

    /**
     * {@inheritdoc}.
     */
    public function getFormId() {
        return 'WebSearchForm';
    }

    /**
     * {@inheritdoc}.
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
        try {
            // $is_open = $this->session->get('is_open', '0');

            $route_match    = \Drupal::service('current_route_match');
            $key_word       = \Drupal::request()->query->get('key_word');
            $filter         = \Drupal::request()->query->get('filter');

            $form['add_back_list'] = [
                '#type' => 'link',
                '#title' => t('+ สร้าง รายงานใหม่'),
                '#options'=>array(
                    'attributes'=>array(
                        'class'=>array('button')
                    ),
                ),
                '#url' => Url::fromRoute('node.add', ['node_type' => 'back_list']),
                '#prefix' => '<span class="add-list-button">',
                '#suffix' => '</span>'
            ];

            // $options = array();
            // $options["title"] = "สินค้า/ประเภท";
            // $options["field_sales_person_name"] = "ชื่อบัญชีผู้รับเงินโอน";
            // $options["field_sales_person_surname"] = "นามสกุลบัญชีผู้รับเงินโอน";
            // $options["field_id_card_number"] = "เลขบัตรประชาชนคนขาย";
            // $options["body"] = "รายละเอียด";
            // $options["banlist_book_bank_field"] = "บัญชีธนาคาร";

            // $form['is_open'] = array(
            //     '#type' => 'hidden',
            //     '#value' => empty($is_open) ? '0' : $is_open,
            // );

            $form['details'] = [
                '#type' => 'fieldset',
                '#title' => $this->t('หมวดหมู่การค้น'),
                // '#open' => empty($is_open) ? false : ($is_open == '1' ? true : false),
            ];

            // $form['details']['filter'] = array('#title' => t(''),
            //                                     '#type' => 'checkboxes',
            //                                     '#description' => t(''),
            //                                     '#options' => $options,
            //                                     '#default_value' => empty($filter) ? array('title') : $filter
            //                                     ); 

            /*
            $options = array();
            $options["title"] = "สินค้า/ประเภท";
            $options["field_sales_person_name"] = "ชื่อบัญชีผู้รับเงินโอน";
            $options["field_sales_person_surname"] = "นามสกุลบัญชีผู้รับเงินโอน";
            $options["field_id_card_number"] = "เลขบัตรประชาชนคนขาย";
            $options["body"] = "รายละเอียด";
            $options["banlist_book_bank_field"] = "บัญชีธนาคาร";
            */
            // dpm($filter);

            if(empty($filter)){
                $filter = array('title');
            }
            $form['details']['filter']['title'] = array(
                '#type' =>'checkbox',
                '#title'=>t('สินค้า/ประเภท'),
                '#default_value' => in_array("title", $filter), // for default checked and false is not checked
            );
            $form['details']['filter']['banlist_name_surname_field'] = array(
                '#type' =>'checkbox',
                '#title'=>t('ชื่อ-นามสกุล บัญชีผู้รับเงินโอน'),
                '#default_value' => in_array("banlist_name_surname_field", $filter), // for default checked and false is not checked
            );
            // $form['details']['filter']['field_sales_person_surname'] = array(
            //     '#type' =>'checkbox',
            //     '#title'=>t('นามสกุลบัญชีผู้รับเงินโอน'),
            //     '#default_value' => in_array("field_sales_person_surname", $filter), // for default checked and false is not checked
            // );
            $form['details']['filter']['field_id_card_number'] = array(
                '#type' =>'checkbox',
                '#title'=>t('เลขบัตรประชาชนคนขาย'),
                '#default_value' => in_array("field_id_card_number", $filter), // for default checked and false is not checked
            );
            $form['details']['filter']['body'] = array(
                '#type' =>'checkbox',
                '#title'=>t('รายละเอียด'),
                '#default_value' => in_array("body", $filter), // for default checked and false is not checked
            );
            $form['details']['filter']['banlist_book_bank_field'] = array(
                '#type' =>'checkbox',
                '#title'=>t('บัญชีธนาคาร'),
                '#default_value' => in_array("banlist_book_bank_field", $filter), // for default checked and false is not checked
            );

            
            $form['filters'] = [
                '#type' => 'fieldset',
                // '#title' => $this->t('Filters'),
                '#open'  => false,
            ];
            $form['filters']['key_word'] = [
                '#title'    => $this->t('คำค้น'),
                '#type'     => 'textfield',
                // '#autocomplete_route_name' => 'backlist.autocomplete',
                // '#autocomplete_route_parameters' => ['vid' => 'product_type'],
                '#default_value' => empty($key_word) ? '' : $key_word,
                '#prefix' => '<div class="row">
                                <div class="col-lg-9 col-md-9 col-sm-12 col-12 pr-1">',
                '#suffix' => '</div>'
            ];
        
            $form['filters']['actions'] = [
                '#type'       => 'actions',
                '#prefix' => '<div class="col-lg-2 col-md-2 col-sm-12 col-12 pl-1">',
                '#suffix' => '</div></div>'
            ];
        
            $form['filters']['actions']['submit'] = [
                '#type'  => 'submit',
                '#value' => $this->t('Search')
            ];

            // dpm($key_word);
            if( !empty($key_word) ){
                $form['filters']['actions']['reset'] = array(
                    '#type' => 'submit',
                    '#value' => $this->t('Reset'),
                    '#ajax' => [
                    'callback' => [$this, 'submitModalFormAjax'],
                    'event' => 'click',
                    ],
                );
            }
        } catch (\Throwable $e) {
            \Drupal::logger('WebSearchForm, buildForm : ')->notice($e->__toString());
        }

        $form['#cache'] = ['max-age' => 0];
        
        return $form;
    }

    public function submitModalFormAjax(array $form, FormStateInterface $form_state) {
        $response = new AjaxResponse();
      
        try{
            if ($form_state->hasAnyErrors()) {
            // Do validation stuff here
            // ex: $response->addCommand(new ReplaceCommand... on error fields
            }else {
            // Do submit stuff here
        
            $url = Url::fromRoute('<front>');
            $command = new RedirectCommand($url->toString());
            $response->addCommand($command);
            }

        } catch (\Throwable $e) {
            \Drupal::logger('WebSearchForm, submitModalFormAjax : ')->notice($e->__toString());
        }
      
        return $response;
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {
        try{
            $field = $form_state->getValues();

            $key_word = $field['key_word'];
            // $filter = array_filter($field['filter']);

            // dpm( 'title>' );
            // dpm( $field['title'] );
            // dpm( $field['field_sales_person_name'] );
            // dpm( $field['field_sales_person_surname'] );
            // dpm( $field['field_id_card_number'] );
            // dpm( $field['body'] );
            // dpm( $field['banlist_book_bank_field'] );
            // dpm( '<title' );
            

            if ( empty($key_word) ) {
                $form_state->setErrorByName('filters][key_word', $this->t('ยังไม่ได้ กรอบคำค้น'));
            }

            if( empty($field['title']) && 
                empty($field['banlist_name_surname_field']) && 
                // empty($field['field_sales_person_surname']) && 
                empty($field['field_id_card_number']) && 
                empty($field['body']) && 
                empty($field['banlist_book_bank_field'])){
                
                $form_state->setErrorByName('details', $this->t('ยังไม่ได้เลือก หมวดหมู่การค้น'));
            }
            
        } catch (\Throwable $e) {
            \Drupal::logger('WebSearchForm, validateForm : ')->notice($e->__toString());
        }
    }

    /**
     * {@inheritdoc}
    */
    public function submitForm(array & $form, FormStateInterface $form_state) {	
        try{
            $field = $form_state->getValues();

            $key_word    = $field['key_word'];
            $filter      = array();//array_values(array_filter($field['filter']));

            if( !empty($field['title']) ){
                $filter[] = 'title';
            }
            if( !empty($field['banlist_name_surname_field']) ){
                $filter[] = 'banlist_name_surname_field';
            }  
            // if( !empty($field['field_sales_person_surname']) ){
            //     $filter[] = 'field_sales_person_surname';
            // } 
            if( !empty($field['field_id_card_number']) ){
                $filter[] = 'field_id_card_number';
            } 
            if( !empty($field['body']) ){
                $filter[] = 'body';
            }
            if( !empty($field['banlist_book_bank_field'])){
                $filter[] = 'banlist_book_bank_field';
            }

            // $this->session->set('is_open', $form_state->getUserInput()['is_open'] );
            
            $url = Url::fromRoute('<front>')->setRouteParameters(array( 'key_word'=>$key_word, 'filter'  => $filter ));

            $form_state->setRedirectUrl($url); 
            
        } catch (\Throwable $e) {
            \Drupal::logger('WebSearchForm, submitForm : ')->notice($e->__toString());
        }
        
    }
}
