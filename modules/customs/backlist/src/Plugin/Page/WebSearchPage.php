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

  private function getCount($name, $surname){
    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
     
    $and = $query->andConditionGroup();
    $and->condition('field_sales_person_name', $name, '=');
    $and->condition('field_sales_person_surname', $surname, '=');

    $query->condition($and);

    return $query->count()->execute();
    // dpm($num_rows);
  }

  public function page() {

    // $limit = 30;

    //====load filter controller
	  $form['form'] = $this->formBuilder()->getForm('Drupal\backlist\Form\WebSearchForm');
 

    //Get parameter value while submitting filter form  
    $key_word           =  \Drupal::request()->query->get('key_word');
    $offset             =  empty(\Drupal::request()->query->get('offset')) ? 0 : \Drupal::request()->query->get('offset');
    // $sales_person_name  = \Drupal::request()->query->get('sales_person_name');
    // $reportor           = \Drupal::request()->query->get('reportor');

    $fulltextFields      = \Drupal::request()->query->get('filter');

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

    // dpm($key_word, $offset, $type);
    

    // $current_page = empty(\Drupal::request()->query->get('page')) ? 0 : \Drupal::request()->query->get('page') ;

    // dpm( $product_type );
    // dpm( $sales_person_name );
    // dpm( $reportor );
    // dpm( $current_page );

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

    
    // $storage = \Drupal::entityTypeManager()->getStorage('node');
    // $query = $storage->getQuery();
    // $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    // $query->condition('type', 'back_list');

    // if(!empty($product_type)){
    //   $query->condition('title', $product_type);
    // }

    // if(!empty($sales_person_name)){
    //   $query->condition('field_sales_person_name', $sales_person_name, 'CONTAINS');
    // }

    // if(!empty($reportor)){
    //   $userStorage = \Drupal::entityTypeManager()->getStorage('user');
    //   $uids = $userStorage->getQuery()
    //           ->condition('status', '1')
    //           ->condition('name', $reportor, '=')
    //           ->execute();

    //   if(!empty($uids)){
    //     $uid = reset($uids);

    //     $query->condition('uid', $uid);
    //   }
    // }
    /*

    // $query->condition('status', 1);
    $query->sort('changed' , 'DESC');
    $query->tableSort($header);

    $all_nids = $query->execute();
    // Default value is 10.
    $query->pager($limit);

    // $all_nids = $query->execute();
    $nids = $query->execute();
    */

    // dpm(count($nids));
    
    $date_formatter = \Drupal::service('date.formatter');
    /*
    $rows = [];
    foreach ($storage->loadMultiple($nids) as $node) {
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
                      'title' => $node->label(),
                      // 'url' => Url::fromRoute('report_view.form', ['nid' => $node->id()]),
                      'url' => Url::fromRoute('entity.node.canonical', ['node' => $node->id()], ['absolute' => TRUE]),
                      'attributes' => [
                        'class' => [
                          'links__link',
                        ],
                      ],
                    ],
                  ]
                ]
              ];
      
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
                'title' => $sales_person_name . ' ' . $sales_person_surname ." (" . $this->getCount($sales_person_name, $sales_person_surname) . ")",
                'url' => Url::fromRoute('filter_by_person.form', ['name'=>$sales_person_name, 'surname'=>$sales_person_surname]),
                'attributes' => [
                    'class' => [
                    'links__link',
                    ],
                ],
                ],
            ]
            ]
        ];

        $body = $node->get('body')->getValue();
        if(!empty($body)){
            $row[] = Utils::truncate(strip_tags($body[0]['value']), 800, '');
        }else{
            $row[] = '';
        }

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

            if(!empty($bank_wallet_target_id)){
                $bank_wallet = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($bank_wallet_target_id);
                $merchant_bank_account['bank_wallet'] = $bank_wallet->label();
            }
            
            
            $merchant_bank_accounts[] = $merchant_bank_account;
        }

        $row[] = ['data' => 
                        [
                        '#theme'     => 'row-merchant-bank-account',
                        '#items'    => $merchant_bank_accounts,
                        ]
                    ];
        // $row[] = $node->label();
        $row[] = number_format($node->get('field_transfer_amount')->getValue()[0]['value'], 2, '.', ',');
        
        $created = $node->get('created')->value;
        $row[] = [
            'data' => [
            '#theme' => 'time',
            '#text' => $date_formatter->format($created),
            '#attributes' => [
                'datetime' => $date_formatter->format($created, 'custom', \DateTime::RFC3339),
            ],
            ],
        ];

        $rows[] = $row;
    }
    */

    // dpm($response_arrays["all_result_count"]);
    $rows = [];
    foreach ($response_arrays['datas'] as $response_array) {
        // dpm($response_array['book_banks']);

        /*
        [owner_id] => 0
        [id] => 13596
        [name] => ปรีดา
        [surname] => คำนึง
        [title] => สินสมุทร
        [detail] => พูดอยางดีบอกว่าไม่โกง
        [transfer_amount] => 4000
        */
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
      
        // 2. ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
        // $sales_person_name = '';
        // $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
        // if(!empty($field_sales_person_name)){
        //     $sales_person_name = $field_sales_person_name[0]['value'];
        // }

        // // 3. นามสกุลผู้รับเงินโอน
        // $sales_person_surname = '';
        // $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
        // if(!empty($field_sales_person_surname)){
        //     $sales_person_surname = $field_sales_person_surname[0]['value'];
        // }
        /*
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
                'title' => $response_array['name'] . ' ' . $response_array['surname'], // ." (" . $this->getCount($sales_person_name, $sales_person_surname) . ")",
                'url' => Url::fromRoute('filter_by_person.form', ['name'=> empty($response_array['name']) ? '-' : $response_array['name'], 'surname'=> empty($response_array['surname']) ? '-' : $response_array['surname'] ]),
                'attributes' => [
                    'class' => [
                    'links__link',
                    ],
                ],
                ],
            ]
            ]
        ];
        */

        $row[] = $response_array['name_surname'];
        $row[] = empty($response_array['id_card_number']) ? '-' : $response_array['id_card_number'];

        // $body = $node->get('body')->getValue();
        // if(!empty($body)){
        $row[] = strip_tags($response_array['detail']);
        // }else{
        //     $row[] = '';
        // }

        /*
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

            if(!empty($bank_wallet_target_id)){
                $bank_wallet = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($bank_wallet_target_id);
                $merchant_bank_account['bank_wallet'] = $bank_wallet->label();
            }
            
            
            $merchant_bank_accounts[] = $merchant_bank_account;
        }
        

        $row[] = ['data' => 
                        [
                        '#theme'     => 'row-merchant-bank-account',
                        '#items'    => $merchant_bank_accounts,
                        ]
                    ];
        */

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
        
        // 

        $rows[] = $row;
    }
	
  //  if($fname == "" && $marks ==""){
    $form['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,//get_students("All","",""),
      '#empty' => $this->t('No data'),
      '#prefix' => '<div class="banlist-table">',
      '#suffix' => '</div>'
    ];

    // $items = array();

    // for ($x = 0; $x <= 1000; $x++) {
    //   $items[] = $this->generateRandomString(5) . " : " . $x;
    // }

    $thispage = "/" ;
    $num = $response_arrays["all_result_count"];//count($items); // number of items in list
    $per_page = 30; // Number of items to show per page
    $showeachside = 5; //  Number of items to show either side of selected page

    $start = $offset * $per_page;//empty(\Drupal::request()->query->get('start')) ? 0  : \Drupal::request()->query->get('start');
    // if(empty($start))$start=0;  // Current start position

    $max_pages = ceil($num / $per_page); // Number of pages
    $cur = ceil($start / $per_page)+1; // Current page number

    /*
    // https://www.w3schools.com/css/css3_pagination.asp
    $form['pagination'] = [
      '#type' => 'item',
      // '#title' => t('Pagging'),
      // '#markup' => t('Block content'),
      '#prefix' => '<div>
                          <div class="pagination">
                            <a href="#">&laquo;</a>
                            <a href="#">1</a>
                            <a href="#">2</a>
                            <a href="#">3</a>
                            <a href="#">4</a>
                            <a href="#">5</a>
                            <a href="#">6</a>
                            <a href="#">&raquo;</a>
                          </div>',
      '#suffix' => '</div>'
    ];
    */

    // $key_word = 
    // $fulltextFields
    // dpm($key_word);
    // dpm($fulltextFields);

    // $url_query = ;
    // dpm($url_query);

    $query = '?';
    if(!empty($key_word) && !empty($fulltextFields)){
      $query ='?key_word=' . $key_word . '&' . http_build_query(array('filter'=>$fulltextFields));
    }

    // $a1 = '';
    // if(($start-$per_page) >= 0)
    // {
    //   $next = $start-$per_page;
    //   if($query == '?'){
    //     $a1 = '<a href="?offset='. $next/30 .'"><<</a>' ;
    //   }else{
    //     $a1 = '<a href="'.$query. '&offset='. $next/30 .'"><<</a>' ;
    //   }
    // }

    // $a2 = '';
    // if($start+$per_page<$num)
    // {
    //   // $a2 = '<a href="/'. "?start=".max(0,$start+$per_page) . '">&gt;&gt;</a> ';

    //   // dpm("--> ");
    //   // dpm(($start+$per_page/30));
    //   // dpm("<--");
    //   if($query == '?'){
    //     $a2 = '<a href="?offset='. ($offset + 1) .'">&gt;&gt;</a> ';
    //   }else{
    //     $a2 = '<a href="'.$query.'offset='. $offset .'">&gt;&gt;</a> ';
    //   }
      
    // }

    $eitherside = ($showeachside * $per_page);
    // $a3 = '';
    // if($start+1 > $eitherside) $a3 =" .... ";


    // $a4 = '';
    // $pg=1;
    // for($y=0;$y<$num;$y+=$per_page)
    // {
    //     $class=($y==$start)?"pageselected":"";
    //     if(($y > ($start - $eitherside)) && ($y < ($start + $eitherside))){
    //       $a4 .= '<a class="' .$class .'" href="'. $query .'&offset='. ($y/30).'">' . $pg .'</a>'; 
    //     }
    //     $pg++;
    // }

    // $a5 = '';
    // for($x=$start; $x<min($num,($start+$per_page)); $x++) $a5 .= ($items[$x]."<br>");
                        
    // dpm($start+$per_page);
    // dpm($num);
    if($start+$per_page<$num || $offset > 0){
      // $form['pagination'] = [
      //   '#type' => 'item',
      //   // '#title' => t('Pagging'),
      //   // '#markup' => t('Block content'),
      //   '#prefix' => '<div>
      //                 <table width="400" border="0" align="center" cellpadding="0" cellspacing="0" class="PHPBODY">
      //                   <tr> 
      //                     <td width="99" align="center" valign="middle" bgcolor="#EAEAEA"> 
      //                     '. $a1 .'
      //                     </td>
      //                     <td width="201" align="center" valign="middle" class="selected">
      //                         Page ' . $cur .' of '. $max_pages .'
      //                     </td>
      //                     <td width="100" align="center" valign="middle" bgcolor="#EAEAEA"> 
      //                     '. $a2 .'
      //                     </td>
      //                   </tr>
      //                   <tr> 
      //                     <td colspan="3" align="center" valign="middle" class="selected"> 
  
      //                     '. $a3 . $a4 .'
      //                     </td>
      //                   </tr>
      //                   <tr>
      //                   <td colspan="3" align="center">
      //                     '. $a5 .'
      //                   </td>
      //                   </tr>',
      //   '#suffix' => '</table></div>'
      // ];


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
  

  //  }else{
	//     $form['table'] = [
  //     '#type' => 'table',
  //     '#header' => $header,
  //     '#rows' => get_students("",$fname,$marks),
  //     '#empty' => $this->t('No records found'),
  //   ];
  //  }
    // $form['pager'] = [
    //   '#type' => 'pager'
    // ];

    // $form['count'] = array(
    //   '#markup' => t('Displaying %start - %end of %all', array('%start'=>($current_page * $limit + 1), 
    //                                                            '%end'=>(($current_page * $limit) + $limit),
    //                                                            '%all'=>count($all_nids))),
    //   '#weight' => 100000,
    // );
   
    return $form;
  }

  function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }
}
