// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import { connect } from 'react-redux'
// import axios from 'axios';

// import MenuItem from "@material-ui/core/MenuItem";
// import Menu from "@material-ui/core/Menu";

// import { Button } from 'react-bootstrap';

// import { userLogout } from '../../actions/auth'
// import { headers } from '../Utils/Config';

// // import {  loadingOverlayActive } from '../../actions/huay'

// import LoginForm from '../Setting/LoginForm'

// var _ = require('lodash');

// class ButtonAppBar extends Component {

//   constructor(props) {
//     super(props);

//     this.state = {
//       is_active:false,
//       loading_text: '',

//       showModal:false,

//       anchorEl: null
//     }

//     this.handleLogout = this.handleLogout.bind(this);
//   }

//   handleLogout = async (event) =>  {
//     let { userLogout, user} = this.props;

//     this.setState({is_active:true, loading_text:'รอสักครู่'})
//     let response  = await axios.post('/api/logout', 
//                                       {uid: user.uid }, 
//                                       {headers:headers()});
//     console.log(response);

//     this.setState({is_active:false})
//     if( response.status==200 && response.statusText == "OK" ){
//       if(response.data.result){
//         userLogout();
//       }
//     }
//   }

//   // loadingOverlayActive(){
//   //   let {is_active, loading_text} = this.state
//   //   this.props.loadingOverlayActive(is_active, loading_text);
//   // }

//   handleClose = () => {
//     // setAnchorEl(null);
//     this.setState({anchorEl:null})
//   };
  
//   handleClick = (event) => {
//     // setAnchorEl(event.currentTarget);

//     console.log(event)
//     // this.setState({anchorEl:event.currentTarget })
//   };

//   render() {

//     // loadingOverlayActive();


//     // let {loggedIn, user, is_connect} = this.props
    
//     // if(loggedIn){
//     //   v = <div>
//     //         เครดิตคงเหลือ : {user.credit_balance} ฿
//     //         <Link style={{color: 'white', paddingRight:'5px'}} href="#" to="/profile-page" >
//     //           <div className="logo">
//     //             <img src={user.image_url} width="40" height="40" />
//     //           </div>
//     //           {user.name}
//     //         </Link>
//     //         <Link style={{color: 'white'}} href="#" to="/login" onClick={this.handleLogout} >
//     //           ออกจากระบบ
//     //         </Link>
//     //       </div>;
//     // }

//     let {anchorEl} = this.state

//     return (<div style={{flexGrow: 1}}>
//               <AppBar position="static">
//                 <Toolbar>
//                   <Typography variant="h6" style={{flexGrow: 1, color: 'white'}}>
//                     <Link  href="#" to="/">Banlist.info</Link>
//                   </Typography>
//                   <div>
//                     <button 
//                       style={{ outline: 'none !important' }}  
//                       onClick={()=>{
//                         this.setState({showModal:true})
//                       }}>
//                         เข้าสู่ระบบ
//                     </button>
//                     <button 
//                       style={{ outline: 'none !important' }}  
//                       onClick={()=>{
//                         this.setState({showModal:true})
//                       }}>
//                         สมัครสมาชิก
//                     </button>

//                     <button 
//                       style={{ outline: 'none !important' }}  
//                       onClick={this.handleClick}>
//                         โปร์ไฟล์ของฉัน
//                     </button>

//                     <Menu
//                       keepMounted
//                       anchorEl={anchorEl}
//                       onClose={()=>this.handleClose}
//                       open={Boolean(anchorEl)}>
//                       <MenuItem onClick={()=>this.handleClose}>My Account</MenuItem>
//                       <MenuItem onClick={()=>this.handleClose}>Settings</MenuItem>
//                       <MenuItem onClick={()=>this.handleClose}>Profile</MenuItem>
//                       <MenuItem onClick={()=>this.handleClose}>Logout</MenuItem>
//                     </Menu> 

