import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import axios from 'axios';

import { Button } from 'react-bootstrap';

import { userLogout } from '../../actions/auth'
import { headers } from '../Utils/Config';

// import {  loadingOverlayActive } from '../../actions/huay'

import LoginForm from '../Setting/LoginForm'

var _ = require('lodash');

class ButtonAppBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      is_active:false,
      loading_text: '',

      showModal:false
    }

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = async (event) =>  {
    let { userLogout, user} = this.props;

    this.setState({is_active:true, loading_text:'รอสักครู่'})
    let response  = await axios.post('/api/logout', 
                                      {uid: user.uid }, 
                                      {headers:headers()});
    console.log(response);

    this.setState({is_active:false})
    if( response.status==200 && response.statusText == "OK" ){
      if(response.data.result){
        userLogout();
      }
    }
  }

  // loadingOverlayActive(){
  //   let {is_active, loading_text} = this.state
  //   this.props.loadingOverlayActive(is_active, loading_text);
  // }

  render() {

    // loadingOverlayActive();


    // let {loggedIn, user, is_connect} = this.props
    
    // if(loggedIn){
    //   v = <div>
    //         เครดิตคงเหลือ : {user.credit_balance} ฿
    //         <Link style={{color: 'white', paddingRight:'5px'}} href="#" to="/profile-page" >
    //           <div className="logo">
    //             <img src={user.image_url} width="40" height="40" />
    //           </div>
    //           {user.name}
    //         </Link>
    //         <Link style={{color: 'white'}} href="#" to="/login" onClick={this.handleLogout} >
    //           ออกจากระบบ
    //         </Link>
    //       </div>;
    // }

    return (<div style={{flexGrow: 1}}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" style={{flexGrow: 1, color: 'white'}}>
                    <Link  href="#" to="/">Banlist.info</Link>
                  </Typography>
                  <div>
                    <Link  href="#" style={{color: 'white', paddingRight:'5px'}} to="/login">เข้าสู่ระบบ</Link>
                    <Link  href="#" style={{color: 'white'}} to="/register">สมัครสมาชิก</Link>
                  </div>
                  <LoginForm showModal={this.state.showModal} onClose = {()=>{this.setState({showModal:false})}} />
                </Toolbar>
              </AppBar>
            </div>
          )
  }
}

const mapStateToProps = (state, ownProps) => {
	if(!state._persist.rehydrated){
		return {};
  }

  if(state.auth.isLoggedIn){
    return { loggedIn: true, user: state.auth.user, is_connect: state.socket_io.is_connect };
  }else{
    return { loggedIn: false };
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    userLogout: () => {
      dispatch(userLogout())
    },
    // loadingOverlayActive: (isActivie) =>{
    //   dispatch(loadingOverlayActive(isActivie))
    // }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAppBar)