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
    // $product_type       = \Drupal::request()->query->get('product_type');
    // $sales_person_name  = \Drupal::request()->query->get('sales_person_name');
    // $reportor           = \Drupal::request()->query->get('reportor');

    $fulltextFields      = \Drupal::request()->query->get('filter');

    $response_arrays = array();
    if(empty($key_word)){
        $key_word = "*";
        $offset = 0;
        $type = 0;

        $response_arrays = Utils::search_api($key_word, $offset, $type);
    }else{
        $offset = 0;
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

    // dpm($response_arrays["execution_time"]);
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
}
