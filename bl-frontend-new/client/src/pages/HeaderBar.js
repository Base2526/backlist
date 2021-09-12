import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Typography from '@material-ui/core/Typography';
import { useHistory } from "react-router-dom";
import NotificationsIcon from '@material-ui/icons/Notifications';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast }    from "react-toastify";

import {isEmpty} from '../utils'
import { userLogout, loadingOverlay, clearCached } from '../actions/user';
import LogoutDialog from './LogoutDialog'
import LoginDialog from './LoginDialog'
import previewIcon from '../images/preview-icon.png';


var _ = require('lodash');

const HeaderBar = (props) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl]               = useState(null);
  const [showModal, setShowModal]             = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [loadingOverlay, setLoadingOverlay]   = useState(false);

  const [maintenance, setMaintenance]   = useState(false);

  const [follows, setFollows]     = useState([]);

  useEffect(() => {
    if(!_.isEmpty(props.follows)){
      setFollows(props.follows.filter((el)=>el.status))
    }
    
  },[]);


  useEffect(() => {
    setMaintenance(props.maintenance)
  },[props.maintenance]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div style={{flexGrow: 1}}>
               <AppBar position="static">
                 <Toolbar>
                   <Typography variant="h6" style={{flexGrow: 1, color: 'white'}}>
                    <div  onClick={()=>{ history.push({pathname: `/`, state: {} }) }}>
                      <span style={{cursor:'pointer'}} >Banlist.info {_.isEmpty(props.socket_data)? '[Disconnect]' : "[Connected]"}</span>
                    </div>
                   </Typography>

                   {
                     maintenance
                     ?  <div />
                     :  <div>
                          <div>
      
                          {  _.isEmpty(props.user) ? <ul className="flex-container row">
                                                    <li className="flex-item">
                                                    <div 
                                                      style={{cursor:'pointer'}}
                                                      onClick={()=>{
                                                        setShowModal(true)
                                                      }}>
                                                      เข้าสู่ระบบ
                                                    </div>
                                                  </li> 
                                                  </ul>
                                                : <ul className="flex-container row">
                                                    <li className="flex-item">
                                                        <NotificationsIcon 
                                                          className="notifications-icon"
                                                          onClick={()=>{
                                                            history.push({pathname: `/notifications`, state: {} })
                                                          }} />
                                                        <span className="notifications-span">1</span>
                                                    </li>
                                                    <li className="flex-item">
                                                      <LazyLoadImage
                                                        className="lazy-load-image-border-radius"
                                                        alt={'image.alt'}
                                                        width="40px"
                                                        height="40px"
                                                        effect="blur"
                                                        onClick={handleClick}
                                                        placeholderSrc={previewIcon}
                                                        src={props.user.image_url} 
                                                        />
                                                    </li>
                                                  </ul>
                                                  }
                          </div>
                          <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            open={Boolean(anchorEl)}>
                            <MenuItem 
                              onClick={()=>{
                                history.push({pathname: `/my-profile`, state: {} })
                                setAnchorEl(null);
                              }}>My Profile</MenuItem>
      
                              {/* My post (10) */}
      
                            <MenuItem 
                              onClick={()=>{
                                history.push({pathname: `/new-post`, state: {} })
                                setAnchorEl(null);
                              }}>New post</MenuItem>
                            <MenuItem 
                              onClick={()=>{
                                history.push({pathname: `/my-profile/my-post`, state: {} })
                                setAnchorEl(null);
                              }}>Posts {props.my_apps.length}</MenuItem>
      
                          <MenuItem 
                              onClick={()=>{
                                history.push({pathname: `/my-profile/follows`, state: {} })
                                setAnchorEl(null);
                              }}>Follows {follows.length}</MenuItem>
                              {/*
                            <MenuItem 
                              onClick={()=>{
                                // setLoadingOverlay(true)
      
                                props.clearCached({})
                                toast.info("Clear cached success.", 
                                {
                                    position: "bottom-right", 
                                    hideProgressBar: true,
                                    autoClose: 1000,
                                }) 
      
                                setAnchorEl(null);
                              }}>Clear cached</MenuItem> */}
                            <MenuItem 
                              onClick={()=>{
                                setShowModalLogout(true); 
                                setAnchorEl(null);
      
                                
                              }}>Logout</MenuItem>
                          </Menu> 
                          <LoginDialog showModal={showModal} mode={"login"} onClose = {()=>{setShowModal(false)}} />
                          <LogoutDialog showModalLogout={showModalLogout} onClose = {()=>{setShowModalLogout(false)}} />
                        </div>

                   }
                   
                </Toolbar>
              </AppBar>
            </div>
  );
};
  
const mapStateToProps = (state, ownProps) => {

	return {
    user: state.user.data,
    data: state.app.data,

    follows: state.app.follows,

    follow_ups: state.user.follow_ups,


    my_apps: state.my_apps.data,
    maintenance: state.setting.maintenance,

    socket_data: state.socket.data
  };
}

const mapDispatchToProps = {
  userLogout,
  loadingOverlay,
  clearCached
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar)