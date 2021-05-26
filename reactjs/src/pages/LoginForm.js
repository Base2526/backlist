import React, { Component, isValidElement, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isEmailValid, uniqueId, onToast, isEmpty } from "../utils"
import PasswordField from "../components/PasswordField";
import { userLogin, ___followUp,fetchMyApps, addfollowerPost } from '../actions/user';

const LoginForm = (props) => {
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState("login");
  const [showModal, setShowModal] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loadingFacebook, setLoadingFacebook] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);

  const [registerLoading, setRegisterLoading] = React.useState(false);
  const [forgotLoading, setForgotLoading] = React.useState(false);

  // loadingEP
  // const [updateLoading, setUpdateLoading] = React.useState(false);

  useEffect(() => {
    setShowModal(props.showModal)
  });

  const contentBody = () =>{
    switch(mode){
      case 'login':{
        return (
          <div>
              <form className="form-horizontal form-loanable">
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
                    <a href="#" onClick={e => { e.preventDefault(); setMode("forgot");  }}> Forgot password</a>|
                    <a href="#" onClick={e => { e.preventDefault(); setMode("register");  }}> Create new account</a>
                  </div>
                </fieldset>
                <div className="form-action" class="col-sm-12">
                  <button
                    type="submit"
                    disabled={ (isEmpty(email) && isEmpty(password)) ? true: false }
                    className={"div-button"} >Login
                    { loginLoading && <CircularProgress size={15}/> }
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
                <fieldset>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">Display name</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Enter display name"
                        value={email}
                        onChange={(e)=>{
                          setDisplayName(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">Email address</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e)=>{
                          setEmail(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-password" className="col-sm-5">Password</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <div className="login-password-wrapper">
                        <input
                          type="password"
                          name="password"
                          id="password"
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
                    disabled={ (isEmpty(displayName) && isEmpty(email) && isEmpty(password)) ? true: false }
                    className={"div-button"} >Register 
                    { registerLoading && <CircularProgress size={15}/> }
                    </button>
                </div>
              </form>
            </div>
            <div className="col-sm-12">
              <span 
                style={{cursor:'pointer'}} 
                className={"span-border-bottom "}
                onClick={ (e) => {
                  setMode("login")
                }} >
                Back to login
              </span>
            </div>
          </div>
        );
      }

      case 'forgot':{
        return(
          <div>
            <form className="form-horizontal form-loanable">
              <div className="col-sm-12">
                <span className="form-control-feedback" aria-hidden="true">Email address</span>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}
                />
            </div>
              <div className="form-action" className="col-sm-12">
                <button
                  type="submit"
                  disabled={ isEmpty(email) ? true: false }
                  className={"div-button"} >Send 
                  { forgotLoading && <CircularProgress size={15}/> }
                </button>
              </div>
              <div className="col-sm-12">
                <span 
                style={{cursor:'pointer'}} 
                className={"span-border-bottom "}
                onClick={ (e) => {
                  setMode("login")
                }} >
                Back to login
              </span>
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

    switch(mode){
      case 'login':{
        let _email = email.trim()
        let _password = password.trim()
    
        if(isEmpty(_email) && isEmpty(_password)){
          onToast("error", "Email & password is empty.")
        }else if(isEmpty(_email)){
          onToast("error", "Email is empty.")
        }else if(isEmpty(_password)){
          onToast("error", "Password is empty.")
        }else if(!isEmailValid(_email)){
          onToast("error", "Email is Invalid.")
        }else {
          setLoginLoading(true)
          axios.post(`/api/login?_format=json`, {
            name: _email, 
            password: _password, 
            unique_id: uniqueId()
          })
          .then((response) => {
            let results = response.data
    
            let { userLogin,
                  ___followUp,
                  fetchMyApps,
                  addfollowerPost} = props
    
            if(results.result === true){ 
              userLogin(results.user)
    
              props.onClose()
    
              onToast("info", `Welcome to banlist.info`)
            }else{
              onToast("error", results.message)
            }
    
            setLoginLoading(false)
    
            console.log('/api/login > results : ', results)
          })
          .catch((error)=>{
            onToast("error", error)
            setLoginLoading(false)
          });
        }

        break;
      }

      case 'register':{
        let _displayName = displayName.trim()
        let _email = email.trim()
        let _password = password.trim()
    
        if(isEmpty(_displayName) && isEmpty(_email) && isEmpty(_password)){
          onToast("error", "Display name & Email & password is empty.")
        }else if(isEmpty(_displayName)){
          onToast("error", "Display name is empty.")
        }else if(isEmpty(_email)){
          onToast("error", "Email is empty.")
        }else if(isEmpty(_password)){
          onToast("error", "Password is empty.")
        }else if(!isEmailValid(_email)){
          onToast("error", "Email is Invalid.")
        }else {
          props.onClose()
        
          setRegisterLoading(true)
          axios.post(`/api/register?_format=json`, {
            type: 0,
            name: _displayName,
            email: _email, 
            password: _password,
          })
          .then((response) => {
            let results = response.data
            if(results.result === true){ 
              onToast("info", `Please check email.`)
            }else{
              onToast("error", results.message)
            }

            props.onClose()
    
            setRegisterLoading(false)
    
            console.log('/api/register > results : ', results)
          })
          .catch((error)=>{
            onToast("error", error)
            setRegisterLoading(false)
          });
        
        }
        break;
      }

      case 'forgot':{
        let _email = email.trim()
        if(isEmpty(_email)){
          onToast("error", "Email is empty.")
        }else if(!isEmailValid(_email)){
          onToast("error", "Email is Invalid.")
        }else {

          setForgotLoading(true)
          axios.post(`/api/reset_password?_format=json`, {
            email: _email
          })
          .then((response) => {
            let results = response.data
            if(results.result === true){ 
              onToast("info", `Please check email.`)
            }else{
              onToast("error", results.message)
            }

            props.onClose()
    
            setForgotLoading(false)
          })
          .catch((error)=>{
            onToast("error", error)
            setForgotLoading(false)
          });
        }
        break;
      }
    }

   
  }

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
          <h2>{ mode === "login" ? "Login" : mode === "register" ? "Create new account" : "Forgot password" }</h2>
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
