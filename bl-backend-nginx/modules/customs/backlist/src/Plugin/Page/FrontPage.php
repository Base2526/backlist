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
class FrontPage extends ControllerBase {
  /**
   * {@inheritdoc}
   */
  protected function getModuleName() {
    return 'front_page';
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
  
    $limit = 30;

    //====load filter controller
	  $form['form'] = $this->formBuilder()->getForm('Drupal\backlist\Form\SearchForm');
 

    //Get parameter value while submitting filter form  
    $product_type       = \Drupal::request()->query->get('product_type');
    $sales_person_name  = \Drupal::request()->query->get('sales_person_name');
    $reportor           = \Drupal::request()->query->get('reportor');

    $current_page = empty(\Drupal::request()->query->get('page')) ? 0 : \Drupal::request()->query->get('page') ;

    // dpm( $product_type );
    // dpm( $sales_person_name );
    // dpm( $reportor );
    // dpm( $current_page );

    // Create table header.
    $header = [
      'product_type'      => $this->t('Product type'),        // สินค้า/ประเภท
      'sales_person_name' => $this->t('Sales person name'),   // ชื่อบัญชีผู้รับเงินโอน
      'details'           => $this->t('Details'),
      'bank_account' => $this->t('Bank account'),
      'transfer_amount'   => $this->t('Transfer amount'),     // ยอดเงิน
      'date_post'         => $this->t('Date post'),	  
      // 'reportor'          => $this->t('Reportor')
    ];

    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');

    if(!empty($product_type)){
      $query->condition('title', $product_type);
    }

    if(!empty($sales_person_name)){
      $query->condition('field_sales_person_name', $sales_person_name, 'CONTAINS');
    }

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

    // $query->condition('status', 1);
    $query->sort('changed' , 'DESC');
    $query->tableSort($header);

    $all_nids = $query->execute();
    // Default value is 10.
    $query->pager($limit);

    // $all_nids = $query->execute();
    $nids = $query->execute();

    // dpm(count($nids));
    
    $date_formatter = \Drupal::service('date.formatter');
    $rows = [];
    foreach ($storage->loadMultiple($nids) as $node) {
      $row = [];
      // $row[] = $node->id();

      // dpm($node->label());

      // dpm( $Utils::truncate( ($node->get('body')->getValue()[0]['value']), 10) );
    
      //   path: '/backlist_view/{nid}'
      // $row[] = $node->toLink();
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

               /*
               $options = ['absolute' => TRUE];
                $url_object = Drupal\Core\Url::fromRoute('entity.node.canonical', ['node' => $nid], $options);

               */

      
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
      
      // dpm( $node->get('field_sales_person_name')->getValue() );
      // $row[] = $sales_person_name . ' ' . $sales_person_surname;//Utils::truncate($node->get('field_sales_person_name')->getValue()[0]['value'], 50);

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
      // $row[] = 'ดูรายละเอียด';//Utils::truncate($node->get('body')->value, 200);


      // // image
      // $row[] = [
      //   'data' => [
      //     '#theme' => 'image',
      //     // '#text' => $date_formatter->format($created),
      //     // '#attributes' => [
      //     //   'datetime' => $date_formatter->format($created, 'custom', \DateTime::RFC3339),
      //     // ],
      //     '#uri' => 'https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb',
      //     // '#alt' => $title,
      //     // '#title' => $title,
      //     '#width' => '80px',
      //   ],
      // ];

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

      //'my_profile'
      // dpm( $node->getOwnerId() );
      // \Drupal\Core\Url::fromRoute('<front>')

      // $ownerId = $node->getOwnerId();
      // if(!empty($ownerId)){
        /*
        $user = User::load($ownerId);

        // $field_display_name = $user->get('field_display_name')->value;
        // dpm($field_display_name);
        $row[] = [
          // 'data' => $node->get('uid')->view(),
          'data' => [
            '#theme' => 'links',
            '#attributes' => [
              'class' => [
                'links',
              ],
            ],
            '#links' => [
              [
                'title' =>  empty($user->get('field_display_name')->value) ? $user->get('name')->value : $user->get('field_display_name')->value,
                // 'url' => Url::fromRoute('my_profile.form', ['uid' => $ownerId]),
                // 'url' => Url::fromRoute('entity.user.edit_form', ['user' => $ownerId]),
                'url' => Url::fromRoute('profile.form', ['uid' => $ownerId]),
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

        // entity.user.edit_form', ['user' => $this->currentUser()->id()], [], 301);
        // $row[] = theme('image', array('path' => 'https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb'));
        // $rows[] = array('<img src="https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb" alt="photo" style="width:100px;height:300px">');
      
        // dpm();
        
        $rows[] = $row;
      // }
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
    $form['pager'] = [
      '#type' => 'pager'
    ];

    $form['count'] = array(
      '#markup' => t('Displaying %start - %end of %all', array('%start'=>($current_page * $limit + 1), 
                                                               '%end'=>(($current_page * $limit) + $limit),
                                                               '%all'=>count($all_nids))),
      '#weight' => 100000,
    );
   
    return $form;
  }
}
