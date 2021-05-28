import React, { Component } from 'react';
import { Redirect, Link} from 'react-router-dom';
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import { Base64 } from 'js-base64';
// import FacebookLoginWithButton from 'react-facebook-login';

import { headers, isEmpty } from '../Utils/Config';
import { userLogin } from '../../actions/auth'
import {  loadingOverlayActive, 
          updateLotterys,
          updateHuayListBank,
          updateTransferMethod,
          updateContactUs,
          updateListBank,
          updateDepositStatus } from '../../actions/huay'

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      email: '',
      password: '',
      remember: false,

      is_active:false,
      loading_text: '',

      error: false,
      error_message:'',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.responseFacebook = this.responseFacebook.bind(this);
  }

  componentDidMount(){
    let local_storage_login =localStorage.getItem('login');
    if(!isEmpty(local_storage_login)){
      let local_decode =  JSON.parse(Base64.decode(local_storage_login));      
      this.setState({ email: local_decode.e,
                      password: Base64.decode(Base64.decode(local_decode.p)),
                      remember: true});
    }
  }

  handleChange(event) {
    if(event.target.id == 'remember'){
      this.setState({[event.target.id]: event.target.checked});
    }else{
      this.setState({[event.target.id]: event.target.value});
    }
  }    

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({validated: true});
    }else{

      let { email, password, remember} = this.state;   

      console.log(email, password, remember);

      if(remember){
        localStorage.setItem('login', Base64.encode(JSON.stringify({'e':email, 'p':Base64.encode(Base64.encode(password)), 'r':remember})));
      }else{
        localStorage.removeItem('login');
      }

      this.setState({is_active:true, loading_text:'รอสักครู่'})

      // let { email, password } = this.state;   
      let response  = await axios.post('/api/login', 
                                      {name: email, pass: password}, 
                                      {headers:headers()});

      this.setState({ is_active:false })
      console.log(response);
      if( response.status==200 && response.statusText == "OK" ){
        if(response.data.result){
          let { user, 
                lotterys,
                huay_list_bank,
                transfer_method, 
                contact_us,
                list_bank,
                deposit_status} = response.data;

          let {
            userLogin, 
            updateLotterys,
            updateHuayListBank,
            updateTransferMethod,
            updateContactUs,
            updateListBank,
            updateDepositStatus
          } = this.props

          userLogin(user);
          updateLotterys(lotterys);
          updateHuayListBank(huay_list_bank);
          updateTransferMethod(transfer_method);
          updateContactUs(contact_us);
          updateListBank(list_bank);
          updateDepositStatus(deposit_status);

          var new_headers = headers();
          new_headers.authorization = user.session;
          new_headers.uid = user.uid;

          localStorage.removeItem('headers');
          localStorage.setItem('headers', Base64.encode(Base64.encode( JSON.stringify(new_headers) )));

          // let de_password = Base64.decode(Base64.decode( en_headers ));
          // console.log(JSON.parse(de_password));
        }else{
          this.setState({
            error: true,
            error_message: response.data.message,
            password:''
          });
        }
      }else if( response.status==403 ){
        this.setState({
          error: true,
          error_message: '',
          password:''
        });
      }
    } 
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  loadingOverlayActive(){
    let {is_active, loading_text} = this.state
    this.props.loadingOverlayActive(is_active, loading_text);
  }

  responseFacebook=(response)=>{
    console.log(response);
    switch(response.status){
      case 'unknown':{
        console.log(response.status);
        break;
      }

      default:{
          /*
        {
          accessToken : "EAAZAEjir4YTIBAJC1fex5LolFLPtmEaPX83ZCYflyAqgYpB2XjLrF3J0tUks5Qfdf0Vzx9vOo7Axs318ouydqVW0hp2I83WCC2XrMgARM7Tr1fUCZBg0D6idZBzhHmgZBE3H8x4WNn09nZCt34kgSXwpQg3wWrZAo2z3YXyqBQOfSTLk05djIQZC",
          data_access_expiration_time: 1603366594,
          expiresIn : 5184000,
          graphDomain: "facebook",
          id: "2807364352701967",
          name: "AThe Station",
          signedRequest: "6paWfytptAf5THx4dCKEVpyQ7mVv5rxKoboXj15eeFE.eyJ1c2VyX2lkIjoiMjgwNzM2NDM1MjcwMTk2NyIsImNvZGUiOiJBUUM0d2xoVDhMQ2xUYzZUa19hMDk0eTBPamhuRjRacV8tUHhSelluVHJCcW1IQzVXSjB5d3FoZG9RNXBwcW5ybVJKaWczVmpVV21fUmlIb1RRZ1hqS1kyV09WVnNZRDhZbDl2Ykx1Rl9wVzR5enloR1ZpWmdwQVZ2ZUZIM3ExSnVYRDU1dzFDOFVkcHp2cUJ0MWN5VjBXYWFWNkJuRTJlTlo4Sm1mOG9DUXdjZnQ1ZHZLbkJrTFI1T2U0dktjTEUtSngyYjZpdS1BR01DSWJNQjB5a2JTRUtJOHB2QUpHazktU3hsQmlTTzVOWmp6cUxULTB3dFFQVXNXTkd0b3F2Tjgza1RHbFZadTdhdUN0OE1tYmY0WjVDd0lDSnNqRVJLQndGOHNnSE51OW42VEtaRWpGLTBjSnBvZnQyVTNRWEptbi1idHY1Sm5peW42YmFLWVNualRaRVYyV05RX29HRkk5blRYUlF1TmlkUUEiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTU5NTU5MDU5NH0",
          userID: "2807364352701967"
          }
        */
        console.log(response.status);
        break;
      }
    }
  }

  render(){
    let {validated, email, password, error, error_message} = this.state;
    let {logged_in} = this.props;

    this.loadingOverlayActive();

    if(logged_in){
      return <Redirect to="/" />
    }

    return( <Form noValidate validated={validated} onSubmit={this.handleSubmit}>   
              { error ? <Alert variant={'danger'}>{error_message}</Alert> : '' }
              <Form.Group controlId="email">
                <Form.Label>อีเมลล์</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="ชื่อผู้ใช้งาน หรือ อีเมลล์" 
                  required 
                  value={email} onChange={this.handleChange}/>
                <Form.Control.Feedback type="invalid">
                    กรุณากรอบอีเมลล์ หรือ invalid email address.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="รหัสผ่าน" 
                  required
                  value={password} onChange={this.handleChange}/>
                <Form.Control.Feedback type="invalid">
                    กรุณากรอบรหัสผ่าน.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="remember">
                <Form.Check 
                  type="checkbox" 
                  label="จำฉันไว้ในระบบ"
                  checked={this.state.remember}
                  onChange={this.handleChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
                เข้าสู่ระบบ
              </Button>
              <Button variant="light" onClick={()=>this.nextPath('/forget-password')}>ลืมรหัสผ่าน</Button>

              {/* <FacebookLoginWithButton
                appId="1764227257229618"
                // autoLoad
                callback={this.responseFacebook}
                icon="fa-facebook"/> */}
            </Form>
    );
  }
};

