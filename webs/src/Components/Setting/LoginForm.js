import React, { Component, isValidElement, useEffect, useRef } from "react";
import {
  Navbar,
  NavDropdown,
  MenuItem,
  NavItem,
  Nav,
  Popover,
  Tooltip,
  Button,
  Modal,
  OverlayTrigger
} from "react-bootstrap";
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { CircularProgress } from '@material-ui/core';

import { isEmpty } from "lodash";
import { isEmailValid } from "../Utils/Utils"

// class LoginForm extends Component {
//   constructor() {
//     super();
//     this.state = {
//       showModal: false,
//       email: "",
//       password: "",
//       mode: "login",

//       error: false,
//       errorMessages:[],

//       loadingEP:false,
//       loadingFacebook:false,
//       loadingGoogle:false,
//     };
//   }

//   componentDidMount(){
//     console.log('componentDidMount >>>>>>', this.props.mode)
//   }

//   componentWillUnmount(){
//     console.log('componentWillUnmount')
//   }

//   componentWillReceiveProps(nextProps){
//     console.log('componentWillReceiveProps')
//   }


//   setMode = mode => {
//     this.setState({
//       mode
//     });
//   }

//   renderForgot = () => {

//     let {error, errorMessages, loadingEP} = this.state
//     let message_error = <div />
//     if(error){
//       message_error = <div className="alert alert-danger alert-sm">
//                         <button 
//                           type="button" 
//                           className="close" 
//                           data-dismiss="alert" 
//                           aria-hidden="true" 
//                           onClick={()=>{
//                             this.setState({error:false, errorMessages:[]})
//                           }}>×</button>
//                         <span className="fw-semi-bold">Error:</span> {errorMessages.map((item, index)=>{ return (index ? ', ' : '') +  item } )}
//                       </div> 
//     }

//     return(
//       <div>
//         <form className="form-horizontal form-loanable">
//           {message_error}
//           <div className="col-sm-12">
//             <span className="form-control-feedback" aria-hidden="true"></span>
//             <input
//               type="text"
//               name="email"
//               id="login-email"
//               className="form-control"
//               placeholder="Enter username or email"
//               // onChange={this.onChange}
//               // value={this.state.email}
//               value={this.state.email}
//               onChange={(e)=>{
//                 this.setState({ email: e.target.value });
//               }}
//               // required
//             />
//         </div>
//           <div className="form-action" className="col-sm-12">
//             <button
//               type="submit"
//               className="btn btn-lg btn-primary btn-left">Send</button>
//           </div>
//           <div className="col-sm-12">
//             <a href="#" onClick={e => { e.preventDefault(); this.setMode("login"); }}> Back to login </a>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   renderRegister = () => {

//     let {error, errorMessages, loadingEP} = this.state
//     let message_error = <div />
//     if(error){
//       message_error = <div className="alert alert-danger alert-sm">
//                         <button 
//                           type="button" 
//                           className="close" 
//                           data-dismiss="alert" 
//                           aria-hidden="true" 
//                           onClick={()=>{
//                             this.setState({error:false, errorMessages:[]})
//                           }}>×</button>
//                         <span className="fw-semi-bold">Error:</span> {errorMessages.map((item, index)=>{ return (index ? ', ' : '') +  item } )}
//                       </div> 
//     }

//     return (
//       <div>
//         <div>
//           <form className="form-horizontal form-loanable">
//             {message_error}
//             <fieldset>
//               <div className="form-group has-feedback required">
//                 <label htmlFor="login-email" className="col-sm-5">Username or email</label>
//                 <div className="col-sm-12">
//                   <span className="form-control-feedback" aria-hidden="true"></span>
//                   <input
//                     type="text"
//                     name="email"
//                     id="login-email"
//                     className="form-control"
//                     placeholder="Enter username or email"
//                     value={this.state.email}
//                     onChange={(e)=>{
//                       this.setState({ email: e.target.value });
//                       // this.setState({email: })

//                       // console.log(e.target.value)
//                     }}
//                   />
//                 </div>
//                 { /* console.log('error email ::: ' + JSON.stringify(errors)) */}
//               </div>
//               <div className="form-group has-feedback required">
//                 <label htmlFor="login-password" className="col-sm-5">Password</label>
//                 <div className="col-sm-12">
//                   <span className="form-control-feedback" aria-hidden="true"></span>
//                   <div className="login-password-wrapper">
//                     <input
//                       type="password"
//                       name="password"
//                       id="login-password"
//                       className="form-control"
//                       placeholder="*****"
//                       // required
//                       onChange={this.onChange}
//                     />
                    
