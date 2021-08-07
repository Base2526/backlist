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

/**
 * Controller routines for page example routes.
 */
class LoginForm extends FormBase {
  /**
   * {@inheritdoc}
   */

   /**
   * Class constructor.
   */
  public function __construct() {
    $this->language = \Drupal::languageManager()->getCurrentLanguage()->getId();

    // $global_config = \Drupal\config_pages\Entity\ConfigPages::config('global_config');
    // if(isset( $global_config )){
    //     $this->is_debug =  $global_config->get('field_is_debug')->value;
    // }
  }

  public function getFormId() {
    return 'login_form';
  }

    /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#tree'] = TRUE;

    $form['header'] = array(
      '#type'     => 'item',
      '#markup'   => '',
      '#prefix'   => '<div class="account-login-box">
                        <div class="row">
                          <div class="page-title">
                            <img class="logo" src="/sites/default/modules/customs/bigcard/images/bigcard-account-new.png" alt="logo">
                            <h1>' . $this->t('Onling BigCard member or login') . '</h1>
                          </div>
                        </div>
                        <div class="row col2-set">',
      '#suffix'   => ''
    );

    // ----------------------------- login ----------------------------------
    $form['login_header'] = array(
      '#type'     => 'item',
      '#markup'   => '',
      '#prefix'   => '<div id="user-login-form" class="col-lg-6 col-md-6 col-sm-12 col-12 loginDiv">
                        <div class="block-title">
                          <div class="main-title">
                              <h2>' . $this->t('Login') . '</h2>
                              <div class="line-bottom">&nbsp;</div>
                          </div>
                        </div>
                        <p>' . $this->t('For those who already have an account with online BigCard') . '</p>',
      '#suffix'   => ''
    );
      
    $form['username'] = array(
        '#type' => 'textfield',
        '#title' => $this->t('Account name') . '<span class="requiredField"> *</span>',
        // '#attributes' => array('placeholder' => t('ชื่อบัญชี')),
        '#description' => t(''),
        // '#default_value' => $name,
        '#size' => 25,
        '#suffix' => '<div class="fs-xxs fw-400">' . $this->t('BigCard number identification card number / passport number Thai telephone number') . '</div>'
    );

    $form['password'] = array(
      '#type' => 'password',
      // '#title' => t(''),
      // '#attributes' => array('placeholder' => t('รหัสผ่าน')),
      // '#description' => t('***Enter the password that accompanies your username.'),
      '#size' => 25,
      '#description' => t(''),
      '#prefix'   => '<div><div>'. $this->t('Password') .' <a id="forgot-password-link" class="fs-xxs" href="/customer/account/forgotpassword">'. $this->t('Forgot your password?') .'</a>',
      '#suffix' => '</div><div id="login-fail-description"></div></div>'
    );

    $form['login'] = array(
        '#type' => 'submit',
        '#name' => 'login',
        '#value' => $this->t('Login'),
        '#submit' => ['::submitAjax'],
        '#ajax' => [
          'callback' => '::callbackAjax',
          'wrapper' => 'user-login-form',
          'progress' => array(
              // Graphic shown to indicate ajax. Options: 'throbber' (default), 'bar'.
              'type' => 'fullscreen',
              // Message to show along progress graphic. Default: 'Please wait...'.
              'message' => NULL,
          ),
        ],
        '#prefix'   => '',
        '#suffix'   => ''
    );

    $form['login_footer'] = array(
      '#type'     => 'item',
      '#markup'   => '',
      '#prefix'   => '',
      '#suffix'   => '</div>'
    );

    // ----------------------------------- end login ---------------------------------

    // ----------------------------------- register ----------------------------------


    $form['register_header'] = array(
      '#type'     => 'item',
      '#markup'   => '',
      '#prefix'   => '<div id="user-register-form" class="col-lg-6 col-md-6 col-sm-12 col-12 loginDiv">
                        <div class="block-title pt-5">
                          <div class="main-title">
                              <h2>' . $this->t('Apply for BigCard') . ' /<br>' . $this->t('First register online') . '</h2>
                              <div class="line-bottom">&nbsp;</div>
                          </div>
                      </div>',
      '#suffix'   => ''
    );

    $form['register'] = array(
      '#type' => 'submit',
      '#name' => 'Register',
      '#value' => t('Register'),
      '#limit_validation_errors' => array(), //  ไม่  verify field
      '#submit' => array([$this, 'redirect_check_card']),
      '#prefix'   => '',
      '#suffix'   => ''
    );

    $form['register_footer'] = array(
      '#type'     => 'markup',
      '#markup'   => '',
      '#prefix'   => '',
      '#suffix'   => '</div>'
    );

    // -------------------------- end register ---------------------------------

    $form['footer'] = array(
      '#type'     => 'markup',
      '#markup'   => '',
      '#prefix'   => '',
      '#suffix'   => '</div></div>'
    );

    return $form;
  }

  public function submitAjax(array &$form, FormStateInterface $form_state) {
    // drupal_set_message("s1confirm_form_submit.");
  }

  public function callbackAjax(array &$form, FormStateInterface $form_state) {
    $ajax_response = new AjaxResponse();
    $pass = TRUE;
    $focus_field = '';

    $text_description = $this->t('Required field');
    $css_input = array(
      'border' => '1px dashed #eb340a',
      'background-color' => '#faebe7',
    );
    $css_description = array(
      'color' => 'red',
      'font-size' => '16px'
    );
    $css_clear = array(
      'border' => '1px solid #ced4da',
      'background-color' => 'transparent'
    );

    // reset all field
    $selector_input = '#edit-username';
    $ajax_response->addCommand(new CssCommand($selector_input, $css_clear));
    $selector_description = '#edit-username--description';
    $ajax_response->addCommand(new HtmlCommand($selector_description, ''));

    $selector_input = '#edit-password';
    $ajax_response->addCommand(new CssCommand($selector_input, $css_clear));
    $selector_description = '#edit-password--description';
    $ajax_response->addCommand(new HtmlCommand($selector_description, ''));
    // --------------------------------------------

    $username = $form_state->getUserInput()['username'];
    $password = $form_state->getUserInput()['password'];

    if(empty($username)){
      $pass = FALSE;
      $selector_input = '#edit-username';
      $ajax_response->addCommand(new CssCommand($selector_input, $css_input));

      if(empty($focus_field)){
        $focus_field = $selector_input;
        $ajax_response->addCommand(new InvokeCommand($selector_input, 'focus'));
      }

      $selector_description = '#edit-username--description';
      $text_description = $this->t('Required field');
      $ajax_response->addCommand(new HtmlCommand($selector_description, $text_description));
      $ajax_response->addCommand(new CssCommand($selector_description, $css_description));
    }

    if(empty($password)){
      $pass = FALSE;
      $selector_input = '#edit-password';
      $ajax_response->addCommand(new CssCommand($selector_input, $css_input));

      if(empty($focus_field)){
        $focus_field = $selector_input;
        $ajax_response->addCommand(new InvokeCommand($selector_input, 'focus'));
      }

      $selector_description = '#edit-password--description';
      $text_description = $this->t('Required field');
      $ajax_response->addCommand(new HtmlCommand($selector_description, $text_description));
      $ajax_response->addCommand(new CssCommand($selector_description, $css_description));
    }

    if($pass){
      $data_obj = [
        "username" => $username, 
        "password" => $password
      ];
      $login_result = Utils::login_api($data_obj);

      if($login_result == 'success'){
        $url = Url::fromRoute('my_bigcard.form');
        $command = new RedirectCommand($url->toString());
        $ajax_response->addCommand($command);
      }else{
        $selector_description = '#login-fail-description';
        $text_description = $this->t('Account name or Password wrong.');
        $ajax_response->addCommand(new HtmlCommand($selector_description, $text_description));
      }
    }
    return $ajax_response;
  }

  /**
  * {@inheritdoc}
  */
  public function validateForm(array &$form, FormStateInterface $form_state) {
      parent::validateForm($form, $form_state);

      // $name = $form_state->getValue('name');
      // if (empty(trim($name))){
      //     $form_state->setErrorByName('name', $this->t('Enter your Credit sales Approval username.'));
      // }

      // $pass = $form_state->getValue('pass');
      // if (empty(trim($pass))){
      //     $form_state->setErrorByName('pass', $this->t('Enter the password that accompanies your username.'));
      // }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // $session = \Drupal::request()->getSession();
    // $field= $form_state->getValues();
    // $session->set('name', $field['name']);

    // $form_state->set('name',  $field['name']);

    /*
    $result =  MainPageController::login_ldap($field['name'], $field['pass']);    
    if($result['status']){
      $uid = \Drupal::service('user.auth')->authenticate($field['name'], $field['name']);

      \Drupal::logger('credit_sales_approval')->notice('login_form > uid : %uid, name : %name.', array('%uid' => $uid, '%name' => $field['name']));
      if($uid){
        $user = \Drupal\user\Entity\User::load($uid);
        user_login_finalize($user);

        $user_destination = \Drupal::destination()->get();
        $response = new RedirectResponse($user_destination);

        $response->send();
      }else{
        \Drupal::messenger()->addMessage(t('ไม่สามารถเข้าระบบได้เนื่องจาก ID : '. $field['name'] .' นี้ไม่ลงทะเบียนกับ Credit sales Approval.'), 'error');
      }
    }else{
      \Drupal::messenger()->addMessage(t($result['message']), 'error');
    }
    */
  }

  function redirect_check_card(array &$form, FormStateInterface $form_state){
    // $nid                = $form['nid']['#value'];       
    $response = new RedirectResponse("/" . $this->language . "/new_member/step1/normal");
    $response->send();
  }

}
