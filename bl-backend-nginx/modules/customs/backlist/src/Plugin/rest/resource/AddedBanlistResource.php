<?php

namespace Drupal\backlist\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\user\Entity\User;
use Drupal\node\Entity\Node;

use Drupal\backlist\Utils\Utils;

/**
 * Provides a resource to create new article.
 *
 * @RestResource(
 *   id = "add_banlist_resource",
 *   label = @Translation("Banlist : Add banlist"),
 *   uri_paths = {
 *     "create" = "/v1/add_banlist",
 *   }
 * )
 */
class AddedBanlistResource extends ResourceBase {

  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Constructs a new CreateArticleResource object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Session\AccountProxyInterface $current_user
   *   A current user instance.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    AccountProxyInterface $current_user) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('dummy'),
      $container->get('current_user')
    );
  }

  /*
   code : 
    - 101 : 
    - 102 : 
    - 103 : 
    - 104 : 
  */

  /**
   * Responds to POST requests.
   */
  public function post($data) {
    $response_array = array();
    try {
      
      $time1    = microtime(true);

      $response_array['result']   = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      return new JsonResponse( $response_array );  

      /*
      $response['target'] = $request->query->get('attached_file');//isset(\Drupal::request()->request->get('attached_file')) ? \Drupal::request()->request->get('attached_file') : FALSE;

      $postReq = \Drupal::request()->request->all();

      $response['attached_file'] = $postReq['attached_file'];
      $response['postReq'] = mb_convert_encoding($postReq, 'UTF-8', 'UTF-8') ;

      // \Drupal::logger('added-banlist')->notice(serialize($postReq));

      // $response['$_FILES']  = serialize( $_FILES["photo"] );

      if(!empty($_FILES)){
        // $target = 'sites/default/files/'. $_FILES['attached_file']['name'];
        // move_uploaded_file( $_FILES['attached_file']['tmp_name'], $target);

        // $attached_file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'.png' , FILE_EXISTS_RENAME);

        $response['$_FILES']  = 'YES';
      }else{
        $response['$_FILES']  = 'NO';
      }
      */

      // $node = Node::create([
      //   'type'                   => 'user_deposit',
      //   'uid'                    => $uid,
      //   'status'                 => 1,
      //   'title'                  => "ฝากเงิน : " . $user->getUsername(),

      //   'field_huay_list_bank'   => $hauy_id_bank,        // ธนาคารของเว็บฯ ที่โอนเข้า
      //   'field_list_bank'        => $user_id_bank,        // ธนาคารที่ทำการโอนเงินเข้ามา
      //   'field_transfer_method'  => $transfer_method,     // ช่องทางการโอนเงิน
      //   'field_amount'           => $amount,              // จำนวนเงินที่โอน
      //   'field_attached_file'    => empty($attached_file) ? array() : array('target_id'=>$attached_file->id()),
      //   'field_date_transfer'    => date('Y-m-d\TH:i:s', $date_transfer/1000),       // วัน-เวลาโอน
      //   'body'                   => $note,                // หมายเหตุ
      // ]);
      // $node->save();

      /*
      product_type   : สินค้า/ประเภท
      transfer_amount: ยอดเงิน
      person_name    : ชื่อบัญชี ผู้รับเงินโอน
      person_surname : นามสกุล ผู้รับเงินโอน
      id_card_number : เลขบัตรประชาชนคนขาย
      selling_website: เว็บไซด์ประกาศขายของ
      transfer_date  : วันโอนเงิน
      details        : รายละเอียดเพิ่มเติม

      merchant_bank_account : บัญชีธนาคารคนขาย
      // options
      // 1: ธนาคารกรุงศรีอยุธยา
      // 2: ธนาคารกรุงเทพ
      // 3: ธนาคารซีไอเอ็มบี  
      // 4: ธนาคารออมสิน
      // 5: ธนาคารอิสลาม
      // 6: ธนาคารกสิกรไทย
      // 7: ธนาคารเกียรตินาคิน
      // 8: ธนาคารกรุงไทย
      // 9: ธนาคารไทยพาณิชย์
      // 10: Standard Chartered
      // 11: ธนาคารธนชาติ
      // 12: ทิสโก้แบงค์
      // 13: ธนาคารทหารไทย
      // 14: ธนาคารยูโอบี
      // 15: ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
      // 16: True Wallet
      // 17: พร้อมเพย์ (PromptPay)
      // 18: ธนาคารอาคารสงเคราะห์
      // 19: AirPay (แอร์เพย์)
      // 20: mPay
      // 21: 123 เซอร์วิส
      // 22: ธ.ไทยเครดิตเพื่อรายย่อย
      // 23: ธนาคารแลนด์แอนด์เฮ้าส์
      // 24: เก็บเงินปลายทาง 

      images                : รูปภาพประกอบ
      */

      /*
      product_type   : สินค้า/ประเภท
      transfer_amount: ยอดเงิน
      person_name    : ชื่อบัญชี ผู้รับเงินโอน
      person_surname : นามสกุล ผู้รับเงินโอน
      id_card_number : เลขบัตรประชาชนคนขาย
      selling_website: เว็บไซด์ประกาศขายของ
      transfer_date  : วันโอนเงิน
      details        : รายละเอียดเพิ่มเติม
      */

      /*
      $uid            = trim( $_REQUEST['uid'] );

      if(!empty($_FILES)){
        $target = 'sites/default/files/'. $_FILES['file']['name'];
        move_uploaded_file( $_FILES['file']['tmp_name'], $target);

        $file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'_'.mt_rand().'.png' , FileSystemInterface::EXISTS_REPLACE);

        $user = User::load($uid);
        if(!empty($user)){
          $user->set('user_picture', $file->id());
          $user->save();
        }

        $response_array['image_url']  =  file_create_url($file->getFileUri());
      }
      */

      // $content        = json_decode( $request->getContent(), TRUE );

      // $basic_auth     = trim( $_REQUEST['basic_auth'] );

      $nid        = trim( $_REQUEST['nid'] );            // new/edit
      $product_type   = trim( $_REQUEST['product_type'] );       // สินค้า/ประเภท
      $transfer_amount= trim( $_REQUEST['transfer_amount'] );    // ยอดเงิน
      $person_name    = trim( $_REQUEST['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
      $person_surname = trim( $_REQUEST['person_surname'] );     // นามสกุล ผู้รับเงินโอน
      $id_card_number = trim( $_REQUEST['id_card_number'] );     // เลขบัตรประชาชนคนขาย
      $selling_website= trim( $_REQUEST['selling_website'] );    // เว็บไซด์ประกาศขายของ
      $transfer_date  = trim( $_REQUEST['transfer_date'] );      // วันโอนเงิน
      $details        = trim( $_REQUEST['detail'] );            // รายละเอียดเพิ่มเติม
      $merchant_bank_account   = json_decode($_REQUEST['merchant_bank_account']); // บัญชีธนาคารคนขาย
      // $images         = $content['images'];            // รูปภาพประกอบ
      
      // $response_array['result']   = TRUE;
      // $response_array['execution_time']   = microtime(true) - $time1;
      // $response_array['merchant_bank_account'] = $merchant_bank_account;
      // $response_array['eee'] = $_REQUEST['merchant_bank_account'];
      // return new JsonResponse( $response_array ); 

      /*
          { "product_type"   : "product_type 1",
            "transfer_amount": 500,
            "person_name"    : "person_name 1",
            "person_surname" : "person_surname 1",
            "id_card_number" : 2138123412,
            "selling_website": "http://banlist.info",
            "transfer_date"  : "2021-01-19",
            "details"        : "details 1",
            "images":[{"type": "type 1", "image":'', "name":"name 1", "extension": "png"}, 
                      {"type": "type 2", "image":"dfasfd", "name":"name 2", "extension": "png"}, 
                      {"type": "type 3", "image":"dfasfd", "name":"name 3", "extension": "png"}],

            "merchant_bank_account":[{"bank_account": "1234", "bank_wallet": 15}]
          }
      */
      if( empty(trim($product_type))   || 
          empty(trim($person_name))    || 
          empty(trim($person_surname)) ||
          empty(trim($transfer_date)) ||
          empty(trim($details)) ){

        $response_array['result']   = FALSE;
        $response_array['product_type']   = $product_type;
        $response_array['person_name']   = $person_name;
        $response_array['person_surname']   = $person_surname;
        $response_array['transfer_date']   = $transfer_date;
        $response_array['details']   = $details;
        $response_array['message']  = 'Empty product_type or person_name or person_surname or transfer_date or details';
        // $response['execution_time']   = microtime(true) - $time1;
        return new JsonResponse( $response_array );  
      }

      $merchant_bank_account_paragraphs =array();
      foreach ($merchant_bank_account as $ii=>$vv){
        $item_merchant = Paragraph::create([
          'type'                    => 'item_merchant_bank_account',
          'field_bank_account'      => $vv->bank_account,
          'field_bank_wallet'       => $vv->bank_wallet, 
        ]);
        $item_merchant->save();
        $merchant_bank_account_paragraphs[] = array('target_id'=> $item_merchant->id(), 'target_revision_id' => $item_merchant->getRevisionId());
      }
      
      // $images_fids = array();
      // foreach ($images as $imi=>$imv){
      //   $file = file_save_data(base64_decode($imv['image']), 'public://'. date('m-d-Y_hia') . '.' . ( empty($imv['extension']) ? 'png': $imv['extension']), FileSystemInterface::EXISTS_RENAME);
      //   $images_fids[] = array(
      //     'target_id' => $file->id(),
      //     'alt' => '',
      //     'title' => empty($imv['name']) ? '' : $imv['name']
      //   );
      // }

  

      // $response['images_fids']  = $images_fids;
      /*
      $product_type   = trim( $content['product_type'] );       // สินค้า/ประเภท
      $transfer_amount= trim( $content['transfer_amount'] );    // ยอดเงิน
      $person_name    = trim( $content['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
      $person_surname = trim( $content['person_surname'] );     // นามสกุล ผู้รับเงินโอน
      $id_card_number = trim( $content['id_card_number'] );     // เลขบัตรประชาชนคนขาย
      $selling_website= trim( $content['selling_website'] );    // เว็บไซด์ประกาศขายของ
      $transfer_date  = trim( $content['transfer_date'] );      // วันโอนเงิน
      $details        = trim( $content['details'] );            // รายละเอียดเพิ่มเติม
      $merchant_bank_account   = $content['merchant_bank_account']; // บัญชีธนาคารคนขาย
      $images         = $content['images'];                     // รูปภาพประกอบ
      */
      
      if(!empty($nid) && $nid !=  'undefined' ){
        $node = Node::load($nid);
        $node->setChangedTime((new \DateTime('now'))->getTimestamp());

        if( strcmp($node->label(), $product_type) != 0 ){
          $node->title = $product_type;
        }

        $field_transfer_amount = $node->field_transfer_amount->getValue();
        if(!empty($field_transfer_amount)){
          $field_transfer_amount = $field_transfer_amount[0]['value'];

          if( strcmp($field_transfer_amount, $transfer_amount) != 0 ){
            $node->field_transfer_amount = $transfer_amount;
          }
        }else{
          $node->field_transfer_amount = $transfer_amount;
        }

        $field_sales_person_name = $node->field_sales_person_name->getValue();
        if(!empty($field_sales_person_name)){
          $field_sales_person_name = $field_sales_person_name[0]['value'];

          if( strcmp($field_sales_person_name, $person_name) != 0 ){
            $node->field_sales_person_name = $person_name;
          }
        }else{
          $node->field_sales_person_name = $person_name;
        }

        $field_sales_person_surname = $node->field_sales_person_surname->getValue();
        if(!empty($field_sales_person_surname)){
          $field_sales_person_surname = $field_sales_person_surname[0]['value'];

          if( strcmp($field_sales_person_surname, $person_surname) != 0 ){
            $node->field_sales_person_surname = $person_surname;
          }
        }else{
          $node->field_sales_person_surname = $person_surname;
        }

        $field_id_card_number = $node->field_id_card_number->getValue();
        if(!empty($field_id_card_number)){
          $field_id_card_number = $field_id_card_number[0]['value'];

          if( strcmp($field_id_card_number, $id_card_number) != 0 ){
            $node->field_id_card_number = $id_card_number;
          }
        }else{
          $node->field_id_card_number = $id_card_number;
        }


        $field_selling_website = $node->field_selling_website->getValue();
        if(!empty($field_selling_website)){
          $field_selling_website = $field_selling_website[0]['value'];

          if( strcmp($field_selling_website, $selling_website) != 0 ){
            $node->field_selling_website = $selling_website;
          }
        }else{
          $node->field_selling_website = $selling_website;
        }

        $body = $node->body->getValue();
        if(!empty($body)){
          $body = $body[0]['value'];
          if( strcmp($body, $details) != 0 ){
            $node->body = $details;
          }
        }else{
          $node->body = $details;
        }

        $node->save();

      }else{

        $images_fids = array();
        $total = count($_FILES['files']['name']);
        // Loop through each file
        for( $i=0 ; $i < $total ; $i++ ) {
  
          $target = 'sites/default/files/'. $_FILES['files']['name'][$i];
          move_uploaded_file( $_FILES['files']['tmp_name'][$i], $target);
  
          $file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'_'.mt_rand().'.png' , FileSystemInterface::EXISTS_REPLACE);
          $images_fids[] = array(
            'target_id' => $file->id(),
            'alt' => '',
            'title' => empty($_FILES['files']['name'][$i]) ? '' : $_FILES['files']['name'][$i]
          );
        }

        $node = Node::create([
          'type'                   => 'back_list',
          'uid'                    => \Drupal::currentUser()->id(),
          'status'                 => 1,
          'field_channel'          => 32,                // ถูกสร้างผ่านช่องทาง 31: Web, 32: Api
  
          'title'                  => $product_type,     // สินค้า/ประเภท
          'field_transfer_amount'  => $transfer_amount,  // ยอดเงิน
          'field_sales_person_name'=> $person_name,      // ชื่อบัญชี ผู้รับเงินโอน
          'field_sales_person_surname' => $person_surname, // นามสกุล ผู้รับเงินโอน
          'field_id_card_number'    => $id_card_number,  // เลขบัตรประชาชนคนขาย
          'field_selling_website'   => $selling_website, // เว็บไซด์ประกาศขายของ
          'field_transfer_date'     => date('Y-m-d',  $transfer_date),   // วันโอนเงิน
          'body'                    => $details,         // หมายเหตุ
          'field_merchant_bank_account' => $merchant_bank_account_paragraphs, // บัญชีธนาคารคนขาย
          'field_images'            => $images_fids      // รูปภาพประกอบ
        ]);
        $node->save();
      }
      
      // ------------ noti to user and fetch all my_apps new
      // Utils::node_my_apps(\Drupal::currentUser()->id());
      // ------------
      
      $response_array['result']   = TRUE;
      $response_array['execution_time']   = microtime(true) - $time1;
      return new JsonResponse( $response_array );  
    } catch (\Throwable $e) {
      \Drupal::logger('AddedBanlist')->notice($e->__toString());

      $response_array['result']   = FALSE;
      $response_array['message']  = $e->__toString();
      return new JsonResponse( $response_array );
    }
  }
}