//                     {/* <Link  href="#" style={{color: 'white', paddingRight:'5px'}} to="/login">เข้าสู่ระบบ</Link>
//                     <Link  href="#" style={{color: 'white'}} to="/register">สมัครสมาชิก</Link> */}
//                   </div>
//                   <LoginForm showModal={this.state.showModal} onClose = {()=>{this.setState({showModal:false})}} />
//                 </Toolbar>
//               </AppBar>
//             </div>
//           )
//   }
// }

// const mapStateToProps = (state, ownProps) => {
// 	if(!state._persist.rehydrated){
// 		return {};
//   }

//   if(state.auth.isLoggedIn){
//     return { loggedIn: true, user: state.auth.user, is_connect: state.socket_io.is_connect };
//   }else{
//     return { loggedIn: false };
//   }
// }

// const mapDispatchToProps = (dispatch) => {
// 	return {
//     userLogout: () => {
//       dispatch(userLogout())
//     },
//     // loadingOverlayActive: (isActivie) =>{
//     //   dispatch(loadingOverlayActive(isActivie))
//     // }
// 	}
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ButtonAppBar)

import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import Typography from '@material-ui/core/Typography';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "../../App.css";

import LoginForm from '../Setting/LoginForm'


const UseHomeItem = (props) => {
  const [item, setItem] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    // console.log('props.item : ', props.item)
    // setItem(props.item)
  });
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleClick = (event) => {

    console.log('setAnchorEl : ', event.currentTarget)
    console.log(typeof event.currentTarget);
    setAnchorEl(event.currentTarget);
  };


  return (
    // <div key={item.id} style={{margin: 10}}>                 
    //   <div style={{cursor: 'pointer'}}> 
          
    //       <button 
    //           style={{outline: 'none !important', }}  
    //           onClick={handleClick}>
    //           Menu
    //       </button>
    //   </div>
                 
    //   <Menu
    //       keepMounted
    //       anchorEl={anchorEl}
    //       onClose={handleClose}
    //       open={Boolean(anchorEl)}>
    //       <MenuItem onClick={handleClose}>My Account</MenuItem>
    //       <MenuItem onClick={handleClose}>Settings</MenuItem>
    //       <MenuItem onClick={handleClose}>Profile</MenuItem>
    //       <MenuItem onClick={handleClose}>Logout</MenuItem>
    //   </Menu> 
    // </div>



    <div style={{flexGrow: 1}}>
               <AppBar position="static">
                 <Toolbar>
                   <Typography variant="h6" style={{flexGrow: 1, color: 'white'}}>
                     <Link  href="#" to="/">Banlist.info</Link>
                   </Typography>
                   <div>
                     <button 
                      style={{ outline: 'none !important' }}  
                      onClick={()=>{
                        setShowModal(true)
                      }}>
                        เข้าสู่ระบบ
                    </button>
                    <button 
                      style={{ outline: 'none !important' }}  
                      onClick={()=>{
                       
                        setShowModal(true)
                      }}>
                        สมัครสมาชิก
                    </button>

                    <button 
                      style={{ outline: 'none !important' }}  
                      onClick={handleClick}>
                        โปร์ไฟล์ของฉัน
                    </button>

                    <Menu
                      keepMounted
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      open={Boolean(anchorEl)}>
                      <MenuItem onClick={()=>handleClose}>My Account</MenuItem>
                      <MenuItem onClick={()=>handleClose}>Settings</MenuItem>
                      <MenuItem onClick={()=>handleClose}>Profile</MenuItem>
                      <MenuItem onClick={()=>handleClose}>Logout</MenuItem>
                    </Menu> 

                    {/* <Link  href="#" style={{color: 'white', paddingRight:'5px'}} to="/login">เข้าสู่ระบบ</Link>
                    <Link  href="#" style={{color: 'white'}} to="/register">สมัครสมาชิก</Link> */}

                    <LoginForm showModal={showModal} onClose = {()=>{setShowModal(false)}} />
                  </div>
                </Toolbar>
              </AppBar>
            </div>
  );
};
  
export default UseHomeItem;