/*
	จะเป็น function ที่จะถูกเรียกตลอดเมือ ข้อมูลเปลี่ยนแปลง
	เราสามารถดึงข้อมูลทั้งหมดที่อยู่ใน redux ได้เลย
*/
const mapStateToProps = (state, ownProps) => {
	if(!state._persist.rehydrated){
		return {};
  }
  
  if(state.auth.isLoggedIn){
    return { logged_in: true };
  }else{
    return { logged_in: false };
  }
}

/*
	การที่เราจะเรียก function ที่อยู่ใน actions ได้
	การใช้
	แบบที่ 1.
	const mapDispatchToProps = (dispatch) => {
		return {
			function1: (id) => {
								// function ที่อยู่ใน actions
								dispatch(addTodo(param1))
							},
			function2: (id, val) => {
								// function ที่อยู่ใน actions
								dispatch(addTodo(param1, param2))
							},

		}
	}

	export default connect(null, mapDispatchToProps)(function)

	แบบที่ 2.
	export default connect(null, { doFunction1, doFunction2 })(function)

	การเรียกใช้
	แบบที่ 1 
	this.props.addTodo(param1, param2);

	แบบที่ 2
	let {function1, function2} = this.props;
*/
const mapDispatchToProps = (dispatch) => {
	return {
    userLogin: (data) =>{
      dispatch(userLogin(data))
    },
    loadingOverlayActive: (data) =>{
      dispatch(loadingOverlayActive(data))
    },
    updateHuayListBank: (data) =>{
      dispatch(updateHuayListBank(data))
    },
    updateTransferMethod: (data) =>{
      dispatch(updateTransferMethod(data))
    },
    updateContactUs: (data) =>{
      dispatch(updateContactUs(data))
    },
    updateListBank:  (data) =>{
      dispatch(updateListBank(data))
    },
    updateLotterys: (data)=>{
      dispatch(updateLotterys(data))
    },
    updateDepositStatus: (data)=>{
      dispatch(updateDepositStatus(data))
    },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)