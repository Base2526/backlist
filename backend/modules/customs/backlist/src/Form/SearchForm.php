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

class SearchForm extends FormBase {

    /**
     * {@inheritdoc}.
     */
    public function getFormId() {
        return 'search_form';
    }

    /**
     * {@inheritdoc}.
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
        $route_match = \Drupal::service('current_route_match');
        // $keys = $route_match->getParameter('keys');
        // dpm($keys);

        // dpm(urlencode("https://geeksforgeeks.org/"));

        $product_type       = \Drupal::request()->query->get('product_type');
        $sales_person_name  = \Drupal::request()->query->get('sales_person_name');
        $reportor           = \Drupal::request()->query->get('reportor');

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

        $form['filters'] = [
            '#type' => 'details',
            '#title' => $this->t('Filters'),
            '#open'  => false,
        ];
     
        $form['filters']['product_type'] = [
            '#title'    => $this->t('Product type'),
            '#type'     => 'textfield',
            '#autocomplete_route_name' => 'backlist.autocomplete',
            '#autocomplete_route_parameters' => ['vid' => 'product_type'],
            '#default_value' => empty($product_type) ? '' : $product_type,
            '#prefix' => '<div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-12 col-12 pr-1">',
            '#suffix' => '</div>'
        ];

        $form['filters']['sales_person_name'] = [
            '#title'    => $this->t('Sales person name'),
            '#type'     => 'textfield',
            '#autocomplete_route_name' => 'backlist.autocomplete',
            '#autocomplete_route_parameters' => ['vid' => 'sales_person_name'],
            '#default_value' => empty($sales_person_name) ? '' : $sales_person_name,
            '#prefix' => '<div class="col-lg-3 col-md-3 col-sm-12 col-12 pl-1 pr-1">',
            '#suffix' => '</div>'
        ];

        // Bank account
        $form['filters']['reportor'] = [
            '#title'    => $this->t('Reportor'),
            '#type'     => 'textfield',
            '#autocomplete_route_name' => 'backlist.autocomplete',
            '#autocomplete_route_parameters' => ['vid' => 'reportor'],
            '#default_value' => empty($reportor) ? '' : $reportor,
            '#prefix' => '<div class="col-lg-3 col-md-3 col-sm-12 col-12 pl-1 pr-1">',
            '#suffix' => '</div>'
        ];

        // $form['filters']['marks'] = [
        //     '#title'         => 'Marks',
        //     '#type'          => 'search'
        // ];
        
        $form['filters']['actions'] = [
            '#type'       => 'actions',
            '#prefix' => '<div class="col-lg-2 col-md-2 col-sm-12 col-12 pl-1">',
            '#suffix' => '</div></div>'
        ];
     
        $form['filters']['actions']['submit'] = [
            '#type'  => 'submit',
            '#value' => $this->t('Search')
        ];


        // dpm( $route_match  );
        // dpm( $product_type );
        // dpm( $sales_person_name );

        if(!(empty($product_type) && empty($sales_person_name) && empty($reportor))){
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
      
          $url = Url::fromRoute('<front>');
          $command = new RedirectCommand($url->toString());
          $response->addCommand($command);
        }
      
        return $response;
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {
        // if ( $form_state->getValue('fname') == "") {
        //     $form_state->setErrorByName('from', $this->t('You must enter a valid first name.'));
        // }elseif( $form_state->getValue('marks') == ""){
        //     $form_state->setErrorByName('marks', $this->t('You must enter a valid to marks.'));
        // }
    }

    /**
     * {@inheritdoc}
    */
    public function submitForm(array & $form, FormStateInterface $form_state) {	  
        $field = $form_state->getValues();

        $product_type       = $field['product_type'];
        $sales_person_name  = $field['sales_person_name'];
        $reportor           = $field['reportor'];


        // $fname = 'f';//$field["fname"];
        // $marks = 'm';//$field["marks"];

        $page = \Drupal::request()->query->get('page');

        if(!empty($page)){
            $url = \Drupal\Core\Url::fromRoute('<front>')
            ->setRouteParameters(array( 'product_type'=>$product_type,
                                        'sales_person_name'=>$sales_person_name, 
                                        'reportor'=>$reportor, 
                                        'page'=>$page));
        }else{
            $url = \Drupal\Core\Url::fromRoute('<front>')
            ->setRouteParameters(array( 'product_type'=>$product_type,
                                        'sales_person_name'=>$sales_person_name, 
                                        'reportor'=>$reportor, ));
        }
        
        $form_state->setRedirectUrl($url); 
    }
}
