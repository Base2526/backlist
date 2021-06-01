<?php
namespace Drupal\backlist\Plugin\Page;

use Drupal\Core\Controller\ControllerBase;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\node\Entity\Node;

use Drupal\user\Entity\User;
use Drupal\Core\Url;
use Drupal\backlist\Utils\Utils;

/**
 * Controller routines for page example routes.
 * 
 *  add more buttom https://drupal.stackexchange.com/questions/199944/how-do-i-add-a-add-more-button
 */
class WebSearchPage extends ControllerBase {
  /**
   * {@inheritdoc}
   */
  protected function getModuleName() {
    return 'WebSearchPage';
  }

  public function page() {
	  $form['form'] = $this->formBuilder()->getForm('Drupal\backlist\Form\WebSearchForm');
 
    //Get parameter value while submitting filter form  
    $key_word           =  \Drupal::request()->query->get('key_word');
    $offset             =  empty(\Drupal::request()->query->get('offset')) ? 0 : \Drupal::request()->query->get('offset');

    $fulltextFields     = \Drupal::request()->query->get('filter');

    $response_arrays = array();
    if(empty($key_word)){
        $key_word = "*";
        // $offset = 0;
        $type = 0;

        $response_arrays = Utils::search_api($key_word, $offset, $type);
    }else{
        // $offset = 0;
        $type = 9;

        $response_arrays = Utils::search_api($key_word, $offset, $type, $fulltextFields);
    }

    // Create table header.
    $header = [
      'product_type'      => $this->t('Product type'),        // สินค้า/ประเภท
      'sales_person_name' => $this->t('Sales person name'),   // ชื่อบัญชีผู้รับเงินโอน
      'id_card_number'    => $this->t('เลขบัตรประชาชนคนขาย'),
      'details'           => $this->t('Details'),
      'bank_account'      => $this->t('Bank account'),
      'transfer_amount'   => $this->t('Transfer amount'),     // ยอดเงิน
      'date_post'         => $this->t('Date post'),	  
      // 'reportor'          => $this->t('Reportor')
    ];
    
    $date_formatter = \Drupal::service('date.formatter');

    $rows = [];
    foreach ($response_arrays['datas'] as $response_array) {
      $row = [];
      $row[] = [
              'data' => [
                '#theme' => 'links',
                '#attributes' => [
                  'class' => [
                    'links',
                  ],
                ],
                '#links' => [
                  [
                    'title' => $response_array['title'],
                    // 'url' => Url::fromRoute('report_view.form', ['nid' => $node->id()]),
                    'url' => Url::fromRoute('entity.node.canonical', ['node' => $response_array['id']], ['absolute' => TRUE]),
                    'attributes' => [
                      'class' => [
                        'links__link',
                      ],
                    ],
                  ],
                ]
              ]
            ];
    
      $row[] = $response_array['name_surname'];
      $row[] = empty($response_array['id_card_number']) ? '-' : $response_array['id_card_number'];
      $row[] = strip_tags($response_array['detail']);

      $merchant_bank_accounts = array();
      foreach ($response_array['book_banks'] as $mi=>$mv){

          $merchant_bank_account['bank_account'] = $mv;
          $merchant_bank_account['bank_wallet']  = '';

          $merchant_bank_accounts[] = $merchant_bank_account;
      }
      $row[] =    ['data' => 
                      [
                      '#theme'     => 'row-merchant-bank-account',
                      '#items'    => $merchant_bank_accounts,
                      ]
                  ];

      

      // $row[] = $node->label();
      $row[] = number_format($response_array['transfer_amount'], 2, '.', ',');
      
      $created = strtotime($response_array['transfer_date']);
      if(!empty($created)){
          $row[] = [
              'data' => [
              '#theme' => 'time',
              '#text' => $date_formatter->format($created),
              '#attributes' => [
                  'datetime' => $date_formatter->format($created, 'custom', \DateTime::RFC3339),
              ],
              ],
          ];
      }else{
          $row[] = $created;
      }
      
      $rows[] = $row;
    }

    $form['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,//get_students("All","",""),
      '#empty' => $this->t('No data'),
      '#prefix' => '<div class="banlist-table">',
      '#suffix' => '</div>'
    ];


    $num = $response_arrays["all_result_count"];//count($items); // number of items in list
    $per_page = 30; // Number of items to show per page
    $showeachside = 5; //  Number of items to show either side of selected page

    $start = $offset * $per_page;//empty(\Drupal::request()->query->get('start')) ? 0  : \Drupal::request()->query->get('start');
    // if(empty($start))$start=0;  // Current start position

    $max_pages = ceil($num / $per_page); // Number of pages
    $cur = ceil($start / $per_page)+1; // Current page number

    $query = '?';
    if(!empty($key_word) && !empty($fulltextFields)){
      $query ='?key_word=' . $key_word . '&' . http_build_query(array('filter'=>$fulltextFields));
    }

    $eitherside = ($showeachside * $per_page);
    if($start+$per_page<$num || $offset > 0){
  
      $previous = '';
      if(($start-$per_page) >= 0)
      {
        $next = $start-$per_page;
        if($query == '?'){
          $previous = '<a href="?offset='. $next/30 .'">&laquo;</a>' ;
        }else{
          $previous = '<a href="'.$query. '&offset='. $next/30 .'">&laquo;</a>' ;
        }
      }

      $next = '';
      if($start+$per_page<$num)
      {
        if($query == '?'){
          $next = '<a href="?offset='. ($offset + 1) .'">&raquo;</a> ';
        }else{
          $next = '<a href="'.$query.'offset='. $offset .'">&raquo;</a> ';
        }     
      }

      $pagging = '';
      $pg=1;
      for($y=0;$y<$num;$y+=$per_page)
      {
          $class=($y==$start)?"pageselected":"";
          if(($y > ($start - $eitherside)) && ($y < ($start + $eitherside))){
            if($query == '?'){
              $pagging .= '<a class="' .$class .'" href="'. $query .'offset='. ($y/30).'">' . $pg .'</a>'; 
            }else{
              $pagging .= '<a class="' .$class .'" href="'. $query .'&offset='. ($y/30).'">' . $pg .'</a>'; 
            }
          }
          $pg++;
      }

      $form['pagination'] = [
        '#type'   => 'item',
        '#prefix' => '<div>
                          <div class="pagination">
                            '.$previous. $pagging .$next.'
                          </div>',
        '#suffix' => '</div>'
      ];
    }   
    return $form;
  }

}
