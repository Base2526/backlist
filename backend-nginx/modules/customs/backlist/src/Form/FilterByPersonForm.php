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
class FilterByPersonForm extends FormBase {
    /**
     * Class constructor.
     */
    public function __construct() {
        $this->language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    }

    public function getFormId() {
        return 'filter_by_person_form';
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
        $name       = $current_route_match->getParameter('name'); 
        $surname    = $current_route_match->getParameter('surname');
        
        $storage = \Drupal::entityTypeManager()->getStorage('node');
        $query = $storage->getQuery();
        $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
        $query->condition('type', 'back_list');
    
        $and = $query->andConditionGroup();
            $and->condition('field_sales_person_name', $name, '=');
            $and->condition('field_sales_person_surname', $surname, '=');
        $query->condition($and);
        $all_nids = $query->execute();

        
        // dpm($all_nids);
        $form['search_results']= array(
            '#type' => 'item',
            // '#prefix' => '<div>'.$this->t('Search results') . '<div>พบทั้งหมด 1 รายการ</div>',
            '#suffix' => '</div>',
        );

        $form['headers'] = array(
            '#type' => 'item',
            '#prefix' => '<table>
                            <tr>
                                <th>'.$this->t('สินค้า/ประเภท').'</th>
                                <th>'.$this->t('รายละเอียด').'</th>
                                <th>'.$this->t('ยอดเงิน').'</th>
                            </tr>',
            // '#suffix' => '</table>',
        );

        $summary = 0;
        if(empty($all_nids)){
            $form['headers'][] = array(
                '#type' => 'item',
                '#prefix' =>    '<tr>
                                    <td>Empty result.</td>
                                    <td></td>
                                    <td></td>
                                </tr>',
                '#suffix' => '',
            );
        }else{
            foreach ($storage->loadMultiple($all_nids) as $node) {

                
                // ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
                // $sales_person_name = '';
                // $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
                // if(!empty($field_sales_person_name)){
                //     $sales_person_name = $field_sales_person_name[0]['value'];
                // }

                // // นามสกุลผู้รับเงินโอน
                // $sales_person_surname = '';
                // $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
                // if(!empty($field_sales_person_surname)){
                //     $sales_person_surname = $field_sales_person_surname[0]['value'];
                // }

                $transfer_amount = $node->get('field_transfer_amount')->getValue()[0]['value'];

                $summary += $transfer_amount;

                // $form['headers'][] = array(
                //     '#type' => 'item',
                //     '#prefix' =>    '<tr>
                //                         <td><a href="/'. $this->language .'/node/'.$node->id().'/'. urlencode($name.'&'.$surname) .'">'. $node->label() .'</a></td>
                //                         <td>'. strip_tags($node->get('body')->getValue()[0]['value']) .'</td>
                //                         <td>'. number_format($transfer_amount, 2, '.', ',') .'</td>
                //                     </tr>',
                //     '#suffix' => '',
                // );

                $body = $node->get('body')->getValue();

                if(!empty($body)){
                    $body = strip_tags( $body[0]['value']);
                }else{
                    $body = '';
                }

                $form['headers'][] = array(
                    '#type' => 'item',
                    '#prefix' =>    '<tr>
                                        <td><a href="/'. $this->language .'/node/'.$node->id().'?from='. urlencode($name.'&'.$surname) .'">'. $node->label() .'</a></td>
                                        <td>'. $body .'</td>
                                        <td>'. number_format($transfer_amount, 2, '.', ',') .'</td>
                                    </tr>',
                    '#suffix' => '',
                );
            }

            $form['headers'][] = array(
                '#type' => 'item',
                '#prefix' =>    '<tr>
                                    <td></td>
                                    <td class="filter-by-person-sammary">'.$this->t('ยอดรวม').'</td>
                                    <td>'. number_format($summary, 2, '.', ',') .'</td>
                                </tr>',
                '#suffix' => '',
            );
            
        }
        $form['headers']['#suffix'] = '</table>';

        $form['search_results']['#prefix'] = '<div>'.$this->t('Search results') . ' : ' . $name . ' ' .  $surname  . '<div>'. $this->t('พบทั้งหมด '.count($all_nids).' รายการ').'</div>';
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
