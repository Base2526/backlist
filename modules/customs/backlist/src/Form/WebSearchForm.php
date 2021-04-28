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
        $route_match = \Drupal::service('current_route_match');
        // $keys = $route_match->getParameter('keys');
        // dpm($keys);

        // dpm(urlencode("https://geeksforgeeks.org/"));

        $key_word = \Drupal::request()->query->get('key_word');
        $filter   = \Drupal::request()->query->get('filter');

        // $product_type       = \Drupal::request()->query->get('product_type');
        // $sales_person_name  = \Drupal::request()->query->get('sales_person_name');
        // $reportor           = \Drupal::request()->query->get('reportor');

        // dpm( $route_match  );
        // dpm( $product_type );
        // dpm( $sales_person_name );
        // dpm( $reportor );

        // $logged_in = \Drupal::currentUser()->isAuthenticated();

        
        // if($logged_in){
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
        // }

        
        $options = array();
        $options["title"] = "สินค้า/ประเภท";
        $options["field_sales_person_name"] = "ชื่อบัญชีผู้รับเงินโอน";
        $options["field_sales_person_surname"] = "นามสกุลบัญชีผู้รับเงินโอน";
        $options["body"] = "รายละเอียด";
        $options["banlist_book_bank_field"] = "บัญชีธนาคาร";

        $form['details'] = [
            '#type' => 'details',
            '#title' => $this->t('หมวดหมู่การค้น'),
            '#open'  => false,
        ];
        $form['details']['filter'] = array('#title' => t(''),
                                            '#type' => 'checkboxes',
                                            '#description' => t(''),
                                            '#options' => $options,
                                            '#default_value' => empty($filter) ? array('title') : $filter
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

        $key_word = \Drupal::request()->query->get('key_word');
        $filter   = \Drupal::request()->query->get('filter');
        if( !empty($key_word) || !empty($filter) ){
            $form['filters']['actions']['reset'] = array(
                '#type' => 'submit',
                '#value' => $this->t('Reset'),
                '#ajax' => [
                  'callback' => [$this, 'submitModalFormAjax'],
                  'event' => 'click',
                ],
            );
        }

       
        return $form;
    }

    public function submitModalFormAjax(array $form, FormStateInterface $form_state) {
        $response = new AjaxResponse();
      
        if ($form_state->hasAnyErrors()) {
          // Do validation stuff here
          // ex: $response->addCommand(new ReplaceCommand... on error fields
        }
      
        else {
          // Do submit stuff here
      
          $url = Url::fromRoute('web_search.form');
          $command = new RedirectCommand($url->toString());
          $response->addCommand($command);
        }
      
        return $response;
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {

        $field = $form_state->getValues();

        $key_word = $field['key_word'];
        $filter = array_filter($field['filter']);

        if ( empty($key_word) ) {
            $form_state->setErrorByName('filters][key_word', $this->t('ยังไม่ได้ กรอบคำค้น'));
        }
        if(empty($filter)){
            $form_state->setErrorByName('category][filter', $this->t('ยังไม่ได้เลือก หมวดหมู่การค้น'));
        }
        
        // }elseif( $form_state->getValue('marks') == ""){
        //     $form_state->setErrorByName('marks', $this->t('You must enter a valid to marks.'));
        // }
    }

    /**
     * {@inheritdoc}
    */
    public function submitForm(array & $form, FormStateInterface $form_state) {	  
        $field = $form_state->getValues();

        $key_word    = $field['key_word'];
        $filter      = array_values(array_filter($field['filter']));

        // $product_type       = $field['product_type'];
        // $sales_person_name  = $field['sales_person_name'];
        // $reportor           = $field['reportor'];


        // $fname = 'f';//$field["fname"];
        // $marks = 'm';//$field["marks"];

        // $page = empty(\Drupal::request()->query->get('page')) ? 0 : \Drupal::request()->query->get('page');

        $url = Url::fromRoute('web_search.form');// ->setRouteParameters(array( 'key_word'=>$key_word ));
        
        $query = [
            'key_word'=>$key_word,
            'filter'  => $filter,
          ];
          
        $url->setOption('query', $query);

        $form_state->setRedirectUrl($url); 
    }
}
