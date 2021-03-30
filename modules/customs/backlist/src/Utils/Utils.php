<?php
namespace Drupal\backlist\Utils;

use \Drupal\Core\Controller\ControllerBase;
use \Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\user\Entity\User;
use Drupal\file\Entity\File;
use Drupal\config_pages\Entity\ConfigPages;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\File\FileSystemInterface;

use Drupal\Component\Utility\SafeMarkup;
use Drupal\Core\Render\Markup;
use \Datetime;
use \DateInterval;

use Facebook\FacebookSession;
use Facebook\FacebookRequest;
use Facebook\GraphUser;
use Facebook\FacebookRedirectLoginHelper;

use Abraham\TwitterOAuth\TwitterOAuth;

use voku\helper\HtmlDomParser;
use voku\helper\SimpleHtmlDomInterface;
use voku\helper\SimpleHtmlDomNode;
use voku\helper\SimpleHtmlDomNodeInterface;

use Drupal\image\Entity\ImageStyle;

class Utils extends ControllerBase {

  public static function consent_template_api($lang){
    // dpm('point_balance');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    // $bigcard_number = $_SESSION['bigcard'];

    $lang = strtoupper($lang);

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/pdpa/getConsentTemplate?productId=BIGCARD&lang=".$lang,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Accept: application/json",
        "Content-Type: application/x-www-form-urlencoded",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['consent_message'] = '';


      if($result->code == 200){
        $value['consent_message'] = $data->consentMessage;
      }
      $value['code'] = $result->code;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function point_balance_api(){
    // dpm('point_balance');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $bigcard_number = $_SESSION['bigcard'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/pointBalance/" . $bigcard_number,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Accept: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['point_balance'] = 0;
      $value['bigcard'] = '';

      if($result->code == 200){
        // $_SESSION["bigcard"] = $data->bigcard;
        $_SESSION["point_balance"] = $data->pointBalance;
        // dpm($_SESSION);

        $value['point_balance'] = $data->pointBalance;
        $value['bigcard'] = $data->bigcard;
        // dpm('success');
      }else{
        dpm( $result->code . ' ' . $result->msg);
      }
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function point_expire_api(){
    // dpm('point_expire');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;

      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url ."/api/member/pointExpire",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['expire_date'] = '';
      $value['point_amount'] = 0;

      if($result->code == 200){
        // $_SESSION["bigcard"] = $data->bigcard;
        $_SESSION["expire_date"] = $data->expireDate;
        $_SESSION["point_amount"] = $data->pointAmount;
        // dpm($_SESSION);

        $value['expire_date'] = $data->expireDate;
        $value['point_amount'] = $data->pointAmount;
        // dpm('success');
      }else{
        dpm( $result->code . ' ' . $result->msg);
      }
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function personal_info_api(){
    // dpm('personal_info');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url ."/api/member/personalInfo",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      // dpm($data);
      $value = array();
      $value['bigcard'] = '';
      // $value['cardStatus'] = '';
      $value['id_card'] = '';
      // $value['idCardRef'] = '';
      $value['idCardType'] = '';
      // $value['isVerifyIdCard'] = '';
      // $value['verifyIdCardDate'] = '';
      $value['mobile_phone'] = '';
      // $value['isVerifyMobilePhone'] = '';
      // $value['verifyMobilePhoneDate'] = '';
      $value['email'] = '';
      $value['is_verify_email'] = '';
      $value['verify_email_date'] = '';
      // $value['isOnlineRegister'] = '';
      // $value['onlineRegisterDate'] = '';
      // $value['isEWallet'] = '';
      // $value['ewalletId'] = '';
      // $value['ewalletRegisterDate'] = '';
      $value['title'] = '';
      $value['t_name'] = '';
      $value['t_last_name'] = '';
      $value['e_name'] = '';
      $value['e_last_name'] = '';
      $value['gender'] = '';
      $value['birth_date'] = '';
      $value['nationality'] = '';
      // $value['nationalityOther'] = '';
      // $value['familySize'] = '';
      $value['contact_permission'] = '';
      $value['contact_preference'] = '';
      $value['language'] = '';
      $value['occupation'] = '';
      $value['welfare_id'] = '';
      // $value['displayWelfareId'] = ''; 

      if($result->code == 200){
        // $_SESSION["is_verify_email"] = $data->isVerifyEmail;
        // dpm($_SESSION);

        $value['bigcard'] = $data->bigcard;
        // $value['cardStatus'] = '';
        $value['id_card'] = $data->idCard;
        // $value['idCardRef'] = '';
        $value['idCardType'] = $data->idCardType;
        // $value['isVerifyIdCard'] = '';
        // $value['verifyIdCardDate'] = '';
        $value['mobile_phone'] = $data->mobilePhone;
        // $value['isVerifyMobilePhone'] = '';
        // $value['verifyMobilePhoneDate'] = '';
        $value['email'] = $data->email;
        $value['is_verify_email'] = $data->isVerifyEmail;
        $value['verify_email_date'] = $data->verifyEmailDate;
        // $value['isOnlineRegister'] = '';
        // $value['onlineRegisterDate'] = '';
        // $value['isEWallet'] = '';
        // $value['ewalletId'] = '';
        // $value['ewalletRegisterDate'] = '';
        $value['title'] = $data->title;
        $value['t_name'] = $data->tName;
        $value['t_last_name'] = $data->tLastName;
        $value['e_name'] = $data->eName;
        $value['e_last_name'] = $data->eLastName;
        $value['gender'] = $data->gender;
        $value['birth_date'] = $data->birthDate;
        $value['nationality'] = $data->nationality;
        // $value['nationalityOther'] = '';
        // $value['familySize'] = '';
        $value['contact_permission'] = $data->contactPermission;
        $value['contact_preference'] = $data->contactPreference;
        $value['language'] = $data->language;
        $value['occupation'] = $data->occupation;
        $value['welfare_id'] = $data->welfareId;
        // $value['displayWelfareId'] = ''; 
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function update_personal_info_api($data_obj){
    // dpm('update_personal_info');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url ."/api/member/personalInfo",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "PUT",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      
      if($result->code == 200){
        // dpm('update personal info success');
      }else{
        // dpm('update personal info fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function address_info_api(){
    // dpm('address_info');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/member/addressInfo",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['add_type'] = '';
      $value['address1'] = '';
      $value['address2'] = '';
      $value['moo'] = '';
      $value['room_no'] = '';
      $value['soi'] = '';
      $value['road'] = '';
      $value['sub_district'] = '';
      $value['district'] = '';
      $value['province'] = '';
      $value['postal_code'] = '';
      $value['country'] = '';
      $value['home_phone'] = '';
      $value['home_phone_ext'] = '';
      $value['foreign_city'] = '';
      $value['foreign_province'] = '';
      $value['foreign_postal_code'] = '';

      if($result->code == 200){
        // $_SESSION["bigcard"] = $data->bigcard;
        // dpm($_SESSION);

        $value['add_type'] = $data->addType;
        $value['address1'] = $data->address1;
        $value['address2'] = $data->address2;
        $value['moo'] = $data->moo;
        $value['room_no'] = $data->roomNo;
        $value['soi'] = $data->soi;
        $value['road'] = $data->road;
        $value['sub_district'] = $data->subDistrict;
        $value['district'] = $data->district;
        $value['province'] = $data->province;
        $value['postal_code'] = $data->postalCode;
        $value['country'] = $data->country;
        $value['home_phone'] = $data->homePhone;
        $value['home_phone_ext'] = $data->homePhoneExt;
        $value['foreign_city'] = $data->foreignCity;
        $value['foreign_province'] = $data->foreignProvince;
        $value['foreign_postal_code'] = $data->foreignPostalCode;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function update_address_info_api($data_obj){
    // dpm('update_address_info');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/member/addressInfo",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "PUT",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      
      if($result->code == 200){
        // dpm('update address info success');
      }else{
        // dpm('update address info fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function update_email_api($data_obj){
    // dpm('update_email');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/member/updateEmail",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "PUT",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      
      if($result->code == 200){
        // dpm('update email success');
      }else{
        // dpm('update email fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function update_password_api($data_obj){
    // dpm('update_password');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/member/password",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "PUT",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      // $data = $body_content->data;

      $value = array();
      
      if($result->code == 200){
        // dpm('update password success');
      }else{
        // dpm('update password fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function check_exists_id_card_api($id_card){
    // dpm('check_exists_id_card');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/checkExistsIDCard?idCard=" . $id_card,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Content-Type: application/json",
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['is_exists'] = '';
      $value['is_online_register'] = '';

      if($result->code == 200){

        $value['is_exists'] = $data->isExists;
        $value['is_online_register'] = $data->isOnlineRegister;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function find_member_api($id_card){
    // dpm('find_member');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/findMember?idCard=" . $id_card,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Content-Type: application/json",
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['mobile_phone'] = '';
      $value['nationality'] = ''; 
      $value['bigcard'] = '';
      $value['cardClass'] = '';
      $value['id_card_type'] = '';

      $value['code'] = '';
      $value['msg'] = '';

      if($result->code == 200){
        $value['mobile_phone'] = $data->mobilePhone;
        $value['nationality'] = $data->nationality;
        $value['cardClass'] = $data->cardClass;
        $value['bigcard'] = $data->bigcard;
        $value['id_card_type'] = $data->idCardType;

        // ใช้เฉพาะ register step2 > exitingNormal
        $value['datas'] = (array)$data;

        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;

      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function send_otp_api($phone_number, $otp_number, $otp_ref){
    // dpm('send_otp');
    $phone_number = Utils::getFullMobilePhone($phone_number);
    \Drupal::logger('bg')->notice('send_otp_api ' . $phone_number);

    // for test only jiebjieb
    // $phone_number = '66954861000';
    // $phone_number = '66988264820';
    // --------------

    // $phone_number = '66' . substr($phone_number, 1, 9);
    $dial_code = substr($phone_number, 0, 2);

    // จะรู้ได้ไงว่าใช้อันไหน
    $password = ($dial_code == '66') ? 'H5ywPz12' : 'FH3mzpao';
    // $password = 'H5ywPz12'; // Thailand(192)
    // $password = 'FH3mzpao'; // all countries(190)

    $transaction_id = DATE('YmdHis') . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
    $project_id = ($dial_code == '66') ? '192' : '190';
    // $project_id = '192'; // Thailand(192) / all countries(190) // จะรู้ได้ไงว่าใช้อันไหน
    $sender = 'BigCard'; // sender name
    $phone_number = $phone_number; // phone number(66xx-xxx-xxxx)
    $message = 'Your OTP is ' . $otp_number . ' (Ref code ' . $otp_ref . '). This password will be expired within 5 minutes.'; // text SMS

    $encode_message = urlencode($message);
    $session = MD5('transaction_id=' . $transaction_id . '&project_id=' . $project_id . '&sender=' . $sender . '&msisdn=' . $phone_number . '&msg=' . $encode_message . '&pwd=' . $password);

    $data_obj = [
      "transaction_id" => $transaction_id,
      "project_id" => $project_id, 
      "sender" => $sender, 
      "msisdn" => $phone_number, 
      "msg" => $message,
      "session" => $session
    ];

    $global     = ConfigPages::config('global');
    $smsapi_url = '';
    if(isset( $global )){
      $smsapi_url   =  $global->get('field_smsapi_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      // CURLOPT_URL => "https://ppro-smsapi.eggdigital.com/sms-api/sms_single", // test(not working !!!)
      CURLOPT_URL => $smsapi_url, // production(work!!!)
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content;

      $value = array();
      $value['code'] = '';
      $value['status'] = '';
      $value['transaction_id'] = '';

      if($result->code == 200){
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->status);
      }
      $value['code'] = $result->code;
      $value['status'] = $result->status;
      $value['transaction_id'] = $result->transaction_id;

      \Drupal::logger('bg')->notice('send_otp_api ' . $value['code']);

      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function sms_new_member_api($phone_number, $bigcard_number, $language){
    // dpm('send_sms_new_member');

    $phone_number = Utils::getFullMobilePhone($phone_number);
    \Drupal::logger('bg')->notice('sms_new_member_api ' . $phone_number);

    // for test only jiebjieb
    // $phone_number = '66954861000';
    // --------------

    // $phone_number = '66' . substr($phone_number, 1, 9);
    $dial_code = substr($phone_number, 0, 2);

    // จะรู้ได้ไงว่าใช้อันไหน
    $password = ($dial_code == '66') ? 'H5ywPz12' : 'FH3mzpao';
    // $password = 'H5ywPz12'; // Thailand(192)
    // $password = 'FH3mzpao'; // all countries(190)

    $transaction_id = DATE('YmdHis') . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
    $project_id = ($dial_code == '66') ? '192' : '190';
    // $project_id = '192'; // Thailand(192) / all countries(190) // จะรู้ได้ไงว่าใช้อันไหน
    $sender = 'BigCard'; // sender name
    $phone_number = $phone_number; // phone number(66xx-xxx-xxxx)
    if($language == 'TH'){
      $message = 'ยินดีต้อนรับสู่การเป็นสมาชิกบิ๊กการ์ด รับสิทธิ์สะสมคะแนนได้ทันทีแจ้งเลขสมาชิก ' . $bigcard_number . ' หรือแจ้งเบอร์มือถือในวันถัดไป'; // text SMS
    }else{
      $message = 'Welcome to Big C family! Please inform the cashier your Big Card no. ' . $bigcard_number . ' at the time of purchase or mobile phone no. from tomorrow onwards'; // text SMS
    }

    $encode_message = urlencode($message);
    $session = MD5('transaction_id=' . $transaction_id . '&project_id=' . $project_id . '&sender=' . $sender . '&msisdn=' . $phone_number . '&msg=' . $encode_message . '&pwd=' . $password);

    $data_obj = [
      "transaction_id" => $transaction_id,
      "project_id" => $project_id, 
      "sender" => $sender, 
      "msisdn" => $phone_number, 
      "msg" => $message,
      "session" => $session
    ];

    $global     = ConfigPages::config('global');
    $smsapi_url = '';
    if(isset( $global )){
      $smsapi_url   =  $global->get('field_smsapi_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      // CURLOPT_URL => "https://ppro-smsapi.eggdigital.com/sms-api/sms_single", // test(not working !!!)
      CURLOPT_URL => $smsapi_url, // production(work!!!)
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content;

      $value = array();
      $value['code'] = '';
      $value['status'] = '';
      $value['transaction_id'] = '';

      if($result->code == '000'){
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->status);
      }
      $value['code'] = $result->code;
      $value['status'] = $result->status;
      $value['transaction_id'] = $result->transaction_id;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function sms_welcome_pack_api($phone_number){
    // dpm('send_sms_welcome_pack');

    $phone_number = Utils::getFullMobilePhone($phone_number);
    \Drupal::logger('bg')->notice('sms_welcome_pack_api ' . $phone_number);

    // for test only jiebjieb
    // $phone_number = '66954861000';
    // --------------

    // $phone_number = '66' . substr($phone_number, 1, 9);
    $dial_code = substr($phone_number, 0, 2);

    // จะรู้ได้ไงว่าใช้อันไหน
    $password = ($dial_code == '66') ? 'H5ywPz12' : 'FH3mzpao';
    // $password = 'H5ywPz12'; // Thailand(192)
    // $password = 'FH3mzpao'; // all countries(190)

    $transaction_id = DATE('YmdHis') . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
    $project_id = ($dial_code == '66') ? '192' : '190';
    // $project_id = '192'; // Thailand(192) / all countries(190) // จะรู้ได้ไงว่าใช้อันไหน
    $sender = 'BigCard'; // sender name
    $phone_number = $phone_number; // phone number(66xx-xxx-xxxx)
    $message = 'รับคูปองต้อนรับสมาชิกใหม่ ภายใน 15 นาที'; // text SMS

    $encode_message = urlencode($message);
    $session = MD5('transaction_id=' . $transaction_id . '&project_id=' . $project_id . '&sender=' . $sender . '&msisdn=' . $phone_number . '&msg=' . $encode_message . '&pwd=' . $password);

    $data_obj = [
      "transaction_id" => $transaction_id,
      "project_id" => $project_id, 
      "sender" => $sender, 
      "msisdn" => $phone_number, 
      "msg" => $message,
      "session" => $session
    ];

    $global     = ConfigPages::config('global');
    $smsapi_url = '';
    if(isset( $global )){
      $smsapi_url   =  $global->get('field_smsapi_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      // CURLOPT_URL => "https://ppro-smsapi.eggdigital.com/sms-api/sms_single", // test(not working !!!)
      CURLOPT_URL => $smsapi_url, // production(work!!!)
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content;

      $value = array();
      $value['code'] = '';
      $value['status'] = '';
      $value['transaction_id'] = '';

      if($result->code == '000'){
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->status);
      }
      $value['code'] = $result->code;
      $value['status'] = $result->status;
      $value['transaction_id'] = $result->transaction_id;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function sms_update_data_api($phone_number, $bigcard, $language){
    // dpm('send_sms_update_data');

    $phone_number = Utils::getFullMobilePhone($phone_number);
    \Drupal::logger('bg')->notice('sms_update_data_api ' . $phone_number);

    // for test only jiebjieb
    // $phone_number = '66954861000';
    // --------------

    // $phone_number = '66' . substr($phone_number, 1, 9);
    $dial_code = substr($phone_number, 0, 2);

    // จะรู้ได้ไงว่าใช้อันไหน
    $password = ($dial_code == '66') ? 'H5ywPz12' : 'FH3mzpao';
    // $password = 'H5ywPz12'; // Thailand(192)
    // $password = 'FH3mzpao'; // all countries(190)

    $transaction_id = DATE('YmdHis') . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
    $project_id = ($dial_code == '66') ? '192' : '190';
    // $project_id = '192'; // Thailand(192) / all countries(190) // จะรู้ได้ไงว่าใช้อันไหน
    $sender = 'BigCard'; // sender name
    $phone_number = $phone_number; // phone number(66xx-xxx-xxxx)
    if($language == 'TH'){
      $message = 'ข้อมูลสมาชิก ' . $bigcard . ' ได้ปรับปรุงแล้ว มีผลที่บิ๊กซีในวันถัดไป'; // text SMS
    }else{
      $message = 'Your personal information ' . $bigcard . ' has already been updated, effective at all Big C stores from tomorrow onwards'; // text SMS
    }

    $encode_message = urlencode($message);
    $session = MD5('transaction_id=' . $transaction_id . '&project_id=' . $project_id . '&sender=' . $sender . '&msisdn=' . $phone_number . '&msg=' . $encode_message . '&pwd=' . $password);

    $data_obj = [
      "transaction_id" => $transaction_id,
      "project_id" => $project_id, 
      "sender" => $sender, 
      "msisdn" => $phone_number, 
      "msg" => $message,
      "session" => $session
    ];

    $global     = ConfigPages::config('global');
    $smsapi_url = '';
    if(isset( $global )){
      $smsapi_url   =  $global->get('field_smsapi_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      // CURLOPT_URL => "https://ppro-smsapi.eggdigital.com/sms-api/sms_single", // test(not working !!!)
      CURLOPT_URL => $smsapi_url, // production(work!!!)
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content;

      $value = array();
      $value['code'] = '';
      $value['status'] = '';
      $value['transaction_id'] = '';

      if($result->code == '000'){
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->status);
      }
      $value['code'] = $result->code;
      $value['status'] = $result->status;
      $value['transaction_id'] = $result->transaction_id;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function validate_store_api($store_code){
    // dpm('validate_store');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;

      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/validateStore?storeCode=" . $store_code,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['store_code'] = '';
      $value['is_valid'] = '';

      if($result->code == 200){
        $value['store_code'] = $data->storeCode;
        $value['is_valid'] = $data->isValid;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function check_exists_welfare_id_api($welfare_id){
    // dpm('check_exists_welfare_id');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/checkExistsWelfareId?welfareId=" . $welfare_id,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['is_exists'] = '';

      if($result->code == 200){
        $value['is_exists'] = $data->isExists;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }  

  public static function check_card_api($id_card, $first_name, $last_name, $birth_date, $laser){
    // dpm('check_card_api');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;

      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL =>  $url . '/api/loyalty/dopa/checkCard?idCard=' . $id_card . '&firstName=' . urlencode($first_name) . '&lastName=' . urlencode($last_name) . '&birthDate=' . $birth_date . '&laser=' . $laser,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        // "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['return_code'] = '';
      $value['return_desc'] = '';

      if($result->code == 200){
        $value['return_code'] = $data->returnCode;
        $value['return_desc'] = $data->returnDesc;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function register_api($data_obj){
    // dpm('register_api');
    // dpm($data_obj);
    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;

      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL =>  $url . "/api/loyalty/register",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      //CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    \Drupal::logger('Bigcard')->notice('apiregis'.$httpcode);
    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['code'] = '';
      $value['msg'] = '';
      $value['bigcard'] = '';
      \Drupal::logger('Bigcard')->notice('resule_code'.$result->code);
      if($result->code == 200){
        // dpm('success');
        $value['bigcard'] = $data->bigcard;
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function my_coupon_api(){
    $global = ConfigPages::config('global');
    $token  = 0;

    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $page_size = 1000;
    $page_no = 1;

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/member/coupon/me?pageSize=" . $page_size . "&pageNo=" . $page_no,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      // dpm( $data );

      $value = array();
      $value['data'] = array();

      if($result->code == 200){
        // set flag every item , is_ocp = false
        $data = json_decode(json_encode($data), true);
        foreach ($data as &$val) $val['is_ocp'] = false;

        $value['data'] = $data;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }

      $result_ocp = Utils::ocp_my_coupon_api();

      // dpm( $value['data'] );
      // dpm( $result_ocp );

      if($result_ocp['code'] == 200){
        $value['data'] += $result_ocp['data'];
      }

      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  private static function ocp_my_coupon_api(){

    // https://bgcdlpsapi.bigc.co.th/api/ocp/myCoupons?pageSize=1000&pageNo=1
    $global = ConfigPages::config('global');
    $token  = 0;

    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $page_size = 1000;
    $page_no = 1;

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/ocp/myCoupons?pageSize=" . $page_size . "&pageNo=" . $page_no,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['data'] = array();

      if($result->code == 200){
        $data = json_decode(json_encode($data), true);
        foreach ($data as &$val) $val['is_ocp'] = true;

        $value['data'] = $data;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  private static function ocp_use_coupon_api($data_obj){

    // https://bgcdlpsapi.bigc.co.th/api/ocp/myCoupons?pageSize=1000&pageNo=1
    $global = ConfigPages::config('global');
    $token  = 0;

    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/ocp/useCoupon",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['data'] = array();

      if($result->code == 200){
        $value['data'] = $data;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function get_coupon_detail_api($is_ocp, $coupon_id){
    $global = ConfigPages::config('global');
    $token  = 0;

    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    
    if($is_ocp){
      $url .= "/api/ocp/myCoupons/" . $coupon_id;
    }else{
      $url .= "/api/member/coupon/" . $coupon_id;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL =>  $url ,
      // CURLOPT_URL =>  $url . "/api/ocp/myCoupons/" . $coupon_id,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
    //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    // dpm( $url );
    // dpm( $token );
    // dpm( $auth_token );

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // dpm( $is_ocp );
    // dpm( $coupon_id );
    // dpm( $httpcode );

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['data'] = '';

      if($result->code == 200){
        $value['data'] = json_decode(json_encode($data), true);
        // $value['data'] = $data;
        // dpm('success');
      }else{
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }


  public static function use_coupon_api($coupon_id){
    $global = ConfigPages::config('global');
    $token  = 0;

    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $auth_token = $_SESSION['auth_token'];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL =>  $url . "/api/member/coupon/" . $coupon_id . "/use",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
    //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "X-Auth-Token:" . $auth_token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['code'] = '';
      $value['msg'] = '';
      $value['data_code'] = '';
      $value['data_msg'] = '';

      if($result->code == 200){
        // dpm('use coupon success');
        $value['data_code'] = $data->code;
        $value['data_msg'] = $data->msg;
      }else{
        // dpm('use coupon fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function reset_member_password_api($data_obj){
    // dpm('reset_member_password');

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/resetMemberPassword",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      // $data = $body_content->data;

      $value = array();
      
      if($result->code == 200){
        // dpm('update password success');
      }else{
        // dpm('update password fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  // https://bgcdlpsapi.bigc.co.th/api/loyalty/getCouponProfile?ruleId=TI20051330551

  /*
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://bgcdlpsapi.bigc.co.th/api/loyalty/getCouponProfile?ruleId=TI20051330551",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
      "Accept: application/json",
      "Content-Type: application/json",
      "Authorization: Basic YmlnY2FyZDp0aGlzaXNzZWNyZXQ=",
      "X-API-User: bigcard",
      "Cookie: COOKIENAME=bgcdlpsapi-ap01"
    ),
  ));
  $response = curl_exec($curl);
  curl_close($curl);
  echo $response;
  */
  public static function get_coupon_profile($ruleId){

    $global = ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    // ?pageSize=" . $page_size . "&pageNo=" . $page_no,
    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/getCouponProfile?ruleId=" . $ruleId ,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "GET",
      // CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "Accept: application/json",
        "Content-Type: application/json",
        "X-API-User: bigcard",
        "Cookie: COOKIENAME=bgcdlpsapi-ap01"
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      
      $couponImage;
      if($result->code == 200){
        // dpm( $data[0] );
        // dpm( ($data[0])->couponCode );
        $couponImage = Utils::base64ToImage( 'data:image/'. ($data[0])->couponImageType .';base64, ' . ($data[0])->couponImage,  ($data[0])->couponCode.'.'.($data[0])->couponImageType );
      }else{
        // dpm('update password fail');
        // dpm( $result->code . ' ' . $result->msg);
      }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      $value['coupon_image'] = $couponImage;
      return $value;
    }
    // end session
    curl_close($ch);
  }


  // -----------------------------------------------------
  public static function mapping_date($date, $lang){
    $month_th_arr = array(null,'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.');
    $month_en_arr = array(null,'Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.');
    
    if($lang == 'th'){
      $month_arr = $month_th_arr;
    }else if($lang == 'en'){
      $month_arr = $month_en_arr;
    }
    $date_arr = explode('-', $date);
    $year = empty($date_arr[0]) ? ' ' : $date_arr[0] + 543;
    $month = $month_arr[(int)$date_arr[1]];
    $date = $date_arr[2];

    return $date . ' ' . $month . ' ' . $year;
  }

  public static function mapping_full_date($date, $lang){
    $month_th_arr = array(null,'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม');
    $month_en_arr = array(null,'January','Febuary','March','April','May','June','July','August','September','October','November','December');
    
    if($lang == 'th'){
      $month_arr = $month_th_arr;
    }else if($lang == 'en'){
      $month_arr = $month_en_arr;
    }
    $date_arr = explode('-', $date);
    $year = empty($date_arr[0]) ? ' ' : $date_arr[0] + 543;
    $month = $month_arr[(int)$date_arr[1]];
    $date = $date_arr[2];

    return $date . ' ' . $month . ' ' . $year;
  }

  public static function formatted_bigcard_number($bigcard_number){
    if(empty($bigcard_number)) return '';
    $bigcard_number = substr($bigcard_number, 0, 4) . '-' . substr($bigcard_number, 4, 4) . '-' . substr($bigcard_number, 8, 4) . '-' . substr($bigcard_number, 12, 4);
    return $bigcard_number;
  }

  public static function get_news_channel_arr($number){
    $news_channel_array = array();
    switch ($number) {
      case 0:
        $news_channel_array = array();
        break;
      case 1:
        $news_channel_array = array(
          '1' => '1'
        );
        break;
      case 2:
        $news_channel_array = array(
          '2' => '2'
        );
        break;
      case 3:
        $news_channel_array = array(
          '1' => '1',
          '2' => '2'
        );
        break;
      case 4:
        $news_channel_array = array(
          '4' => '4'
        );
        break;
      case 5:
        $news_channel_array = array(
          '1' => '1',
          '4' => '4'
        );
        break;
      case 6:
        $news_channel_array = array(
          '2' => '2',
          '4' => '4'
        );
        break;
      case 7:
        $news_channel_array = array(
          '1' => '1',
          '2' => '2',
          '4' => '4'
        );
        break;
    }
    return $news_channel_array;
  }

  public static function get_news_channel_number($arr){
    $news_channel_number = 0;
    foreach($arr as $value){
      $news_channel_number += $value;
    }
    return $news_channel_number;
  }

  public static function getTextRight(){
    return '<div class="rules">
              <div class="head-title"><img alt="logo-bigcard" src="/sites/default/modules/customs/bigcard/images/bigcard-account-new.png">
                <div class="block-title">
                  <div class="main-title">
                    <h2>สิทธิพิเศษ</h2>
                  <h1><strong>Big </strong> Card</h1>
                  <div class="line-bottom">&nbsp;</div>
                  </div>
                </div>
              </div>
              <div class="rules-list">
                <ul>
                <li>1 บาท = 1 คะแนน ยิ่งสะสมมากยิ่งได้มาก... ระยะเวลาสะสมคะแนนตั้งแต่ 1 ก.ค. 62 – 30 มิ.ย. 63 สะสมได้ทุกบาท...ตั้งแต่บาทแรก</li>
                <li>ใช้คะแนนแทนเงินสด แลกรับส่วนลดทันที เมื่อซื้อสินค้าที่บิ๊กซีทุกสาขา และร้านยาเพรียว</li>
                <li>ใช้คะแนนแลกรับสินค้าพรีเมี่ยม</li>
                <li>ใช้คะแนนแลกรับส่วนลด/สิทธิพิเศษจากร้านค้าชั้นนำมากมาย</li>
                <li>สมัครสมาชิกใหม่รับฟรีทันที คูปองส่วนลดซื้อสินค้าที่บิ๊กซีและร้านค้าต่างๆมูลค่ากว่า 500 บาท</li>
                <li>นอกเหนือจากนี้ สมาชิกบิ๊กการ์ดยังจะได้รับคูปองส่วนลดตามวาระต่างๆ ซึ่งบิ๊กซีจะประกาศให้ทราบเป็นครั้งๆ ไป รวมถึงได้รับสิทธิพิเศษเฉพาะบุคคล ซึ่งบิ๊กซีจะมอบให้ตามพฤติกรรมการจับจ่ายของลูกค้าแต่ละท่าน</li>
                </ul>
              </div>';
  } 

  public static function getFullMobilePhone($tel){
    $full_tel = '';
    if(substr($tel, 0, 1) == '0'){
      // first char is 0
      $full_tel = '66' . substr($tel, 1, 20);
    }else{
      $full_tel = $tel;
    }
    return $full_tel;
  }

  public static function getDisplayMobilePhone($tel){
    $full_tel = '';
    if(substr($tel, 0, 2) == '66'){
      // tel start with 66
      $full_tel = '0' . substr($tel, 2, 20);
    }else{
      $full_tel = $tel;
    }
    return $full_tel;
  }
  
  // เลขที่คำร้อง
  public static function proNo(){    
      $today = new \Drupal\Core\Datetime\DrupalDateTime();
      $start_of_day = strtotime($today->format('Y-m-d 00:00:00'));
      $end_of_day = strtotime($today->format('Y-m-d 23:59:59'));
  
      $nids = \Drupal::entityQuery('node')
              ->condition('type','media_service_approval')
              ->condition('created', $start_of_day, '>=')
              ->condition('created', $end_of_day, '<=')
              ->execute();
  
      // กรณี > 999 จะเอาจำนวน ต่อ mdY เลย 
      if(count($nids) > 999){
        return count($nids) . date('dmY', time());
      }
  
      // return str_pad(count($nids) + 1, 3, "0", STR_PAD_LEFT) . date('dmY', time());
      return date('ymd', time()) . str_pad(count($nids) + 1, 3, "0", STR_PAD_LEFT) ;
  }

  public static function quoNo(){    
    $today = new \Drupal\Core\Datetime\DrupalDateTime();
    $start_of_day = strtotime($today->format('Y-m-01 00:00:00'));
    $end_of_day = strtotime($today->format('Y-m-t 23:59:59'));

    $nids = \Drupal::entityQuery('node')
            ->condition('type','quotation')
            ->condition('status',\Drupal\node\NodeInterface::PUBLISHED)
            ->condition('created', $start_of_day, '>=')
            ->condition('created', $end_of_day, '<=')
            ->execute();

    // กรณี > 999 จะเอาจำนวน ต่อ mdY เลย 
    if(count($nids) > 999){
      return count($nids) . date('dmY', time());
    }

    // return str_pad(count($nids) + 1, 3, "0", STR_PAD_LEFT) . date('dmY', time());
    return date('ymd', time()) . str_pad(count($nids) + 1, 3, "0", STR_PAD_LEFT) ;
  }

  public static function getTaxonomy_term($cid, $clear = FALSE){
    $type = 'taxonomy_term';

    $branchs_terms = \Drupal::EntityTypeManager()->getStorage($type)->loadTree($cid);
    $branchs = array();
    foreach ($branchs_terms as $tag_term) {
      $branchs[$tag_term->tid] = $tag_term->name;
    }   

    return $branchs;


    /*
    $our_service = \Drupal::service('bigcard.cache');
    $cache = $our_service->getCache($type, $cid);

    \Drupal::logger('getTaxonomy_term')->notice('cid: @cid, cache: @cache', array('@cid'=> $cid, '@cache'=> empty($cache) ? "empty" : "not empty" ));
    if($cache  === NULL || $clear) {
      $branchs_terms = \Drupal::entityManager()->getStorage($type)->loadTree($cid);
      $branchs = array();

      // จะมีกรณีที่ tid เกิดไม่ต้องกันในเครือง dev, uat, production เราจึงกำหนด id ให่แต่ละ term เราจึงต้องดึงจาก field_id_term เราต้อง check เพราะว่าเราค่อยแก้ๆ
      // $terms = array('prefix_name', 'sex', 'dates', 'month', 'year');
      $terms = array('prefix_name', 'sex', 'dates', 'year', 'language', 'news', 'news_channel');

      // $terms = ConfigPages::config('vocabulary')->get('field_vocabulary')->value;
      // $terms = explode(",", $terms);

      if (in_array( $cid , $terms)) {
        // dpm('111');
        foreach($branchs_terms as $tag_term) {
          $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();
          if(!empty( $ref_id )){
            $ref_id =  $ref_id[0]['value'];
            $branchs[$ref_id] = $tag_term->name;
          }
        }
      }else{
        $branchs = array();
        $special_terms = array('provinces', 'district', 'subdistrict', 'postal_code', 'countries', 'provinces_cambodia', 'districts_cambodia', 'subdistricts_cambodia', 'postalcode_cambodia', 'month', 'occupation');
        if (in_array( $cid , $special_terms)) {
          // special case 
          switch($cid){
            // จังหวัด
            case 'provinces':{
              foreach($branchs_terms as $tag_term) {

                $title_en= \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_title_en')->getValue()[0]['value'];


                $provinces_3_code = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_3_code')->getValue();

                if(!empty( $provinces_3_code )){
                  $branchs[$provinces_3_code[0]['value']] = $title_en;
                }
              }

            break;
            }

            // district
            // อำเภอ
            case 'district':{
              // field_provinces_3_code
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();

                if(!empty( $ref_id )){

                  $title_en= \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_title_en')->getValue()[0]['value'];

                  $code = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_3_code')->getValue();
                  $branchs[$ref_id[0]['value']] = array('name'=>$title_en, 'code'=>$code[0]['value']);
                }
              }
            break;
            }

            // ตำบล
            case 'subdistrict':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();

                if(!empty( $ref_id )){

                  $title_en= \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_title_en')->getValue()[0]['value'];

                  $code = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_3_code')->getValue();

                  $ref_pc = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_2_code')->getValue();
                  $branchs[$ref_id[0]['value']] = array('name'=> $title_en, 'code4'=>$code[0]['value'], 'ref_pc'=>$ref_pc[0]['value']);
                }
              }
            break;
            }

            // รหัสโปรษณี
            case 'postal_code':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();
                $branchs[$tag_term->name] = $ref_id[0]['value'];
              }
            break;
            }

            // ประเทศ
            case 'countries':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();
                if(!empty( $ref_id )){
                  $ref_id =  $ref_id[0]['value'];
                  $branchs[$ref_id] = $tag_term->name;
                }
              }
            break;
            }

            // จังหวัด Cambodia
            case 'provinces_cambodia':{
              foreach($branchs_terms as $tag_term) {
                $provinces_3_code = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_3_code')->getValue();

                if(!empty( $provinces_3_code )){
                  $branchs[$provinces_3_code[0]['value']] = $tag_term->name;
                }
              }
            break;
            }
 
            // อำเภอ Cambodia
            case 'districts_cambodia':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();

                if(!empty( $ref_id )){
                  $code = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_3_code')->getValue();
                  $branchs[$ref_id[0]['value']] = array('name'=>$tag_term->name, 'code'=>$code[0]['value']);
                }
              }
            break;
            }

            // ตำบล Cambodia
            case 'subdistricts_cambodia':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();

                if(!empty( $ref_id )){
                  $code = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_3_code')->getValue();

                  $ref_pc = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_provinces_2_code')->getValue();
                  $branchs[$ref_id[0]['value']] = array('name'=>$tag_term->name, 'code4'=>$code[0]['value'], 'ref_pc'=>$ref_pc[0]['value']);
                }
              }
            break;
            }

            // รหัสไปรษณีย์ Cambodia
            case 'postalcode_cambodia':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();
                $branchs[$tag_term->name] = $ref_id[0]['value'];
              }
            break;
            }

            // เดือน
            case 'month':{
              foreach($branchs_terms as $tag_term) {
                $ref_id = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tag_term->tid)->get('field_ref_id')->getValue();
                if(!empty( $ref_id )){
                  $ref_id =  $ref_id[0]['value'];
                  $branchs[$ref_id] = $ref_id;
                }
              }
            break;
            }

            case 'occupation':{
              foreach ($branchs_terms as $tag_term) {
                $branchs[$tag_term->name] = $tag_term->name;
              }   
            break;
            }
          }

          $our_service->setCache($type, $branchs, $cid);
          return $branchs;
        }else{

          foreach ($branchs_terms as $tag_term) {
            $branchs[$tag_term->tid] = $tag_term->name;
          }   

          // dpm($branchs);

        }   
      }

      $our_service->setCache($type, $branchs, $cid);
      return $branchs;
    }else{
      return $cache;
    }   
    */
  }

  public static function is_localhost() {
		// set the array for testing the local environment
    $whitelist = array( '127.0.0.1', '::1' , 'localhost');
    
		// check if the server is in the array
		if ( in_array( $_SERVER['REMOTE_ADDR'], $whitelist ) || in_array($_SERVER['SERVER_NAME'], $whitelist) ) {
			// this is a local environment
			return true;
    }
    return false;
	}

  // https://gist.github.com/slivorezka/925dff0369e8eddc7e4ffa4801ab0240
  public static function ImageStyle_BN($fid, $image_style = 'thumbnail'){
    try {
      // Load file.
      $file = \Drupal::entityTypeManager()->getStorage('file')->load($fid);;// File::load($fid);
      // Get origin image URI.
      $image_uri = $file->getFileUri();
      return ImageStyle::load($image_style)->buildUrl($image_uri);
    } catch (\Throwable $e) {
      
      \Drupal::logger('ImageStyle_BN')->notice('%e, %fid', array('%e'=>$e->__toString(), '%fid'=> serialize($fid)  ) );
    }
  }

  public static function get_file_url($target_id){   
    $file = \Drupal::entityTypeManager()->getStorage('file')->load($target_id);
    $url = file_create_url($file->getFileUri());
    return preg_replace("/^http:/i", "http:",  $url );
  }

  public static function get_file_uri($target_id){   
    $file = \Drupal::entityTypeManager()->getStorage('file')->load($target_id);
    return $file->getFileUri();
  }

  /**
   * Suppose, you are browsing in your localhost 
   * http://localhost/myproject/index.php?id=8
   */
  public static function get_base_url() {
    // output: /myproject/index.php
    $currentPath = $_SERVER['PHP_SELF']; 

    // output: Array ( [dirname] => /myproject [basename] => index.php [extension] => php [filename] => index ) 
    $pathInfo = pathinfo($currentPath); 

    // output: localhost
    $hostName = $_SERVER['SERVER_NAME'];//$_SERVER['HTTP_HOST']; 

    // output: http://
    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,5))=='https'?'https':'http';

    // return: http://localhost/myproject/
    return $protocol.'://'.$hostName.$pathInfo['dirname'];
  }

  /*
  **/
  public static function user_role(){
    $account = \Drupal::currentUser();
    $roles = $account->getRoles();

    return $roles;
  }

  public static function base64ToImage($image_data, $filename=NULL){

    list($type, $data) = explode(';', $image_data); // exploding data for later checking and validating 

    if(!is_null($filename)){
      $path = 'public://captcha/'. $filename .'.' . $type;
      if(file_exists($path)){
        return file_create_url($path);
      }
    }

    if (preg_match('/^data:image\/(\w+);base64,/', $image_data, $type)) {
        $data = substr($data, strpos($data, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif

        if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
            throw new \Exception('invalid image type');
        }

        $data = base64_decode($data);

        if ($data === false) {
            throw new \Exception('base64_decode failed');
        }
    } else {
        throw new \Exception('did not match data URI with image data');
    }

    if(is_null($filename)){
      $filename = time().'.'.$type;
    }

    // $captcha = file_prepare_directory('public://captcha2/');

    $path = 'public://captcha/';
    if(file_prepare_directory($path, FILE_CREATE_DIRECTORY)){

      $file = file_save_data($data, $path . $filename, FileSystemInterface::EXISTS_REPLACE);

      if($file){          
        $result = $file->url();
      }else{
        $result =  "error";
      }
    }

    /* it will return image name if image is saved successfully 
    or it will return error on failing to save image. */
    return $result; 
  }

  public static function change_card_api($type,$bigcard){
    // dpm('find_member');

    $global = \Drupal\config_pages\Entity\ConfigPages::config('global');
    $token  = 0;
    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $data_obj = [
      "bigcard"  => $bigcard,
      "cardType" => strtoupper($type),    
    ];

    if($type == 'jun')
    {
      $type = 'junior';
    }

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url . "/api/loyalty/changeCard",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
      "Authorization:" . $token,
        "Content-Type: application/json",
        "Accept: application/json",
        "X-Api-User: ".$type, 
      ),
    ));
    
    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      //$data = $body_content->data;

      $value = array();
      $value['msg'] = '';
      $value['code'] = '';

      dpm($result->code);
     
      if($result->code == 200){
        $value['code'] = $result->code;
        $value['msg'] = $result->msg;

        // dpm('success');
      }else{
        $value['code'] = $result->code;
        $value['msg'] = $result->msg;
        // dpm( $result->code . ' ' . $result->msg);
      }
      return $value;
    }
    // end session
    curl_close($ch);
  }

  public static function update_consent_api($id_card,$consent_status){
    $global = ConfigPages::config('global');
    $token  = 0;

    $url    = '';
    if(isset( $global )){
      $token =  $global->get('field_token')->value;
      $url   =  $global->get('field_loyalty_plus_url')->value;
    }

    $data_obj = [
      'productId' => 'BIGCARD',
      'customerId' => $id_card,
      'consentStatus' => $consent_status,
    ];

    $ch = curl_init();
    curl_setopt_array($ch, array(
      CURLOPT_URL =>  $url . "/api/pdpa/updateConsent",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER => true,
    //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($data_obj),
      CURLOPT_HTTPHEADER => array(
        "Authorization:" . $token,
        "Accept: application/json",
        "Content-Type: application/json",
      ),
    ));

    $response = curl_exec($ch);
    //dpm($response);

    // get httpcode 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // get httpcode 
    if($httpcode == 200){ // if response ok
      // separate header and body
      $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);
      
      // convert json to array or object
      $body_content = json_decode($body);
      // dpm($body_content);
      $result = $body_content->result;
      $data = $body_content->data;

      $value = array();
      $value['code'] = '';
      $value['msg'] = '';

      // if($result->code == 200){
      //   // dpm('use coupon success');
      //   $value['data_code'] = $data->code;
      //   $value['data_msg'] = $data->msg;
      // }else{
      //   // dpm('use coupon fail');
      //   // dpm( $result->code . ' ' . $result->msg);
      // }
      $value['code'] = $result->code;
      $value['msg'] = $result->msg;
      return $value;
    }
    // end session
    curl_close($ch);
  }

  // public function getBarcode($code, $type, $widthFactor = 2, $totalHeight = 30, $color = array(0, 0, 0))
  // {
  //     $barcodeData = $this->getBarcodeData($code, $type);

  //     // calculate image size
  //     $width = ($barcodeData['maxWidth'] * $widthFactor);
  //     $height = $totalHeight;

  //     if (function_exists('imagecreate')) {
  //         // GD library
  //         $imagick = false;
  //         $png = imagecreate($width, $height + 20); // +20 (+)
  //         $colorBackground = imagecolorallocate($png, 255, 255, 255);
  //         imagecolortransparent($png, $colorBackground);
  //         $colorForeground = imagecolorallocate($png, $color[0], $color[1], $color[2]);
  //     } elseif (extension_loaded('imagick')) {
  //         $imagick = true;
  //         $colorForeground = new \imagickpixel('rgb(' . $color[0] . ',' . $color[1] . ',' . $color[2] . ')');
  //         $png = new \Imagick();
  //         $png->newImage($width, $height + 20, 'none', 'png'); // +20 (+)
  //         $imageMagickObject = new \imagickdraw();
  //         $imageMagickObject->setFillColor($colorForeground);
  //     } else {
  //         return false;
  //     }

  //     // print bars
  //     $positionHorizontal = 0;
  //     foreach ($barcodeData['bars'] as $bar) {
  //         $bw = round(($bar['width'] * $widthFactor), 3);
  //         $bh = round(($bar['height'] * $totalHeight / $barcodeData['maxHeight']), 3);
  //         if ($bar['drawBar']) {
  //             $y = round(($bar['positionVertical'] * $totalHeight / $barcodeData['maxHeight']), 3);
  //             // draw a vertical bar
  //             if ($imagick && isset($imageMagickObject)) {
  //                 $imageMagickObject->rectangle($positionHorizontal, $y, ($positionHorizontal + $bw), ($y + $bh));
  //             } else {
  //                 imagefilledrectangle($png, $positionHorizontal, $y, ($positionHorizontal + $bw) - 1, ($y + $bh),
  //                     $colorForeground);
  //             }
  //         }
  //         $positionHorizontal += $bw;
  //     }

  //     if ($imagick && isset($imageMagickObject)) {
  //         $draw = new ImagickDraw();
  //         $draw->setFillColor('black');

  //         /* Font properties */
  //         $draw->setFont('Bookman-DemiItalic');
  //         $draw->setFontSize(5);

  //         // Write the barcode's code, change $code to write other text
  //         $imageMagickObject->annotateImage($draw, 0, $height + 5, 0, $code);
  //     }

  //     else
  //     {
  //         // Detect center position
  //         $font = 7;
  //         $font_width = ImageFontWidth($font);
  //         $font_height = ImageFontHeight($font);
  //         $text_width = $font_width * strlen($code);
  //         $position_center = ceil(($width - $text_width) / 2);

  //         // Default font
  //         // Write the barcode's code, change $code to write other text
  //         imagestring($png, 7, $position_center, $height + 5, $code, imagecolorallocate($png, 0, 0, 0));

  //         // For custom font specify path to font file
  //         /*$fontPath = '..\font.ttf';
  //         imagettftext($png, 12, 0, $position_center, $height + 5, imagecolorallocate($png, 0, 0, 0), $fontPath, $code);*/
  //     }

  //     ob_start();
  //     if ($imagick && isset($imageMagickObject)) {
  //         $png->drawImage($imageMagickObject);
  //         echo $png;
  //     } else {
  //         imagepng($png);
  //         imagedestroy($png);
  //     }
  //     $image = ob_get_clean();

  //     return $image;
  // }

  public function login_ap($user, $pass){
    $link = ldap_connect('ldap://'. getenv('AD_HOST') .':389'); // Your domain or domain server

    if(! $link) {
      $result = array('status'=>FALSE, 'message'=>'Could not connect to server - handle error appropriately.');
      return $result;
    }

    // $ldaprdn = 'BIGC\\DevConnector';  //'ldap://10.4.9.15' . "\\" . $username;

    ldap_set_option($link, LDAP_OPT_PROTOCOL_VERSION, 3); // Recommended for AD
    ldap_set_option($link, LDAP_OPT_REFERRALS, 1);        // REFERRALS

    // $user = 'BIGC\\DevConnector';
    // $pass = 'Dc#062019';

    // $user = 'HO\\296204';
    // $pass = 'user&pass04';

    // dpm( $user );
    // dpm( $pass );
    
    $bind = ldap_bind($link, 'HO\\'. $user, $pass);
    // Now try to authenticate with credentials provided by user
    if (!$bind) {
      $result = array('status'=>FALSE, 'message'=>'ไม่สามารถเข้าสู่ระบบได้.');
    }else{
      // Bind was successful - continue
      $result = array('status'=>TRUE);
    }
    
    return $result;
  }

  public function verify_ap($uid){
    $link = ldap_connect('ldap://'. getenv('AD_HOST') .':389'); // Your domain or domain server
    // $link = ldap_connect('ldap://10.4.9.15:389'); 

    if(! $link) {
      $result = array('status'=>FALSE, 'message'=>'Could not connect to server - handle error appropriately.');
      return $result;
    }

    // ldap_set_option($link, LDAP_OPT_PROTOCOL_VERSION, 3); // Recommended for AD
    // ldap_set_option($link, LDAP_OPT_REFERRALS, 1);        // REFERRALS

    ldap_set_option($link, LDAP_OPT_PROTOCOL_VERSION, 3); // Recommended for AD
    // ldap_set_option($link, LDAP_OPT_REFERRALS, 0);          // REFERRALS
    ldap_set_option($link, LDAP_OPT_REFERRALS, 0);          // REFERRALS

    // $user = 'BIGC\\DevConnector';
    // $pass = 'Dc#062019';

    $bind = ldap_bind($link,  'BIGC\\' . getenv('AD_USER'),  getenv('AD_PASSWORD'));

    // $bind = ldap_bind($link,  "BIGC\\DevConnector", 'Dc#062019');

    // Now try to authenticate with credentials provided by user
    if (!$bind) {
      // var_dump('Invalid credentials! Handle error appropriately');

      $result = array('status'=>FALSE, 'message'=>'ไม่สามารถเข้าสู่ระบบได้.');
      return $result;
    }

    // if (!$bind) {
    //   dpm('Invalid credentials! Handle error appropriately');
    // }
    // Bind was successful - continue

    // var_dump('Bind was successful - continue');
    if ($bind) {
      // var_dump( $bind ); // primaryGroupID=513
      $filter= '(sAMAccountName=' . $uid . ')'; // CN=Ngodngam
      // $result= ldap_search($link,"OU=MIS,OU=Users,OU=HeadOffice,OU=BigC,DC=bigc,DC=co,DC=th", $filter, array("givenName","sn","mail","displayName"));
     
      // $result= ldap_search($link, "OU=HeadOffice,DC=ho,DC=bigc,DC=co,DC=th",$filter, array("givenName","sn","mail","displayName"));

      // $result= ldap_search($link, "DC=ho,DC=bigc,DC=co,DC=th",$filter, array("givenName","sn","mail","displayName"));

      $result= ldap_search($link,"DC=ho,DC=bigc,DC=co,DC=th",$filter, array("givenName","sn","mail","displayName"));
      // echo '<pre>';
      // var_dump( $result );
      // echo '</pre>';
      
      /*
      if (!count($result)){
          var_dump('error');
      }else{
          var_dump('Success');
      }

      $info = ldap_get_entries($link, $result);
      var_dump( $info );
      */
      $info = ldap_get_entries($link, $result);

      if($info['count'] == 0){
        $result = array('status'=>FALSE, 'message'=>'ไม่สามารถหา User AD : ' . $uid);
      }else{
        /*
        for ($i=0; $i<$info["count"]; $i++)
            {
                if($info['count'] > 1)
                    break;
                echo "<p>You are accessing <strong> ". $info[$i]["sn"][0] .", " . $info[$i]["givenname"][0] ."</strong><br /> (" . $info[$i]["samaccountname"][0] .")</p>\n";
                echo '<pre>';
                var_dump($info);
                echo '</pre>';
                $userDn = $info[$i]["distinguishedname"][0]; 
            }
        */
        // echo '<pre>';
        // var_dump( $info );
        // echo '</pre>';

        // ldap_close($link);

        $data = array();
        for ($i=0; $i<$info["count"]; $i++){
          $data['displayname'] = $info[$i]["displayname"][0];
          $data['mail'] = $info[$i]["mail"][0];
        }

        $result = array('status'=>TRUE, 'data'=>$data, 'info'=>$info);
      }
    }else{
      $result = array('status'=>FALSE, 'message'=>'ไม่สามารถเข้าสู่ระบบได้.');
    }
    return $result;
  }

  public function gen_shortlink($length = 5) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }

  // https://stackoverflow.com/questions/12783737/how-to-use-setinterval-in-php
  public function setInterval($f, $milliseconds)
  {
      $seconds=(int)$milliseconds/1000;
      while(true)
      {
          $f();
          sleep($seconds);
      }
  }

  public static function truncate($text, $length = 100, $ending = '...', $exact = true, $considerHtml = false) {
    if ($considerHtml) {
     // if the plain text is shorter than the maximum length, return the whole text
     if (strlen(preg_replace('/<.*?>/', '', $text)) <= $length) {
      return $text;
     }
   
     // splits all html-tags to scanable lines
     preg_match_all('/(<.+?>)?([^<>]*)/s', $text, $lines, PREG_SET_ORDER);
   
     $total_length = strlen($ending);
     $open_tags = array();
     $truncate = '';
   
     foreach ($lines as $line_matchings) {
      // if there is any html-tag in this line, handle it and add it (uncounted) to the output
      if (!empty($line_matchings[1])) {
       // if it’s an “empty element” with or without xhtml-conform closing slash (f.e.)
       if (preg_match('/^<(\s*.+?\/\s*|\s*(img|br|input|hr|area|base|basefont|col|frame|isindex|link|meta|param)(\s.+?)?)>$/is', $line_matchings[1])) {
       // do nothing
       // if tag is a closing tag (f.e.)
       } else if (preg_match('/^<\s*\/([^\s]+?)\s*>$/s', $line_matchings[1], $tag_matchings)) {
        // delete tag from $open_tags list
        $pos = array_search($tag_matchings[1], $open_tags);
        if ($pos !== false) {
         unset($open_tags[$pos]);
        }
        // if tag is an opening tag (f.e. )
       } else if (preg_match('/^<\s*([^\s>!]+).*?>$/s', $line_matchings[1], $tag_matchings)) {
        // add tag to the beginning of $open_tags list
        array_unshift($open_tags, strtolower($tag_matchings[1]));
       }
       // add html-tag to $truncate’d text
       $truncate .= $line_matchings[1];
      }
   
      // calculate the length of the plain text part of the line; handle entities as one character
      $content_length = strlen(preg_replace('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', ' ', $line_matchings[2]));
      if ($total_length+$content_length > $length) {
       // the number of characters which are left
       $left = $length - $total_length;
       $entities_length = 0;
       // search for html entities
       if (preg_match_all('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', $line_matchings[2], $entities, PREG_OFFSET_CAPTURE)) {
        // calculate the real length of all entities in the legal range
        foreach ($entities[0] as $entity) {
         if ($entity[1]+1-$entities_length <= $left) {
          $left--;
          $entities_length += strlen($entity[0]);
         } else {
          // no more characters left
          break;
         }
        }
       }
       $truncate .= substr($line_matchings[2], 0, $left+$entities_length);
       // maximum lenght is reached, so get off the loop
       break;
      } else {
       $truncate .= $line_matchings[2];
       $total_length += $content_length;
      }
   
      // if the maximum length is reached, get off the loop
      if($total_length >= $length) {
       break;
      }
     }
    } else {
     if (strlen($text) <= $length) {
      return $text;
     } else {
      $truncate = substr($text, 0, $length - strlen($ending));
     }
    }
   
    // if the words shouldn't be cut in the middle...
    if (!$exact) {
     // ...search the last occurance of a space...
     $spacepos = strrpos($truncate, ' ');
     if (isset($spacepos)) {
      // ...and cut the text in this position
      $truncate = substr($truncate, 0, $spacepos);
     }
    }
   
    // add the defined ending to the text
    $truncate .= $ending;
   
    if($considerHtml) {
     // close all unclosed html-tags
     foreach ($open_tags as $tag) {
      $truncate .= '';
     }
    }
   
   return $truncate;
   
  }

  private static function FB(){
    $banlist = ConfigPages::config('banlist');
    $fb_app_id      = $banlist->get('field_fb_app_id')->getValue();
    $fb_app_secret  = $banlist->get('field_fb_app_secret')->getValue();

    $fb = new \Facebook\Facebook([
        'app_id' => $fb_app_id[0]['value'],
        'app_secret' => $fb_app_secret[0]['value'],
        'default_graph_version' => 'v2.10',
        //'default_access_token' => '{access-token}', // optional
    ]);
    return $fb;
  }

  public static function FBLogin(){    
    $helper = Utils::FB()->getRedirectLoginHelper();
    $permissions = ['email' /*, 'user_likes'*/ ]; // optional
    $loginUrl = $helper->getLoginUrl('https://banlist.info/admin/fb_login/callback', $permissions);
    return $loginUrl;
  }

  public function FBCallback() {
    /*
    $banlist = ConfigPages::config('banlist');

    $fb_app_id      = $banlist->get('field_fb_app_id')->getValue();
    $fb_app_secret  = $banlist->get('field_fb_app_secret')->getValue();

    $fb = new \Facebook\Facebook([
        'app_id' => $fb_app_id[0]['value'],
        'app_secret' => $fb_app_secret[0]['value'],
        'default_graph_version' => 'v2.10',
        //'default_access_token' => '{access-token}', // optional
    ]);
    */

    $helper = Utils::FB()->getRedirectLoginHelper();


    if (isset($_GET['state'])) {
      $helper->getPersistentDataHandler()->set('state', $_GET['state']);
    }

    try {
        $accessToken = $helper->getAccessToken();
    } catch(Facebook\Exceptions\FacebookResponseException $e) {
        // When Graph returns an error
        echo 'Graph returned an error: ' . $e->getMessage();
        exit;
    } catch(Facebook\Exceptions\FacebookSDKException $e) {
        // When validation fails or other local issues
        echo 'Facebook SDK returned an error: ' . $e->getMessage();
        exit;
    }
    
    if (isset($accessToken)) {
        // Logged in!
        $_SESSION['facebook_access_token'] = (string) $accessToken;
        
        // Now you can redirect to another page and use the
        // access token from $_SESSION['facebook_access_token']
        
        $response = Utils::FB()->get('/me?fields=id,name,gender,email,link', $accessToken);
        
        $user = $response->getGraphUser();
        // echo'<pre>';
        // dpm($user);
        // echo'</pre>';
        
        //echo 'ID: ' . $user['id'];
        //echo 'Name: ' . $user['name'];
        //echo 'Gener: ' . $user['gener'];
        //echo 'Email: ' . $user['email'];
        //echo 'Link: ' . $user['link'];

        // \Drupal\Core\Url::fromRoute('<front>');

        $user['type'] = 'facebook';

        Utils::logind9($user);
    }

    // return new JsonResponse([]);
    return new RedirectResponse(\Drupal\Core\Url::fromRoute('<front>')->toString());
  }

  public static function logind9( $data ){
    $name   = $data['id'];
    $gener  = $data['gener'];
    $email  = $data['email'];
    $link  = $data['link'];

    $strPicture = '';
    switch($data['type']){
      case 'facebook':{
        $strPicture = "https://graph.facebook.com/".$data['id']."/picture?type=large";

        break;
      }
      case 'google':{
        $strPicture = $data['picture'];
        break;
      }
    }

    \Drupal::logger('logind9')->error( 'id    = %id,  
                                        name  = %name, 
                                        gener = %gener, 
                                        email = %email, 
                                        link  = %link,
                                        strPicture  = %strPicture',
                                        array(
                                          '%id' => $data['id'],
                                          '%name' => $data['name'],
                                          '%gener' => $data['gener'],
                                          '%email' => $data['email'],
                                          '%link' => $data['link'],
                                          '%strPicture' => $strPicture,
                                        ) );

    $ids = \Drupal::entityQuery('user')
          ->condition('name', $name)
          ->range(0, 1)
          ->execute();

    if(empty($ids)){
      // register new member
      // #1 register
      $user = User::create();

      //Mandatory settings
      $user->setUsername( $name );
      $user->setPassword( MD5($name) );
      $user->enforceIsNew();
      $user->setEmail( $data['email'] );
  
      //Optional settings
      $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $user->set("init", 'email');
      $user->set("langcode", $language);
      $user->set("preferred_langcode", $language);
      $user->set("preferred_admin_langcode", $language);  
      $user->activate();
      // $user->addRole('authenticated');
      //Save user
      $user->save();
    }

    $uid = \Drupal::service('user.auth')->authenticate( $name, MD5($name));
    
    \Drupal::logger('bigcard')->notice('login_form > uid : %uid, name : %name.', array( '%uid' => $uid ));
    if($uid){
      // Create file object from remote URL.
      $file = file_save_data(file_get_contents($strPicture), 'public://'. $data['id'] . '_' . date('m-d-Y_hia') .'.png', FileSystemInterface::EXISTS_REPLACE);

      $user = User::load($uid);
      /*
      $_SESSION["auth_token"]   = $data->authToken;
      $_SESSION["bigcard"]      = $data->bigcard;
      $_SESSION["id_card"]      = $data->idCard;
      $_SESSION["mobile_phone"] = $data->mobilePhone;
      $_SESSION["is_online_register"] = $data->isOnlineRegister;
      */

      // $user->set('field_auth_token', $data->authToken);
      // $user->set('field_bigcard', $data->bigcard);
      // $user->set('field_id_card', $data->idCard);
      // $user->set('field_mobile_phone', $data->mobilePhone);
      // $user->set('field_is_online_register', $data->isOnlineRegister);

      $user->set('field_display_name', $data['name']);
      $user->set('user_picture', $file->id());

      // is login with FB || Google
      // $user->set('field_login_with_fb', 1);
      

      /*
        website : 28
        facebook : 29
        google : 30
      */
      switch($data['type']){
        case 'facebook':{
          $user->set('field_type_login', 29);
          break;
        }
        case 'google':{
          $user->set('field_type_login', 30);
          break;
        }
      }

      // 25: male, 26: Female
      $user->set('field_gender', empty($data['gender']) ? '' : ($data['gender'] == 'male' ? 25 : 26) );
      $user->save();

      user_login_finalize($user);

      return true;
    }

    return false;
  }

  private static function Google(){
    $banlist = ConfigPages::config('banlist');
    $field_google_client_credentials      = $banlist->get('field_google_client_credentials')->getValue();

    $url = '';
    if(!empty($field_google_client_credentials)){
      $google_client_credentials = $field_google_client_credentials[0]['target_id'];
  
      $url = Utils::get_file_url($google_client_credentials);
      // $url2 = Utils::get_file_uri($google_client_credentials);
  
      $url = substr($url, strlen($GLOBALS['base_url'] . '/'));
    }
  
    $client = new \Google\Client();
    $client->setAuthConfig($url);
    // $client->setScopes(array('https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/moderator'));
  
    // return $client->createAuthUrl();
    
    return $client;
  }

  public static function GoogleLogin(){
    $client = Utils::Google(); // 
    $client->setScopes(array('https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/moderator', 'https://www.googleapis.com/auth/userinfo.profile'));
  
    return $client->createAuthUrl(); 
  }

  public function GoogleCallback(){
    $client = Utils::Google();

   // \Drupal::logger('google-log')->error('GoogleCallback');

    // \Drupal::logger('google-log')->error(serialize($_GET));

    // if (isset($_GET['code'])) {
    //   $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    // }

    // $oauth2 = new \Google_Service_Oauth2($client);
    // $userInfo = $oauth2->userinfo->get();
    // // dpm($userInfo);
    // \Drupal::logger('google-log')->error(serialize($userInfo));

    // $client->useApplicationDefaultCredentials();
    // $client->addScope(Google_Service_Plus::PLUS_ME);

    // // returns a Guzzle HTTP Client
    // $httpClient = $client->authorize();

    // // make an HTTP request
    // $response = $httpClient->get('https://www.googleapis.com/plus/v1/people/me');

    // \Drupal::logger('google-log')->error(serialize($response));

    //Send Client Request
    $objOAuthService = new \Google_Service_Oauth2($client);
    
    //This $_GET["code"] variable value received after user has login into their Google Account redirct to PHP script then this variable value has been received
    if(isset($_GET["code"]))
    {
      $client->authenticate($_GET['code']);
      $_SESSION['access_token'] = $client->getAccessToken();
      // header('Location: ' . 'https://banlist.info/admin/oauth_client_id/callback');

      return new RedirectResponse(\Drupal\Core\Url::fromRoute('backlist.oauth_client_id_callback')->toString()); 
      
      /*
      //It will Attempt to exchange a code for an valid authentication token.
      $token = $client->fetchAccessTokenWithAuthCode($_GET["code"]);

      //This condition will check there is any error occur during geting authentication token. If there is no any error occur then it will execute if block of code/
      if(!isset($token['error']))
      {
        //Set the access token used for requests
        $client->setAccessToken($token['access_token']);

        //Store "access_token" value in $_SESSION variable for future use.
        $_SESSION['access_token'] = $token['access_token'];

        //Create Object of Google Service OAuth 2 class
        $google_service = new \Google_Service_Oauth2($client);

        //Get user profile data from google
        $data = $google_service->userinfo->get();
        $userData=$google_service->userinfo_v2_me->get();

        \Drupal::logger('google-log')->error(serialize( $data ));
        \Drupal::logger('google-log')->error(serialize( $userData ));

        // //Below you can find Get profile data and store into $_SESSION variable
        if(!empty($data['given_name']))
        {
          $_SESSION['user_first_name'] = $data['given_name'];
        }

      }
      */
    }

    //Set Access Token to make Request
    if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
      $client->setAccessToken($_SESSION['access_token']);
    }

    //Get User Data from Google Plus
    //If New, Insert to Database
    if ($client->getAccessToken()) {
      $userData = $objOAuthService->userinfo_v2_me->get();
      if(!empty($userData)) {

        /*
        Google_Service_Oauth2_Userinfoplus Object
        (
            [internal_gapi_mappings:protected] => Array
                (
                    [familyName] => family_name
                    [givenName] => given_name
                    [verifiedEmail] => verified_email
                )

            [email] => 
            [familyName] => 
            [gender] => 
            [givenName] => 
            [hd] => 
            [id] => 123456
            [link] => https://plus.google.com/123456
            [locale] => en-GB
            [name] => someguy
            [picture] => https://lh3.googleusercontent.com/-q1Smh9d8d0g/AAAAAAAAAAM/AAAAAAAAAAA/3YaY0XeTIPc/photo.jpg
            [verifiedEmail] => 
            [modelData:protected] => Array
                (
                )

            [processed:protected] => Array
                (
                )

        )
        */
        
        $data = array();
        $data['type']     = 'google';
        $data['id']       = $userData->id;
        $data['name']     = $userData->name;
        $data['gener']    = '';
        $data['email']    = $userData->email;
        $data['link']     = '';
        $data['picture']  = $userData->picture;

        Utils::logind9($data);

        // $objDBController = new DBController();
        // $existing_member = $objDBController->getUserByOAuthId($userData->id);
        // if(empty($existing_member)) {
        //   $objDBController->insertOAuthUser($userData);
        // }
      }
      $_SESSION['access_token'] = $client->getAccessToken();

      // header('Location: ' . filter_var('https://banlist.info', FILTER_SANITIZE_URL));

    } 
    return new RedirectResponse(\Drupal\Core\Url::fromRoute('<front>')->toString()); 
  }

  public static function Expired_FBLongLivedAccessToken(){

    $banlist = ConfigPages::config('banlist');
    $expired_access_token      = $banlist->get('field_expired_access_token')->getValue();

    if(empty($expired_access_token)){
      return FALSE;
    }
    $expired_access_token = $expired_access_token[0]['value'];

    $d1 = new DateTime($expired_access_token);
    $d2 = new DateTime($expired_access_token);

    // increment 55 date
    $d2->add(new DateInterval('P55D'));

    if( $d1->diff($d2)->days <= 0 ){
      // send mail to admin noti expired facebook long live access token.
      $mailManager = \Drupal::service('plugin.manager.mail');
      $module = 'backlist';
      $key = 'expired_longlived_access_tokens';
      $to = \Drupal::config('system.site')->get('mail');
      $params['title'] = 'Expired Long-Lived Access Tokens(Facebook)';
      $params['message'] = 'Expired Long-Lived Access Tokens';
      $langcode = \Drupal::currentUser()->getPreferredLangcode();
      $send = true;
      $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
      if ($result['result'] !== true) {
        \Drupal::logger('Banlist')->error('Expired_FBLongLivedAccessToken : There was a problem sending your message and it was not sent at %time time.', array( '%time' => (new DateTime())->format('Y-m-d H:i:s') ));
      }
      else {
        \Drupal::logger('Banlist')->notice('Expired_FBLongLivedAccessToken : Your message has been sent at %time time.', array( '%time' => (new DateTime())->format('Y-m-d H:i:s') ));
      }

      return TRUE;
    }

    return FALSE;
  }

  private static function Twitter(){
    $banlist = ConfigPages::config('banlist');

    $consumer_key     = $banlist->get('field_twitter_consumer_key')->getValue()[0]['value'];
    $consumer_secret  = $banlist->get('field_twitter_consumer_secret')->getValue()[0]['value'];
    $access_token     = $banlist->get('field_twitter_access_token')->getValue()[0]['value'];
    $access_token_secret  = $banlist->get('field_twitter_access_t_secret')->getValue()[0]['value'];

    return new TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);
  }

  private static function Twitter_Post($text, $images){
    // Limit 4 image
    $images = array_slice($images, 0, 4); 

    $tw = Utils::Twitter();
    $media_ids = array();
    foreach ($images as $key => $value) {
      $media = $tw->upload('media/upload', ['media' => $value/*'sites/default/files/01-25-2021_1004pm_6530.jpeg'*/ ]);
      $media_ids[] = $media->media_id_string;
    }

    $parameters = [
      'status' => $text,
      'media_ids' => implode(',', $media_ids)
    ];
    return $tw->post('statuses/update', $parameters);
  }

  public static function Cron_Twitter_Post(){
    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
    $query->condition('field_is_twitter', 0);
    $nids = $query->execute();

    foreach ($storage->loadMultiple($nids) as $node) {
      $title = $node->label();

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

      $details = Utils::truncate(strip_tags($node->get('body')->getValue()[0]['value']), 200, '');
      
      // 7. รูปภาพประกอบ
      $images = array();
      foreach ($node->get('field_images')->getValue() as $imi=>$imv){
        $images[] = str_replace(Utils::get_base_url(), "", Utils::get_file_url($imv['target_id']));
      }

      /*
      use Drupal\backlist\Utils\Utils;

      $media1 = 'sites/default/files/01-25-2021_1004pm_6530.jpeg';
      $media2 = 'sites/default/files/01-25-2021_1004pm_7553.jpeg';
      $media3 = 'sites/default/files/01-25-2021_1004pm_7850.jpeg';
      $media4 = 'sites/default/files/01-25-2021_1004pm_8801.jpeg';

      // string to Post 
      $str = 'Test Tweet... ' . PHP_EOL;
      $str .= '#mytweet' . PHP_EOL;
      $str .= 'http://www.mywebsite.com' . PHP_EOL;
      // $str .= '' . hash('sha1', mt_rand(0, 1000000));

      $ims    = array( $media1, $media2, $media3, $media4);
      $result = Utils::Twitter_Post($str, $ims);
      dpm($result->id);
      */
      // string to Post 
      $str  = $title . PHP_EOL;
      $str .= '#'.$sales_person_name . PHP_EOL;
      $str .= '#'.$sales_person_surname . PHP_EOL;
      $str .= $details . PHP_EOL;
      $str .= Utils::get_base_url() . 'node/' . $node->id() . PHP_EOL;
      // $str .= '' . hash('sha1', mt_rand(0, 1000000));

      $result = Utils::Twitter_Post($str, $images);
      // dpm($result->id);
      if(!empty($result->id)){
        $node->field_is_twitter = 1;
        $node->field_twit_id    = $result->id;
        $node->save();
      }else{
        // send mail to admin noti expired facebook long live access token.
        $mailManager = \Drupal::service('plugin.manager.mail');
        $module = 'backlist';
        $key = 'twitter_post';
        $to = \Drupal::config('system.site')->get('mail');
        $params['title'] = 'Error Twitter post(Twitter)';
        $params['message'] = 'Error Twitter post node id  = ' . $node->id();
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        if ($result['result'] !== true) {
          \Drupal::logger('Banlist')->error('Expired_FBLongLivedAccessToken : There was a problem sending your message and it was not sent at %time time.', array( '%time' => (new DateTime())->format('Y-m-d H:i:s') ));
        }
        else {
          \Drupal::logger('Banlist')->notice('Expired_FBLongLivedAccessToken : Your message has been sent at %time time.', array( '%time' => (new DateTime())->format('Y-m-d H:i:s') ));
        }
      }
    }
  }

  public static function Cron_Twitter_Delete(){
    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
    $query->condition('field_is_twitter', 0);
    $nids = $query->execute();

    foreach ($storage->loadMultiple($nids) as $node) {
      $twit_id = $node->get('field_twit_id')->getValue();

      if(!empty($twit_id)){
        $twit_id = $twit_id[0]['value'];

        $statuses = (Utils::Twitter())->post("statuses/destroy/" . $twit_id ); 

        if( !empty($statuses) ){
          $node->field_twit_id    = "";
          $node->save();
        }
      }
    }
  }

  public static function Twitter_Delete_By_TwitId($twit_id){
    (Utils::Twitter())->post("statuses/destroy/" . $twit_id ); 
  }

  function test_send_email() {
    // $mailManager = \Drupal::service('plugin.manager.mail');
    // $module = 'backlist';
    // $key = 'node_insert'; // Replace with Your key
    // $to = 'mr.simajarn@gmail.com';//\Drupal::currentUser()->getEmail();
    // $params['message'] = '---message---';
    // $params['title'] = '---title---';
    // $langcode = \Drupal::currentUser()->getPreferredLangcode();
    // $send = true;
  
    // $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
    // if ($result['result'] != true) {
    //   $message = t('There was a problem sending your email notification to @email.', array('@email' => $to));
    //   // drupal_set_message($message, 'error');
    //   \Drupal::logger('mail-log')->error($message);
    //   return;
    // }
  
    // $message = t('An email notification has been sent to @email ', array('@email' => $to));
    // // drupal_set_message($message);
    // \Drupal::logger('mail-log')->notice($message);

    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'backlist';
    $key = 'create_article';
    $to = 'mr.simajarn@gmail.com';// \Drupal::currentUser()->getEmail();
    $params['message'] = Markup::create("fff");
    $params['node_title'] = '$entity->label()';
    $langcode = \Drupal::currentUser()->getPreferredLangcode();
    $send = true;
    $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
    if ($result['result'] !== true) {
      \Drupal::messenger()->addStatus(t('There was a problem sending your message and it was not sent.'), 'error');
    }
    else {
      \Drupal::messenger()->addStatus(t('Your message has been sent.'));
    }
  }

  // check url not found ?
  public static function is_404($url) {
    // $handle = curl_init($url);
    // curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

    // /* Get the HTML or whatever is linked in $url. */
    // $response = curl_exec($handle);

    // /* Check for 404 (file not found). */
    // $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    // curl_close($handle);

    // /* If the document has loaded successfully without any redirection or error */
    // if ($httpCode >= 200 && $httpCode < 300) {
    //     return false;
    // } else {
    //     return true;
    // }

    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);

    /* Check for 404 (file not found). */
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);

    curl_close($handle);
    if($httpCode == 404) {
      /* Handle 404 here. */
      return true;
    }
    return false;
  }
  
  public static function clean($string) {
    $string = str_replace(' ', '', $string); // Replaces all spaces with hyphens.

    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
  }


  public static function Syc_Blacklistseller($i = NULL, $iend = NULL){

    /*
      $url = 'https://www.blacklistseller.com/assets/uploads/user_uploads_report/64387_Screenshot_2021-01-27-12-25-03-37.jpg';
      $file = file_save_data(file_get_contents($url), 'public://'. $data['id'] . '_' . date('m-d-Y_hia') .'.png', FILE_EXISTS_REPLACE);
      $file->id()
    */

    /*
    function clean($string) {
      $string = str_replace(' ', '', $string); // Replaces all spaces with hyphens.

      return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
    }

    // url to inspect
    $url = 'https://www.blacklistseller.com/assets/uploads/user_uploads_report/64387_Screenshot_2021-01-27-12-25-03-37.jpg?test=4545';
    // echo basename($url);
    $path_parts = pathinfo($url);

    // $ext = pathinfo($url, PATHINFO_EXTENSION);

    // dpm($ext);

    // echo $path_parts['dirname'], "\n";
    // echo $path_parts['basename'], "\n";
    // echo $path_parts['extension'], "\n";
    // echo $path_parts['filename'], "\n"; 

    echo clean($path_parts['filename']) . "\n"; 

    $ext = pathinfo(
        parse_url($url, PHP_URL_PATH), 
        PATHINFO_EXTENSION
    ); 

    echo ($ext);

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

   

    $all_banks = array('1'=> 'กรุงศรีอยุธยา', '2'=> 'กรุงเทพ', '3'=> 'ซีไอเอ็มบี',
                   '4'=> 'ออมสิน', '5'=> 'อิสลาม', '6'=> 'กสิกรไทย',
                   '7'=> 'เกียรตินาคิน', '8'=> 'กรุงไทย', '9'=> 'ไทยพาณิชย์',
                   '10'=> 'Standard', '11'=> 'ธนชาติ', '12'=> 'ทิสโก้แบงค์',
                   '13'=> 'ทหารไทย', '14'=> 'ยูโอบี', '15'=> 'สหกรณ์การเกษตร',
                   '16'=> 'Wallet', '17'=> 'พร้อมเพย์', '18'=> 'อาคารสงเคราะห์', 
                   '19'=> 'AirPay', '20'=> 'mPay', '21'=> 'เซอร์วิส', 
                   '22'=> 'เพื่อรายย่อย', '23'=> 'แลนด์แอนด์เฮ้าส์', '24'=> 'เก็บเงินปลายทาง' );

    if(empty($i) && empty($iend)){
      $query = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->getQuery()
        ->condition('status', \Drupal\node\NodeInterface::PUBLISHED)
        ->condition('type', 'back_list')
        ->condition('field_from_blacklistseller', 1)
        ->sort('nid', 'DESC')
        ->range(0, 1);

      $nids = $query->execute();


      $i     = 0;
      $iend  = 1000;

      if(!empty($nids)){
        $node = Node::load($nids[key($nids)]);
        $field_id_blacklistseller = $node->get('field_id_blacklistseller')->getValue();
        if(!empty($field_id_blacklistseller)){
          $i = $field_id_blacklistseller[0]['value'] + 1;
          $iend   =  $i + 1000;
        }
      }
    }
    
   

    ///////////////

    // dpm("i = " . $i .", iend = ". $iend );

    // return ;

    $datass = array();
     // 0-10000, 10000-150000, 15000-20000, 
     // for ($i = 1; $i <= 5; $i++) {
    for ($i; $i <= $iend; $i++) {
       \Drupal::logger('Syc_Blacklistseller')->notice($i);


       $query = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->getQuery()
        // ->condition('status', \Drupal\node\NodeInterface::PUBLISHED)
        ->condition('type', 'back_list')
        ->condition('field_from_blacklistseller', 1)
        ->condition('field_id_blacklistseller', $i , '=');
  
        if(!empty($query->execute())){
          // เราจะไม่ดึงข้อมูลซํ้ามา
          continue;
        }
       

       $url = 'https://www.blacklistseller.com/report/report_preview/' . $i;
       $datas = array();
       if(!Utils::is_404($url)){
         $html = HtmlDomParser::file_get_html($url);

         $table = $html->find('.table-borderless');
         foreach ($table->find('tr') as $row) {
           foreach($row->find('th') as $th) {

             // สินค้าที่สั่งซื้อ
             if (str_contains($th->plaintext, 'สินค้าที่สั่งซื้อ')){
               $product_type = empty($row->find('td')[0]) ? '' : $row->find('td')[0]->plaintext;

               $datas['product_type'] = $product_type;
             }
             

             // ยอดโอน
             if (str_contains($th->plaintext, 'ยอดโอน')){
               $transfer_amount = empty($row->find('td')[0]) ? '' : $row->find('td')[0]->plaintext;

               $datas['transfer_amount'] = $transfer_amount;
             }
             

             // ชื่อคนขาย
 
             // person_name    : ชื่อบัญชี ผู้รับเงินโอน
             // person_surname : นามสกุล ผู้รับเงินโอน
             
             if (str_contains($th->plaintext, 'ชื่อคนขาย')){

               $ps = explode(" ", $row->find('td')[0]->find('b')[0]->plaintext);
               if(count($ps) > 1){
                 $datas['person_name'] = $ps[0];
                 $datas['person_surname'] = $ps[1];
               }
             }
             
             // เลขบัตรประชาชน
             if (str_contains($th->plaintext, 'เลขบัตรประชาชน')){
               $id_card_number = empty($row->find('td')[0]->find('b')) ? '' : $row->find('td')[0]->find('b')[0]->plaintext;
             
               $datas['id_card_number'] = $id_card_number;
             }
             
             // เพจขายของ
             if (str_contains($th->plaintext, 'เพจขายของ')){
               $selling_website = empty($row->find('td')[0]) ? '' : $row->find('td')[0]->plaintext;
             
               $datas['selling_website'] = $selling_website;
             }
             
             // วันโอนเงิน
             if (str_contains($th->plaintext, 'วันโอนเงิน')){
               $transfer_date = empty($row->find('td')[0]) ? '' : $row->find('td')[0]->plaintext;

               $datas['transfer_date'] = $transfer_date;
             }
             
             // // วันที่ลงประกาศ
             // if (str_contains($th->plaintext, 'วันที่ลงประกาศ')){
             //   $td = empty($row->find('td')[0]) ? '' : $row->find('td')[0]->plaintext;
             //   echo 'วันที่ลงประกาศ= '. $td  . '</br>';
             // }


             //   merchant_bank_account : บัญชีธนาคารคนขาย

             if (str_contains($th->plaintext, 'เลขบัญชี')){
               // $td = empty($row->find('td')[0]->find('b')) ? '' : $row->find('td')[0]->find('b')[0]->plaintext;
               // echo 'ชื่อบัญชี= '. $row->find('td')[0]->find('b')[0]->innertext . '</br>';
               // echo 'เลขบัญชี= '. $row->find('td')[0]->find('b')[0]->find('a')[0]->plaintext . '</br>';

              // $merchant_bank_account['bank_account'] = $row->find('td')[0]->find('b')[0]->innertext;
              // $merchant_bank_account['bank_wallet']  = $row->find('td')[0]->find('b')[0]->find('a')[0]->plaintext;
               // dpm($row->find('td')[0]->find('b')[0]->innertext);
               // dpm(gettype($row->find('td')[0]->find('b')[0]->find('a')[0]->plaintext));

               $bank_wallet = $row->find('td')[0]->find('b')[0]->find('a')[0]->plaintext;
               $bank_account= $row->find('td')[0]->find('b')[0]->innertext;

               // dpm($bank_wallet);
               // dpm($bank_account);

               // $all_banks
               $bank_wallet_key = 0;
               foreach ($all_banks as $bkey => $bvalue) {
                 if(str_contains($bank_account, $bvalue)){
                   // $datas['merchant_bank_account']['bank_wallet']= $bkey;

                   $bank_wallet_key = $bkey;
                   break;
                 }
               }

               // $datas['merchant_bank_account']['bank_account'] = $bank_wallet;
               $datas['merchant_bank_account'][] = array("bank_wallet"=>$bkey, "bank_account"=>$bank_wallet);
             }
           }
         }

         $details = $html->find('.form-group');
         foreach ($details as $detail) {
           foreach($detail->find('label') as $label) {
             
             
             if (str_contains($detail->plaintext, 'รายละเอียดเพิ่มเติม')){
               // dpm($detail->plaintext);
               // echo 'รายละเอียดเพิ่มเติม : ' . $detail->find('.col-xs-12')[1]->plaintext . '</br>';
               
               $datas['details'] = $detail->find('.col-xs-12')[1]->plaintext;
             }
             
           }

           
           // col-sm-12
           $images_fids = array();
           foreach($detail->find('.col-sm-12') as $li) {
             // dpm( $itm->find('a')[0]->getAttribute('href') );
             foreach ($li->find('a') as $lii) {
               // echo 'href  : '. $j++ . '>  ' . $lii->getAttribute('href') . '</br>';
             
               $href = $lii->getAttribute('href');

               if(!Utils::is_404($href)){
                 $path_parts = pathinfo($href);

                 $ext = pathinfo(
                     parse_url($href, PHP_URL_PATH), 
                     PATHINFO_EXTENSION
                 ); 

                 $filename = \Drupal::service('transliterate_filenames.sanitize_name')->sanitizeFilename($path_parts['filename']);// Utils::clean($path_parts['filename']);

                 $fid = 0;
                 $path = '/opt/drupal/web/sites/default/files/blacklist_seller/' . $filename .'.'.$ext;
                 if (file_exists($path)) {
                   $file = \Drupal::entityTypeManager()->getStorage('file')->loadByProperties(['uri' => 'public://blacklist_seller/' . $filename .'.'.$ext ]);

                   if(empty($file)){
                     unlink($path);
                   }else{
                     $fid = $file[key($file)]->id();
                   }
                 }
                 if(!$fid){
                   $file = file_save_data(file_get_contents($href), 'public://blacklist_seller/'. $filename .'.'.$ext, FileSystemInterface::EXISTS_REPLACE);
                 
                   $fid = $file->id();
                 }

                 $datas['images_fids'][] = array(
                   'target_id' => $fid,
                   'alt' => '',
                   // 'title' => empty($imv['name']) ? '' : $imv['name']
                 );

                 // dpm(Utils::get_file_url($fid));
               }
             }
           }
         }
         
         $datas['id_blacklistseller'] = $i;

         Utils::Syc_Blacklistseller_Save($datas);
         // dpm( $datas );
         $datass[$i] = $datas;

         unset($html);
       }
     }

     dpm( count($datass) );


     ///////////////
  


    
  }

  private static function Syc_Blacklistseller_Save($content){

    // dpm( $content['merchant_bank_account'] );
    $product_type   = empty($content['product_type']) ? "" : trim( $content['product_type'] );        // สินค้า/ประเภท
    $transfer_amount= empty($content['transfer_amount']) ? "" : trim( $content['transfer_amount'] );  // ยอดเงิน
    $person_name    = empty($content['person_name']) ? "" : trim( $content['person_name'] );          // ชื่อบัญชี ผู้รับเงินโอน
    $person_surname = empty($content['person_surname']) ? "" : trim( $content['person_surname'] );    // นามสกุล ผู้รับเงินโอน
    $id_card_number = empty($content['id_card_number']) ? "" : trim( $content['id_card_number'] );    // เลขบัตรประชาชนคนขาย
    $selling_website= empty($content['selling_website']) ? "" : trim( $content['selling_website'] );  // เว็บไซด์ประกาศขายของ
    $transfer_date  = empty($content['transfer_date']) ? "" : trim( $content['transfer_date'] );      // วันโอนเงิน
    $details        = empty($content['details']) ? "" : trim( $content['details'] );                  // รายละเอียดเพิ่มเติม
	  
	  
    if(!empty( $transfer_date )){ 
      /*
      use Drupal\node\Entity\Node;

      $nid = 57037;
      $node = Node::load($nid);

      $time = strtotime('10/16/2003');
      $node->set('field_transfer_date', date('Y-m-d', $time));
      // 'field_transfer_date'     => $transfer_date,   // วันโอนเงิน

      $node->save();
      */
	    
      $transfer_date =   date('Y-m-d',  strtotime($transfer_date));
    }

    // บัญชีธนาคารคนขาย
    $merchant_bank_account_paragraphs =array();
    foreach ($content['merchant_bank_account'] as $ii=>$vv){
      $item_merchant = Paragraph::create([
        'type'                    => 'item_merchant_bank_account',
        'field_bank_account'      => $vv["bank_account"],
        'field_bank_wallet'       => $vv["bank_wallet"], 
      ]);
      $item_merchant->save();
      $merchant_bank_account_paragraphs[] = array('target_id'=> $item_merchant->id(), 'target_revision_id' => $item_merchant->getRevisionId());
    }

    $images_fids                  = $content['images_fids'];            // รูปภาพประกอบ

    $id_blacklistseller = trim($content['id_blacklistseller']); 

    $node = Node::create([
      'type'                   => 'back_list',
      'uid'                    => \Drupal::currentUser()->id(),
      'status'                 => 1,
      'field_channel'          => 32,                // ถูกสร้างผ่านช่องทาง 31: Web, 32: Api

      'title'                  => $product_type,     // สินค้า/ประเภท
      'field_transfer_amount'  => str_replace( ',', '', $transfer_amount ), //$transfer_amount,  // ยอดเงิน
      'field_sales_person_name'=> $person_name,      // ชื่อบัญชี ผู้รับเงินโอน
      'field_sales_person_surname' => $person_surname, // นามสกุล ผู้รับเงินโอน
      'field_id_card_number'    => $id_card_number,  // เลขบัตรประชาชนคนขาย 
      'field_selling_website'   => iconv(mb_detect_encoding($selling_website, mb_detect_order(), true), "UTF-8//TRANSLIT", $selling_website),//$selling_website, // เว็บไซด์ประกาศขายของ
      'field_transfer_date'     => $transfer_date,   // วันโอนเงิน
      'body'                    => $details,         // หมายเหตุ
      'field_merchant_bank_account' => $merchant_bank_account_paragraphs, // บัญชีธนาคารคนขาย
      'field_images'            => $images_fids,      // รูปภาพประกอบ

      'field_from_blacklistseller' => 1, 
      'field_id_blacklistseller'   => $id_blacklistseller
    ]);
    $node->save();
  }
}
