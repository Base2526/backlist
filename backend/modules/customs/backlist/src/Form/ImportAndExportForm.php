<?php
/**
 * @file
 * Contains \Drupal\IMPORT_EXAMPLE\Form\ImportForm.
 */
namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use Drupal\Core\File\FileSystemInterface;
use Drupal\paragraphs\Entity\Paragraph;

// https://www.fuseiq.com/blog/import-drupal-8-content-csv-file
class ImportAndExportForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'import_and_export_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    // $form['description'] = array(
    //   '#markup' => '<p>Use this form to upload a Excel file</p>',
    // );

    $form['import_excel'] = array(
      '#type' => 'managed_file',
      '#title' => t('Upload file here'),
      '#upload_location' => 'public://excel',
      '#default_value' => '',
      "#upload_validators"  => array("file_validate_extensions" => array("xlsx")),
      '#states' => array(
        'visible' => array(
          ':input[name="File_type"]' => array('value' => t('Upload Your File')),
        ),
      ),
    );

    $form['actions']['#type'] = 'actions';

    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Upload Excel'),
      '#button_type' => 'primary',
    );

    return $form;
  }

  private function test($fid){

    // require_once 'sites/default/libraries/PHPExcel/Classes/PHPExcel.php';

    // /* Load the object of the file by it's fid */
    // $tmpfname = File::load( '1695' );


    // $path = file_create_url($tmpfname->getFileUri());

    // $inputFileName = '.'. rawurldecode(file_url_transform_relative($path));

    // $excelReader = \PHPExcel_IOFactory::createReaderForFile($inputFileName);
    // $excelObj = $excelReader->load($inputFileName);



    // $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load("./excel.xlsx");

    // require_once 'sites/default/libraries/PHPExcel/Classes/PHPExcel.php';

    /* Load the object of the file by it's fid */
    $tmpfname = File::load( $fid );


    $path = file_create_url($tmpfname->getFileUri());

    $inputFileName = '.'. rawurldecode(file_url_transform_relative($path));

    // dpm( $inputFileName );
    // $excelReader = \PHPExcel_IOFactory::createReaderForFile($inputFileName);
    // $excelObj = $excelReader->load($inputFileName);

    $spreadsheet = IOFactory::load($inputFileName);
    //dpm( $spreadsheet );

    $objWorksheet = $spreadsheet->getSheet(0);

    $images = array();
    foreach ($objWorksheet->getDrawingCollection() as $drawing) {
      list($startColumn, $startRow) = Coordinate::coordinateFromString($drawing->getCoordinates());
      // echo $startColumn ." : ".$startRow.', Extension : ' .  $drawing->getExtension() .', Path : '. $drawing->getPath() .' <br/>';


      $imageFilePath = \Drupal::service('file_system')->realpath('public://');

      $imageFileName = $drawing->getCoordinates() . mt_rand(10000, 99999);
      
      // echo $source = imagecreatefromjpeg($drawing->getPath());
      switch($drawing->getExtension()) {
        case 'jpg':
        case 'jpeg':
            $imageFileName = $imageFilePath.'/'.$imageFileName . '.jpeg';
            $source = imagecreatefromjpeg($drawing->getPath());
            imagejpeg($source, $imageFileName);

            // load the image
            $file_data = file_get_contents( $imageFileName );
            $file = file_save_data($file_data, 'public://'. date('m-d-Y_hia') .'_' . mt_rand(10000, 99999) . '.jpeg', FileSystemInterface::EXISTS_RENAME);


            $images[$startRow][] = $file->id();

            // delete file
            unlink($imageFileName);

            break;
        // case 'gif':
        //     $imageFileName .= '.gif';
        //     $source = imagecreatefromgif($drawing->getPath());
        //     imagegif($source, $imageFilePath.$imageFileName);
        //     break;
        case 'png':
            $imageFileName = $imageFilePath.'/'.$imageFileName . '.png';
            $source = imagecreatefrompng($drawing->getPath());
            imagepng($source, $imageFileName);

            // load the image
            $file_data = file_get_contents( $imageFileName );
            $file = file_save_data($file_data, 'public://'. date('m-d-Y_hia') .'_' . mt_rand(10000, 99999) . '.png' , FileSystemInterface::EXISTS_RENAME);

            $images[$startRow][] = $file->id();

            // delete file
            unlink($imageFileName);
            break;
      }
      
    }


    // dpm( $images );

    $worksheet = $spreadsheet->getActiveSheet();
    $worksheetArray = $worksheet->toArray();
    array_shift($worksheetArray);
    // echo '<table style="width:100%"  border="1">';
    // echo '<tr align="center">';
    // echo '<td>Sno</td>';
    // echo '<td>Name</td>';
    // echo '<td>Image</td>';
    // echo '</tr>';

    foreach ($worksheetArray as $key => $value) {
        // list($startColumn, $startRow) = $worksheet->getDrawingCollection()->getCoordinates();
        // dpm($startColumn);

        
        // $worksheet = $spreadsheet->getActiveSheet();
        // $drawing = $worksheet->getDrawingCollection()[$key];

        // $spreadsheet->getActiveSheet()->getDrawingCollection()[0]->getCoordinates();

        
        $images_fids = array();
        // if(!empty($drawing)){
          // list($startColumn, $startRow) = Coordinate::coordinateFromString($drawing->getCoordinates());
          // dpm( $startColumn ." : ".$startRow );
  
          if( isset( $images[ $key + 2 ] )){          
            foreach ($images[ $key + 2 ] as $imi=>$imv){
              // $file = file_save_data(base64_decode($imv['image']), 'public://'. date('m-d-Y_hia') . '.' . ( empty($imv['extension']) ? 'png': $imv['extension']), FileSystemInterface::EXISTS_RENAME);
              $images_fids[] = array(
                'target_id' => $imv,
                'alt' => '',
                // 'title' => empty($imv['name']) ? '' : $imv['name']
              );
            }
          }
        // }

        // dpm( $images_fids ); 
        

    
        // $zipReader = fopen($drawing->getPath(), 'r');
        // $imageContents = '';
        // while (!feof($zipReader)) {
        //     $imageContents .= fread($zipReader, 1024);
        // }
        // fclose($zipReader);
        // $extension = $drawing->getExtension();

        // echo '<tr align="center">';
        // echo '<td>' . $key . '</td>';
        // echo '<td>' . $value[0] . '</td>';
        // echo '<td>' . $value[1] . '</td>';
        // // echo '<td><img  height="150px" width="150px"   src="data:image/jpeg;base64,' . base64_encode($imageContents) . '"/></td>';
        // echo '</tr>';
        

        // dpm( '<img  height="150px" width="150px"   src="data:image/jpeg;base64,' . base64_encode($imageContents) . '"/>' );


        // 13414124324:23, 4356346456546:66

        // $merchant_bank_account_paragraphs =array();
        // foreach ($merchant_bank_account as $ii=>$vv){
        //   // $item_merchant = Paragraph::create([
        //   //   'type'                    => 'item_merchant_bank_account',
        //   //   'field_bank_account'      => $vv["bank_account"],
        //   //   'field_bank_wallet'       => $vv["bank_wallet"], 
        //   // ]);
        //   // $item_merchant->save();
        //   // $merchant_bank_account_paragraphs[] = array('target_id'=> $item_merchant->id(), 'target_revision_id' => $item_merchant->getRevisionId());
        // }

        // dpm($value[0]);

        $product_type    =  $value[0] ;    // สินค้า/ประเภท
        $transfer_amount =  $value[1] ;    // ยอดเงิน
        $person_name     =  $value[2] ;    // ชื่อบัญชี ผู้รับเงินโอน
        $person_surname  =  $value[3] ;    // นามสกุล ผู้รับเงินโอน
        $id_card_number  =  $value[4] ;    // เลขบัตรประชาชนคนขาย
        $selling_website =  $value[5] ;    // เว็บไซด์ประกาศขายของ
        $transfer_date   =  $value[6] ;    // วันโอนเงิน
        $details         =  $value[7] ;    // หมายเหตุ

        $merchant_bank_account = $value[8];
        $merchant_bank_account = explode(",", $merchant_bank_account);

        $merchant_bank_account_paragraphs =array();
        if(!empty( $merchant_bank_account )){
          foreach ($merchant_bank_account as $ii=>$vv){
            $ba = explode(":", $vv);
            $item_merchant = Paragraph::create([
              'type'                    => 'item_merchant_bank_account',
              'field_bank_wallet'       => $ba[0],  
              'field_bank_account'      => $ba[1],  // เลขบัญชี
            ]);
            $item_merchant->save();
            $merchant_bank_account_paragraphs[] = array('target_id'=> $item_merchant->id(), 'target_revision_id' => $item_merchant->getRevisionId());
          }
        }

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

        $node = Node::create([
          'type'                   => 'back_list',
          'uid'                    => \Drupal::currentUser()->id(),
          'status'                 => 1,
          'field_channel'          => 31,                // ถูกสร้างผ่านช่องทาง 31: Web, 32: Api
    
          'title'                  => $product_type,     // สินค้า/ประเภท
          'field_transfer_amount'  => $transfer_amount,  // ยอดเงิน
          'field_sales_person_name'=> $person_name,      // ชื่อบัญชี ผู้รับเงินโอน
          'field_sales_person_surname' => $person_surname, // นามสกุล ผู้รับเงินโอน
          'field_id_card_number'    => $id_card_number,  // เลขบัตรประชาชนคนขาย
          'field_selling_website'   => $selling_website, // เว็บไซด์ประกาศขายของ
          'field_transfer_date'     => $transfer_date,   // วันโอนเงิน
          'body'                    => $details,         // หมายเหตุ
          'field_merchant_bank_account' => $merchant_bank_account_paragraphs, // บัญชีธนาคารคนขาย
          'field_images'            => $images_fids      // รูปภาพประกอบ
        ]);
        $node->save();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Fetch the array of the file stored temporarily in database
    $excel_file = $form_state->getValue('import_excel');

    // Load the object of the file by it's fid 
    $file = File::load( $excel_file[0] );

    // Set the status flag permanent of the file object 
    $file->setPermanent();

    // Save the file in database 
    $file->save();

    $this->test($file->id());

    return ;

    /*

    // You can use any sort of function to process your data. The goal is to get each 'row' of data into an array
    // If you need to work on how data is extracted, process it here.
    $data = $this->csvtoarray($file->getFileUri(), ',');

    // dpm($data);
    // $term = \Drupal\taxonomy\Entity\Term::create([
    //     'vid' => 'rw',
    //     'langcode' => 'en',
    //     'name' => 'My tag',
    //     'description' => [
    //       'value' => '<p>My description.</p>',
    //       'format' => 'full_html',
    //     ],
    //     'weight' => -1,
    //     'parent' => array(0),
    // ]);
    // $rw_n = $term->save();
    // dpm($rw_n);

    // dpm( count($data) );
    // dpm( $data );
    // return;
    $count_new_insert = 0;
    foreach($data as $row) {
        //$operations[] = ['\Drupal\IMPORT_EXAMPLE\addImportContent::addImportContentItem', [$row]];

        // dpm($row[2]);
        // $r = implode(",", $row);
        // dpm($r);

        $is_insert = TRUE;
        // $tid = 0;

        
        $nids = \Drupal::entityQuery('node')
                ->condition('type','master_store_branch')
                ->condition('field_store_code',  $row[3])
                ->condition('status', 1)
                ->execute();

        // dpm($nids);
        // $query = \Drupal::entityQuery('node')
        //     ->condition('status', 1)
        //     ->condition('changed', REQUEST_TIME, '<')
        //     ->condition('title', 'cat', 'CONTAINS')
        //     ->condition('field_tags.entity.name', 'cats');

        // $nids = $query->execute();

        if(empty($nids)){
            // $term = \Drupal\taxonomy\Entity\Term::load($tid);
            
            // [0] => 01
            // [1] => Hyper
            // [2] => 00217
            // [3] => พิบูลมังสาหาร
            // [4] => BIGC MARKET PHIBULMANGSAHARN
            // [5] => 41/9 ถนนสถิตย์นิมานการ ตำบลพิบูล อำเภอพิบูลมังสาหาร
            // [6] => จังหวัดอุบลราชธานี 34110
            // [7] => 
            // [8] => (045)442-330
            // [9] => 
            // [10] => 0107536000633

            // BU_TYPE, BU_NAME, BRANCH_ID,SHORT_NAME_THAI,SHORT_NAME,ADDR1,ADDR2,ADDR3,TELEP,FAX,TAXID
            

            // dpm(implode(",", $row));
            
            

            $bu_type = 0;
            switch($row[0]){
              case 1:{
                $bu_type = 1278;
              break;
              }

              case 3:{
                $bu_type = 1279;
              break;
              }

              case 5:{
                $bu_type = 1280;
              break;
              }
            }


            $node = Node::create([
              'type'        => 'master_store_branch',
              'status'     => 1,
              'title'       => $row[4], 

              'body'     => ['value' =>$row[6], 'format' => 'full_html'],
              // 'field_bu_type' => $row[0],
              'field_bu_type' =>  [
                'target_id' => $bu_type
              ],
              'field_bu_name_en' => $row[1],
              'field_bu_name_th' => $row[2],
              'field_store_code' => $row[3],

              'field_tel'=>$row[7],
              'field_title_eng'=>$row[5]
            ]);

            $node->save();
            $count_new_insert++;            
        }
    }
  
    // dpm($count_new_insert);

    // $batch = array(
    //   'title' => t('Importing Data...'),
    //   'operations' => $operations,
    //   'init_message' => t('Import is starting.'),
    //   'finished' => '\Drupal\IMPORT_EXAMPLE\addImportContent::addImportContentItemCallback',
    // );
    // batch_set($batch);

    drupal_set_message("Udpate %count_new_insert succesfully.", array('%count_new_insert'=>$count_new_insert),'status');
    */
  }

  public function csvtoarray($filename='', $delimiter){

    if(!file_exists($filename) || !is_readable($filename)) return FALSE;
    $header = NULL;


    $data = array();

    if (($handle = fopen($filename, 'r')) !== FALSE ) {
      while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
      {
        if(!$header){
          $header = $row;
        }else{
          $data[] = $row;//array_combine($header, $row);
        }
      }
      fclose($handle);
    }

    return $data;
  }

}