<?php

namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;
Use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\CssCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Ajax\PrependCommand;
use Drupal\Core\Ajax\InsertCommand;
use Drupal\Core\Routing;
use Drupal\node\Entity\Node;

/**
 * SendToDestinationsForm class.
 */
class ModalForm extends FormBase {

    /**
     * {@inheritdoc}
     */
    public function getFormId() {
        return 'modal_form';
    }

    private function is_debug(){
        if( empty(getenv('IS_DEBUG')) ){
            return FALSE;
        }else{
            return TRUE;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state, $options = NULL) {

       //  dpm($form_state->get('position_media_data'));
 
        $form['#tree'] = TRUE;
        $form['#prefix'] = '<div id="modal_example_form">';
        $form['#suffix'] = '</div>';

        $form['container']['nid'] = array(
            '#value' => \Drupal::routeMatch()->getParameter('type'),
            '#type' => 'hidden',
        );

        // // The status messages that will contain any form errors.
        // $form['status_messages'] = [
        //     '#type' => 'status_messages',
        //     '#weight' => -10,
        // ];

        //  $data_personal_info = Utils::personal_info_api();

        // $data_personal_info = Utils::personal_info_api();

        // Get consent message 
        // $consent_text = '';
        // $consent_message = Utils::consent_template_api( \Drupal::languageManager()->getCurrentLanguage()->getId() );
        // $consent_text = $consent_message['consent_message'];
 
        //  if($this->is_debug()){
        //      dpm($consent_message);
        //  }

        // 

        // $form['container']['bigcard'] = array(
        //     '#type' => 'hidden',
        //     '#value' => $data_personal_info['bigcard'],
        // );
         
        // $form['container']['modal_consent_detail'] = array(
        //     '#type' =>'item',
        //     '#prefix' => '<div id="modal_consent_detail">' . $this->t(str_replace("\n", "<br>", '$consent_text')) ,
        //     '#suffix' => '</div>',
        // );


        // $form['container']['modal_consent_detail'] = array(
        //     '#type' =>'item',
        //     '#prefix' => '<div id="modal_consent_detail">xyyyy',
        //     '#suffix' => '</div>',
        // );

        // Give my consent 
        // $form['container']['is_consent'] = array(
        //     '#type' => 'checkbox',
        //     '#title'=> $this->t('I confirm to give my consent for the disclosure of my Personal Data by the Company as stated in this document'). '<span class="requiredField"> *</span>',
        //     '#default_value' =>FALSE,
        // );

        $form['container']['mail'] = array(
            '#type' => 'textfield',
            '#title' => t('E-mail'),
            '#required' => TRUE,
            '#default_value' => '',
            '#maxlength' => 255,
           ); 

        $form['container']['page_message'] = [
            '#title' => t('Messages'),
            '#type' => 'textarea',
            '#required' => TRUE,
          ];

        // $form['container']['other'] = array(
        //     '#type' =>'item',
        //     '#prefix' => '<div>' . $this->t('Consent Form for Disclosure of Personal Data'),
        //     '#suffix' => '</div>',
        // );

        $form['actions'] = array('#type' => 'actions');
        $form['actions']['send'] = [
            '#type' => 'submit',
            '#value' => $this->t('OK'),
            '#attributes' => [
                'class' => [
                'use-ajax',
                ],
            ],
            '#submit' => ['::submitAjax'],
            '#ajax' => [
                'callback' => [$this, 'callbackAjax'],
                'event' => 'click',
            ],
        ];

        $form['#attached']['library'][] = 'core/drupal.dialog.ajax';

        return $form;
    }

    public function submitAjax(array &$form, FormStateInterface $form_state) {

        // dpm('nid >>> ' . $form_state->getUserInput()['container']['nid']);

        \Drupal::messenger()->addMessage($this->t('Form Submitted Successfully'), 'status', TRUE);
        $form_state->setRebuild(TRUE);
        // dpm('bigcard >>> ' . $form_state->getUserInput()['container']['bigcard']);

        // dpm();

        /*
        $data_personal_info = Utils::personal_info_api();

        // Mandatory
        $productId      = 'BIGCARD';
        $customerId     = $data_personal_info['bigcard'];
        $consentStatus  = 'C';
        $firstName      = $data_personal_info['t_name'];
        $lastName       = $data_personal_info['t_last_name'];
        $mobilePhone    = $data_personal_info['mobile_phone'];

        // Condition
        $ref1 = '';

        // Optional
        $citizenId = '';
        $ref2 = '';
        $consentSignature ='';
        $consentOtpRef = '';
        $consentOtp = '';
        $consentChannel = 'bigcard';

        $type = $form_state->getUserInput()['type'];

        
        switch($type){
            case 'mbf':
            // case 'ej':
            // case 'nr':
            // case 'en':
            // case 'nn':
                {
                // mbf
                $consentStatus  = 'C';
                if(!$form_state->getUserInput()['container']['is_consent']){
                    $consentStatus  = 'N';
                }

                $pdpa_updateConsent = Utils::pdpa_updateConsent(    $productId, 
                                                                    $customerId, 
                                                                    $consentStatus, 
                                                                    $firstName, 
                                                                    $lastName, 
                                                                    $mobilePhone,
                                                                
                                                                    $ref1,
                                                                
                                                                    $citizenId,
                                                                    $ref2,
                                                                    $consentSignature,
                                                                    $consentOtpRef,
                                                                    $consentOtp,
                                                                    $consentChannel,
                                                                    );

                if($pdpa_updateConsent['code'] == 200 && $pdpa_updateConsent['result']){
                }
                break;
            }

            // new
            // case 'nr':{


            //     // break;
            // }

            // // exiting
            // case 'er':{

            //     if(!$form_state->getUserInput()['container']['is_consent']){
            //         $consentStatus  = 'N';
            //     }
        
            //     $pdpa_updateConsent = Utils::pdpa_updateConsent(    $productId, 
            //                                                         $customerId, 
            //                                                         $consentStatus, 
            //                                                         $firstName, 
            //                                                         $lastName, 
            //                                                         $mobilePhone,
                                                                
            //                                                         $ref1,
                                                                
            //                                                         $citizenId,
            //                                                         $ref2,
            //                                                         $consentSignature,
            //                                                         $consentOtpRef,
            //                                                         $consentOtp,
            //                                                         $consentChannel,
            //                                                         );
        
            //     if($pdpa_updateConsent['code'] == 200 && $pdpa_updateConsent['result']){
        
            //     }
            //     break;
            // }

        }

        

        // $form_state->set('position_media_data', '$position_media_data');
        // $form_state->setRebuild();

        // return $form['container']['is_consent'];

        */

    }

    /**
     * AJAX callback handler that displays any errors or a success message.
     * 
     * https://stackoverflow.com/questions/47360131/how-to-close-a-modal-window
     */
    public function callbackAjax(array $form, FormStateInterface $form_state) {
        $response = new AjaxResponse();

        // Output messages in the page.
        // $messages = ['#type' => 'status_messages'];
        $messages = '<div role="contentinfo" aria-label="Status message" class="messages messages--status">
                        <h2 class="visually-hidden">Status message</h2>
                        <ul class="messages__list">
                            <li class="messages__item">Form Submitted Successfully</li>
                        </ul>
                    </div>';
        $response->addCommand(new ReplaceCommand('.messages--status', $messages));

        // If there are any form errors, AJAX replace the form.
        if ($form_state->hasAnyErrors()) {
            $response->addCommand(new ReplaceCommand('#modal_example_form', $form));
        }
        else {
            // \Drupal::messenger()->addMessage($this->t('Form Submitted Successfully'), 'status', TRUE);

            // $message = [
            //   '#theme' => 'status_messages',
            //   '#message_list' => 'drupal_get_messages()',
            // ];
        
            // $messages = \Drupal::service('renderer')->render($message);
        
            // $response = new AjaxResponse();
            // $response->addCommand(new HtmlCommand('#messages__item', $messages));
            // return $response;

            // $command = new CloseModalDialogCommand();
            // $response->addCommand($command);

            // $response = new AjaxResponse();    
            // $status_messages = array('#type' => 'status_messages');
            // $messages = \Drupal::service('renderer')->renderRoot($status_messages);
            // if (!empty($messages)) {
            //     $response->addCommand(new PrependCommand('.messages__item', $messages));
            // }

            // return $response;

            // $response = new AjaxResponse();
            // // drupal_set_message($action);
            // $form['messages']['status'] = [
            // '#type' => 'status_messages',
            // ];
            // $response->addCommand(new InsertCommand(null, 'asdsf'));

            $response->addCommand(new CloseModalDialogCommand());
            return $response;
        }

        // $username = $form_state->getUserInput()['username'];
        // $password = $form_state->getUserInput()['password'];

        // dpm($form_state->getUserInput()['container']['is_consent']);

        /*
         [container] => Array
        (
            [is_consent] => 1
            [modal_consent_detail] => 
            [other] => 
        )
        */

        // $selector_description = '#modal_consent_detail';
        // $response->addCommand(new HtmlCommand($selector_description, 'xxxx'));
        // $selector_description = '#edit-container-name--description';
        // $text_description = $this->t('ข้อมูลนี้จำเป็น');
        // $response->addCommand(new HtmlCommand($selector_description, $text_description));
        // $response->addCommand(new CssCommand($selector_description, $css_description));
        // return $response;

        
        return $response;
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {}

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {}

    /**
     * Gets the configuration names that will be editable.
     *
     * @return array
     *   An array of configuration object names that are editable if called in
     *   conjunction with the trait's config() method.
     */
    protected function getEditableConfigNames() {
        return ['config.modal_form_example_modal_form'];
    }
}