//                   </div>
//                 </div>
//               </div>
//             </fieldset>
//             <div className="form-action" className="col-sm-12">
//               <button
//                 type="submit"
//                 className="btn btn-lg btn-primary btn-left">Enter <span className="icon-arrow-right2 outlined"></span></button>
//             </div>
//           </form>
        
//         </div>
//         <div className="col-sm-12">
//           <a href="#"
//             onClick={e => {
//               e.preventDefault();
//               this.setMode("login");
//             }}>Log in here</a>
//         </div>
//       </div>
//     );
//   }

//   responseGoogle = (response) => {
//     console.log("responseGoogle :", response);
//   }

//   responseFacebook = (response) => {
//     console.log("responseFacebook :", response);
//   }

//   clickedFacebook = () =>{
//     console.log("clickedFacebook");
//   }

//   renderLogin = () => {
//     let {error, errorMessages, loadingEP} = this.state
//     let message_error = <div />
//     if(error){
//       message_error = <div className="alert alert-danger alert-sm">
//                         <button 
//                           type="button" 
//                           className="close" 
//                           data-dismiss="alert" 
//                           aria-hidden="true" 
//                           onClick={()=>{
//                             this.setState({error:false, errorMessages:[]})
//                           }}>×</button>
//                         <span className="fw-semi-bold">Error:</span> {errorMessages.map((item, index)=>{ return (index ? ', ' : '') +  item } )}
//                       </div> 
//     }
//     return (
//       <div>
//           <form className="form-horizontal form-loanable">
//             {/* <div className="alert alert-danger alert-sm">
//               <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
//               <span className="fw-semi-bold">Error:</span> Login failed.
//             </div> */}
//             {message_error}
//             <fieldset>
//               <div className="form-group has-feedback required">
//                 <label htmlFor="login-email" className="col-sm-5">Username or email</label>
//                 <div className="col-sm-12">
//                   <span className="form-control-feedback" aria-hidden="true"></span>
//                   <input
//                     type="text"
//                     name="email"
//                     id="login-email"
//                     className="form-control"
//                     placeholder="Enter username or email"
//                     // onChange={this.onChange}
//                     // value={this.state.email}
//                     value={this.state.email}
//                     onChange={(e)=>{
//                       this.setState({ email: e.target.value });
//                     }}
//                     // required
//                   />
//                 </div>
//                 { /* console.log('error email ::: ' + JSON.stringify(errors)) */}
//               </div>
//               <div className="form-group has-feedback required">
//                 <label htmlFor="login-password" className="col-sm-5">Password</label>
//                 <div className="col-sm-12">
//                   <span className="form-control-feedback" aria-hidden="true"></span>
//                   <div className="login-password-wrapper">
//                     <input
//                       type="password"
//                       name="password"
//                       id="login-password"
//                       className="form-control"
//                       placeholder="*****"
//                       // required
//                       value={this.state.password}
//                       onChange={(e)=>{
//                         this.setState({ password: e.target.value });
//                       }}
//                     />
//                     <a href="#" onClick={e => { e.preventDefault(); this.setMode("forgot"); }}> Forgot Password</a>|
//                     <a href="#" onClick={e => { e.preventDefault(); this.setMode("register"); }}> Create your account</a>
//                   </div>
//                 </div>
//               </div>
//             </fieldset>
//             <div className="form-action" class="col-sm-12">
//               <button
//                 type="submit"
//                 disabled={loadingEP}
//                 className="btn btn-lg btn-primary btn-left">Enter <span className="icon-arrow-right2 outlined"></span>
//                 {
//                   loadingEP && <CircularProgress size={20}/>
//                 }
//               </button>

//               <GoogleLogin
//                 clientId="693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com"
//                 buttonText="Login"
//                 onSuccess={this.responseGoogle}
//                 onFailure={this.responseGoogle}
//                 cookiePolicy={'single_host_origin'}
//               />

//               <FacebookLogin
//                 appId="1088597931155576"
//                 // autoLoad={true}
//                 fields="name,email,picture"
//                 onClick={()=>{
//                   this.clickedFacebook()
//                 }}
//                 callback={(response)=>{
//                   this.responseFacebook(response)
//                 }} />
//             </div>
//           </form>
       
//       </div>
//     );
//   };

//   handleFormSubmit = (formSubmitEvent) => {
//     console.log("handleFormSubmit : ", this.state.mode);
//     formSubmitEvent.preventDefault();
  
