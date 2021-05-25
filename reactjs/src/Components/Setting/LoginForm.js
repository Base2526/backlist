import React, { Component, isValidElement, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isEmpty } from "lodash";

import { isEmailValid, uniqueId } from "../Utils/Utils"
import PasswordField from "../Fields/PasswordField";
import { userLogin, ___followUp,fetchMyApps, addfollowerPost } from '../../actions/user';

const LoginForm = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState("login");
  const [showModal, setShowModal] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [loadingEP, setLoadingEP] = React.useState(false);
  const [loadingFacebook, setLoadingFacebook] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);

  useEffect(() => {
    setShowModal(props.showModal)
  });

  const contentBody = () =>{
    let message_error = <div />
    if(error){
      message_error = <div className="alert alert-danger alert-sm">
                        <button 
                          type="button" 
                          className="close" 
                          data-dismiss="alert" 
                          aria-hidden="true" 
                          onClick={()=>{
                            setError(false);
                            setErrorMessages([]);
                          }}>×</button>
                        <span className="fw-semi-bold">Error:</span> {errorMessages.map((item, index)=>{ return (index ? ', ' : '') +  item } )}
                      </div> 
    }

    switch(mode){
      case 'login':{
        return (
          <div>
              <form className="form-horizontal form-loanable">
                {/* <div className="alert alert-danger alert-sm">
                  <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                  <span className="fw-semi-bold">Error:</span> Login failed.
                </div> */}
                {message_error}
                <fieldset>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">Username or email</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                        type="text"
                        name="email"
                        id="login-email"
                        className="form-control"
                        placeholder="Enter username or email"
                        value={email}
                        onChange={(e)=>{
                          setEmail(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group has-feedback required">
                    <PasswordField 
                      label="Password"
                      placeholder="*****"
                      value={password}  
                      onChange={(e)=>{ setPassword(e.target.value) }}/>
                  </div>
                  <div className="col-sm-12">
                    <a href="#" onClick={e => { e.preventDefault(); setMode("forgot");  }}> Forgot Password</a>|
                    <a href="#" onClick={e => { e.preventDefault(); setMode("register");  }}> Create your account</a>
                  </div>
                </fieldset>
                <div className="form-action" class="col-sm-12">
                  <button
                    type="submit"
                    disabled={loadingEP}
                    className="btn btn-lg btn-primary btn-left">Enter <span className="icon-arrow-right2 outlined"></span>
                    {
                      loadingEP && <CircularProgress size={20}/>
                    }
                  </button>
    
                  <GoogleLogin
                    clientId="693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  />
    
                  <FacebookLogin
                    appId="1088597931155576"
                    // autoLoad={true}
                    fields="name,email,picture"
                    onClick={()=>{
                      clickedFacebook()
                    }}
                    callback={(response)=>{
                      this.responseFacebook(response)
                    }} />
                </div>
              </form>
           
          </div>
        );
      }

      case 'register':{
        return (
          <div>
            <div>
              <form className="form-horizontal form-loanable">
                {message_error}
                <fieldset>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">Username or email</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                        type="text"
                        name="email"
                        id="login-email"
                        className="form-control"
                        placeholder="Enter username or email"
                        value={email}
                        onChange={(e)=>{
                          setEmail(e.target.value)
                        }}
                      />
                    </div>
                    { /* console.log('error email ::: ' + JSON.stringify(errors)) */}
                  </div>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-password" className="col-sm-5">Password</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <div className="login-password-wrapper">
                        <input
                          type="password"
                          name="password"
                          id="login-password"
                          className="form-control"
                          placeholder="*****"
                          value={password}
                          onChange={(e)=>{
                            setPassword(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
                <div className="form-action" className="col-sm-12">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary btn-left">Enter <span className="icon-arrow-right2 outlined"></span></button>
                </div>
              </form>
            
            </div>
            <div className="col-sm-12">
              <a href="#"
                onClick={e => {
                  e.preventDefault();
    
                  setMode("login")
                }}>Log in here</a>
            </div>
          </div>
        );
        break;
      }

      case 'forgot':{
        return(
          <div>
            <form className="form-horizontal form-loanable">
              {message_error}
              <div className="col-sm-12">
                <span className="form-control-feedback" aria-hidden="true"></span>
                <input
                  type="text"
                  name="email"
                  id="login-email"
                  className="form-control"
                  placeholder="Enter username or email"
                  // onChange={this.onChange}
                  // value={this.state.email}
                  value={email}
                  onChange={(e)=>{
                    // this.setState({ email: e.target.value });
    
                    setEmail(e.target.value)
                  }}
                  // required
                />
            </div>
              <div className="form-action" className="col-sm-12">
                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-left">Send</button>
              </div>
              <div className="col-sm-12">
                <a href="#" onClick={e => { e.preventDefault(); setMode("login"); }}> Back to login </a>
              </div>
            </form>
          </div>
        );
      }
    }
  }


  const handleFormSubmit = (formSubmitEvent) => {
    console.log("handleFormSubmit mode : ", mode);
    formSubmitEvent.preventDefault();
  
    let _email = email.trim()
    let _password = password.trim()

    if(isEmpty(_email) && isEmpty(_password)){
      console.log("isEmpty : email, password")
      this.setState({error: true, errorMessages: ["Email & password is empty."]})
    }else if(isEmpty(_email)){
      this.setState({error: true, errorMessages: ["Email is empty."]})
    }else if(isEmpty(_password)){
      this.setState({error: true, errorMessages: ["Password is empty."]})
    }else if(!isEmailValid(_email)){
      this.setState({error: true, errorMessages: ["Email is Invalid."]})
    }else {

      // this.setState({loadingEP:true})

      axios.post(`/api/login?_format=json`, {
        name: _email, 
        password: _password, 
        unique_id: uniqueId()
      })
      .then(function (response) {
        let results = response.data

        let { userLogin,
              ___followUp,
              fetchMyApps,
              addfollowerPost} = props

        if(results.result === true){ 
          userLogin(results.user)

          props.onClose()

          // console.log("results.user > ", results.user)

          toast.info(`Welcome to banlist.info`, 
                                  {
                                    position: "bottom-right", 
                                    hideProgressBar: true,
                                    autoClose: 3000,
                                  }) 
        }

        console.log('/api/login > results : ', results)
      })
      .catch(function (error) {

        console.log(error)
        // _this.setState({spinner: false})
      });

      // var intervalId = setInterval(()=>{

      //   console.log("--> 1000")

      //   this.props.onClose()
      //   console.log("--> 1000 9")
      // }, 5000);
    }
  
  }

  /*
    let { navigation, route } = this.props;
    let { name, password } = this.state
    name = name.trim()
    password = password.trim()

    if( isEmpty(name) && isEmpty(password) ){
      this.toast.show('email && password empty');
    }else if( isEmpty(name) ) {
      this.toast.show('email empty');
    }else if( isEmpty(password) ) {
      this.toast.show('password empty');
    }else if( !ValidateEmail(name) ){
      this.toast.show('email invalidate.');
    }else{

      this.setState({spinner: true})

      console.log('> /api/login?')

      let _this = this
      axios.post(`${API_URL}/api/login?_format=json`, {
        name, password, unique_id: getUniqueId()
      })
      .then(function (response) {
        let results = response.data
        console.log('/api/login : ', results, results.result)
        
        // 
        // console.log('cccc : ', typeof results.result);
        if(results.result === true){ 
          _this.props.userLogin(results.user)
          // _this.props.followUp( isEmpty(results.follow_ups) ? results.follow_ups : JSON.parse(results.follow_ups)) // follow_ups
          
          _this.props.___followUp( isEmpty(results.follow_ups) ? results.follow_ups : JSON.parse(results.follow_ups), 1)
          _this.props.fetchMyApps(results.user.basic_auth)
          _this.props.addfollowerPost( isEmpty(results.follower_post) ? results.follower_post : JSON.parse(results.follower_post))

          _this.setState({spinner: false}) 
          navigation.pop();

          route.params.updateState({ showModalLogin: false });
        }else{
          _this.toast.show(results.message);
          _this.setState({spinner: false})
        }
      })
      .catch(function (error) {

        console.log(error)
        _this.setState({spinner: false})
      });
    }
  */

  const  responseGoogle = (response) => {
    console.log("responseGoogle :", response);
  }

  const responseFacebook = (response) => {
    console.log("responseFacebook :", response);
  }

  const clickedFacebook = () =>{
    console.log("clickedFacebook");
  }

  return (
    <div>
      <Modal
        show={showModal}
        onHide={props.onClose}
        onSubmit={handleFormSubmit}
        //   bsSize="large"
        backdrop="static">
        <Modal.Header closeButton={true}>
          <h2>{ mode === "login" ? "Login" : mode === "register" ? "Register" : "Forgot Password" }</h2>
        </Modal.Header>
        <Modal.Body>
          {/* {mode === "login" ? (renderLogin()) : mode === "register" ? (renderRegister()) : (renderForgot())} */}

          {contentBody()}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={this.props.onClose}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  )
};

// userLogin, ___followUp, fetchMyApps, addfollowerPost
  
// export default LoginForm;

const mapStateToProps = (state, ownProps) => {
	return {
    user: state.user.data,
    data: state.app.data,
  };
}

const mapDispatchToProps = {
  userLogin,
  ___followUp,
  fetchMyApps,
  addfollowerPost
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
