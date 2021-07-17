<?php

namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\CssCommand;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\AfterCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\user\Entity\User;
use Drupal\file\Entity\File;
use Drupal\paragraphs\Entity\Paragraph;

use Drupal\backlist\Utils\Utils;

/**
 * Controller routines for page example routes.
 */
class ReportViewForm extends FormBase {
    /**
     * Class constructor.
     */
    public function __construct() {
        $this->language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    }

    public function getFormId() {
        return 'report_view_form';
    }

    public function frontPage(){
        $response = new RedirectResponse(Url::fromRoute('<front>')->toString());
        $response->send();
        return;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
        $form['#tree'] = TRUE;

        $current_route_match = \Drupal::service('current_route_match');
        $nid = $current_route_match->getParameter('nid'); 
        // $mode = empty($current_route_match->getParameter('mode')) ? 'add' : $current_route_match->getParameter('mode'); 

        $node = Node::load($nid);
        if(empty( $node )){
            $this->frontPage();
        }

        // 1. สินค้า/ประเภท
        $name = $node->label();

        // 2. ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
        $sales_person_name = '';
        $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
        if(!empty($field_sales_person_name)){
            $sales_person_name = $field_sales_person_name[0]['value'];
        }

        // 3. นามสกุลผู้รับเงินโอน
        $sales_person_surname = '';
        $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
        if(!empty($field_sales_person_surname)){
            $sales_person_surname = $field_sales_person_surname[0]['value'];
        }
        

        // 4. บัญชีธนาคารคนขาย
        $merchant_bank_accounts = array();
        foreach ($node->get('field_merchant_bank_account')->getValue() as $mi=>$mv){
            
            $merchant_bank_account = array();
            $p = Paragraph::load( $mv['target_id'] );
            
            // เลขบัญชี
            $field_bank_account = $p->get('field_bank_account')->getValue();
            if(!empty($field_bank_account)){
                $bank_account = $field_bank_account[0]['value'];
                $merchant_bank_account['bank_account'] = $bank_account;
            } 

            // ธนาคาร/ระบบ Wallet
            $bank_wallet_target_id = $p->get('field_bank_wallet')->target_id;
            $bank_wallet = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($bank_wallet_target_id);
            $merchant_bank_account['bank_wallet'] = $bank_wallet->label();
            
            $merchant_bank_accounts[] = $merchant_bank_account;
        }

        // 5. ยอดเงิน
        $transfer_amount = 0;
        $field_transfer_amount = $node->get('field_transfer_amount')->getValue();
        if(!empty($field_transfer_amount)){
            $transfer_amount = $field_transfer_amount[0]['value'];
        }

        // 6. รายละเอียดเพิ่มเติม
        $body = '';
        $field_body = $node->get('body')->getValue();
        if(!empty($field_body)){
            $body = strip_tags($field_body[0]['value']);
        }

        // 7. รูปภาพประกอบ
        $images = array();
        foreach ($node->get('field_images')->getValue() as $imi=>$imv){
            // dpm( Utils::get_file_uri($imv['target_id']) );
            $images[] = $imv['target_id'];
        }

        // 8. วันโอนเงิน
        $transfer_date = '';
        $field_transfer_date = $node->get('field_transfer_date')->getValue();
        if(!empty($field_transfer_date)){
            $transfer_date = $field_transfer_date[0]['value'];
        }
        
        // 9. เลขบัตรประชาชนคนขาย 
        $id_card_number = '';
        $field_id_card_number = $node->get('field_id_card_number')->getValue();
        if(!empty($field_id_card_number)){
            $id_card_number = $field_id_card_number[0]['value'];
        }

        // 10. เว็บไซด์ประกาศขายของ 
        $selling_website = '';
        $field_selling_website = $node->get('field_selling_website')->getValue();
        if(!empty($field_selling_website)){
            $selling_website = $field_selling_website[0]['value'];
        }

        /*
        dpm($name);                     // 1. สินค้า/ประเภท
        dpm($sales_person_name);        // 2. ชื่อบัญชีผู้รับเงินโอน
        dpm($sales_person_surname);     // 3. นามสกุลผู้รับเงินโอน
        dpm($merchant_bank_accounts);   // 4. บัญชีธนาคารคนขาย
        dpm($transfer_amount);          // 5. ยอดเงิน
        dpm($body);                     // 6. รายละเอียดเพิ่มเติม
        dpm($images);                   // 7. รูปภาพประกอบ
        dpm($transfer_date);            // 8. วันโอนเงิน
        dpm($id_card_number);           // 9. เลขบัตรประชาชนคนขาย 
        dpm($selling_website);          // 10. เว็บไซด์ประกาศขายของ
        */ 

        $form['name'] = [
            '#type' => 'item',
            '#markup' => '<div>'.$name.'</div>',
            '#prefix' => '<div><b>'.$this->t('สินค้า/ประเภท') . '</b>',
            '#suffix' => '</div>',
        ];

        $form['sales_person_name'] = [
            '#type' => 'item',
            '#markup' => '<div>'.$sales_person_name . ' ' . $sales_person_surname.'</div>',
            '#prefix' => '<div><b>'.$this->t('ชื่อบัญชี-นามสกุล ผู้รับเงินโอน'). '</b>',
            '#suffix' => '</div>',
        ];

        $form['bank_account']= array(
            '#type' => 'fieldset',
            '#collapsible' => TRUE,
            '#collapsed' => TRUE,
            '#prefix' => '<div id="fieldset-bank-account"><b>'.$this->t('บัญชีธนาคารคนขาย') . '</b>',
            '#suffix' => '</div>',
        );

        foreach ($merchant_bank_accounts as $merchant_key => $merchant_value){
            // เลขบัญชี
            $form['bank_account'][] = array(
                                            '#type' => 'item',
                                            '#markup' => '<div>'.$merchant_value['bank_account'].'</div>',
                                            '#prefix' => '',
                                            '#suffix' => '',
                                        );

            // ธนาคาร/ระบบ Wallet
            $form['bank_account'][]  = array(
                                            '#type' => 'item',
                                            '#markup' => '<div>'.$merchant_value['bank_wallet'].'</div>',
                                            '#prefix' => '',
                                            '#suffix' => '',
                                        );
        }

        $form['transfer_amount'] = [
            '#type' => 'item',
            '#markup' => '<div>'.$transfer_amount.'</div>',
            '#prefix' => '<div><b>'.$this->t('ยอดเงิน'). '</b>',
            '#suffix' => '</div>',
        ];

        $form['body'] = [
            '#type' => 'item',
            '#markup' => '<div>'.$body.'</div>',
            '#prefix' => '<div><b>'.$this->t('รายละเอียดเพิ่มเติม'). '</b>',
            '#suffix' => '</div>',
        ];

        if(!empty($images)){
            $form['images']= array(
                '#type' => 'fieldset',
                '#collapsible' => TRUE,
                '#collapsed' => TRUE,
                '#prefix' => '<div class="row" id="report-view-slick-lightbox"><div><b>'.$this->t('รูปภาพประกอบ').'</b></div>',
                '#suffix' => '</div>',
            );
            foreach ($images as $im_key => $uri) {
                $form['images'][$im_key] = array(
                    '#theme' => 'image_style',
                    '#style_name' => 'large',
                    '#uri' => Utils::get_file_uri($uri),
                    '#width' => '150px',
                    // '#height' => '150px',
                    '#prefix' => '<a href="'. Utils::get_file_url($uri) .'" target="_blank" class="thumbnail">',
                    '#suffix' => '</a>',
                );
            } 
        }
       
        $form['transfer_date'] = [
            '#type' => 'item',
            '#markup' => '<div>'. ( empty($transfer_date) ? '-' : $transfer_date ) .'</div>',
            '#prefix' => '<div><b>'.$this->t('วันโอนเงิน') . '</b>', 
            '#suffix' => '</div>',
        ];

        $form['id_card_number'] = [
            '#type' => 'item',
            '#markup' => '<div>'.  ( empty($id_card_number) ? '-' : $id_card_number ) .'</div>',
            '#prefix' => '<div><b>'.$this->t('เลขบัตรประชาชนคนขาย'). '</b>',  
            '#suffix' => '</div>',
        ];

        $form['selling_website'] = [
            '#type' => 'item',
            '#markup' => '<div>'. ( empty($selling_website) ? '-' : $selling_website ).'</div>',
            '#prefix' => '<div><b>'.$this->t('เว็บไซด์ประกาศขายของ'). '</b>', 
            '#suffix' => '</div>',
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
    */
    public function validateForm(array &$form, FormStateInterface $form_state) {
        parent::validateForm($form, $form_state);
    }

    /**
     * {@inheritdoc}
     */
    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {
    }
}