//     // errorMessages

//     // return ;
//     let {email, password} = this.state
//     if(isEmpty(email) && isEmpty(password)){
//       console.log("isEmpty : email, password")

//       this.setState({error: true, errorMessages: ["Email & password is empty."]})
//     }else if(isEmpty(email)){
//       this.setState({error: true, errorMessages: ["Email is empty."]})
//     }else if(isEmpty(password)){
//       this.setState({error: true, errorMessages: ["Password is empty."]})
//     }else if(!isEmailValid(email)){
//       this.setState({error: true, errorMessages: ["Email is Invalid."]})
//     }else {

//       this.setState({loadingEP:true})

//       // var intervalId = setInterval(()=>{

//       //   console.log("--> 1000")

//       //   this.props.onClose()
//       //   console.log("--> 1000 9")
//       // }, 5000);
//     }
//   }

//   render() {

//     let {showModal, onClose} = this.props
//     return (
//       <div>
//         <Modal
//           show={showModal}
//           onHide={onClose}
//           onSubmit={this.handleFormSubmit}
//           //   bsSize="large"
//           backdrop="static"
//         >
//           <Modal.Header closeButton={true}>
//             <h2>{ this.state.mode === "login" ? "Login" : this.state.mode === "register" ? "Register" : "Forgot Password" }</h2>
//           </Modal.Header>
//           <Modal.Body>
//             {this.state.mode === "login" ? (this.renderLogin()) : this.state.mode === "register" ? (this.renderRegister()) : (this.renderForgot())}
//           </Modal.Body>
//           {/* <Modal.Footer>
//             <Button onClick={this.props.onClose}>Close</Button>
//           </Modal.Footer> */}
//         </Modal>
//       </div>
//     );
//   }
// }

// export default LoginForm;

//       loadingEP:false,
//       loadingFacebook:false,
//       loadingGoogle:false,

//       email: "",
//       password: "",

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

  // const [item, setItem] = React.useState({});
  // const [anchorEl, setAnchorEl] = React.useState(null);
  
  // const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  // const [photoIndex, setPhotoIndex] = React.useState(0);

  // const ref = useRef()

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    // console.log('props.item : ', props.item)
    // setItem(props.item)
    // console.log(">> props ", props, ref)

    setShowModal(props.showModal)
    // setMode(props.mode)
  });

  const renderLogin = () => {
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
                      // this.setState({ email: e.target.value });
                      setEmail(e.target.value)
                    }}
                    // required
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
                      // required
                      value={password}
                      onChange={(e)=>{
                        // this.setState({ password: e.target.value });

                        setPassword(e.target.value)
                      }}
                    />
                    <a href="#" onClick={e => { e.preventDefault(); setMode("forgot");  }}> Forgot Password</a>|
                    <a href="#" onClick={e => { e.preventDefault(); setMode("register");  }}> Create your account</a>
                  </div>
                </div>
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

              {/* <GoogleLogin
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
                }} /> */}
            </div>
          </form>
       
      </div>
    );
  }
  
  const renderRegister = () => {
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
  }

  const  renderForgot = () => {
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
                          // this.setState({ email: e.target.value });
                          setEmail(e.target.value)
                        }}
                        // required
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
                          // required
                          value={password}
                          onChange={(e)=>{
                            // this.setState({ password: e.target.value });
    
                            setPassword(e.target.value)
                          }}
                        />
                        <a href="#" onClick={e => { e.preventDefault(); setMode("forgot");  }}> Forgot Password</a>|
                        <a href="#" onClick={e => { e.preventDefault(); setMode("register");  }}> Create your account</a>
                      </div>
                    </div>
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
  
    // errorMessages

    /*
    // return ;
    let {email, password} = this.state
    if(isEmpty(email) && isEmpty(password)){
      console.log("isEmpty : email, password")
      this.setState({error: true, errorMessages: ["Email & password is empty."]})
    }else if(isEmpty(email)){
      this.setState({error: true, errorMessages: ["Email is empty."]})
    }else if(isEmpty(password)){
      this.setState({error: true, errorMessages: ["Password is empty."]})
    }else if(!isEmailValid(email)){
      this.setState({error: true, errorMessages: ["Email is Invalid."]})
    }else {

      this.setState({loadingEP:true})

      // var intervalId = setInterval(()=>{

      //   console.log("--> 1000")

      //   this.props.onClose()
      //   console.log("--> 1000 9")
      // }, 5000);
    }
    */
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
  
export default LoginForm;
