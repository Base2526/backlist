import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import Typography from '@material-ui/core/Typography';

import { useHistory } from "react-router-dom";

import NotificationsIcon from '@material-ui/icons/Notifications';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import {isEmpty} from '../Utils/Utils'
import { userLogout } from '../../actions/user';
import LogoutDialog from './LogoutDialog'
import LoginForm from '../Setting/LoginForm'

import previewIcon from '../../images/preview-icon.png';

const HeaderBar = (props) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showModalLogout, setShowModalLogout] = React.useState(false);

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    console.log('HeaderBar : ', props.user)
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
    <div style={{flexGrow: 1}}>
               <AppBar position="static">
                 <Toolbar>
                   <Typography variant="h6" style={{flexGrow: 1, color: 'white'}}>
                     {/* <Link  href="#" to="/"></Link> */}
                    <div  onClick={()=>{ history.push({pathname: `/`, state: {} }) }}>
                      <span style={{cursor:'pointer'}} >Banlist.info</span>
                    </div>
                   </Typography>
                   <div>
                    <div>

                    { isEmpty(props.user) ? <ul class="flex-container row">
                                              <li class="flex-item">
                                              <div 
                                                style={{cursor:'pointer'}}
                                                onClick={()=>{
                                                  setShowModal(true)
                                                }}>
                                                เข้าสู่ระบบ/สมัครสมาชิก
                                              </div>
                                            </li> 
                                            </ul>
                                          : <ul class="flex-container row">
                                              <li class="flex-item">
                                                  <NotificationsIcon 
                                                    className="notifications-icon"
                                                    onClick={()=>{
                                                      history.push({pathname: `/notifications`, state: {} })
                                                    }} />
                                                  <span className="notifications-span">1</span>
                                              </li>
                                              <li class="flex-item">
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
                      <MenuItem onClick={()=>{
                        history.push({pathname: `/my-profile`, state: {} })
                        setAnchorEl(null);
                      }}>My Profile</MenuItem>
                      <MenuItem onClick={()=>{
                        setShowModalLogout(true); 
                        setAnchorEl(null);

                        props.userLogout()
                      }}>Logout</MenuItem>
                    </Menu> 
                    <LoginForm showModal={showModal} mode={"login"} onClose = {()=>{setShowModal(false)}} />
                    <LogoutDialog showModalLogout={showModalLogout} onClose = {()=>{setShowModalLogout(false)}} />
                  </div>
                </Toolbar>
              </AppBar>
            </div>
  );
};
  
const mapStateToProps = (state, ownProps) => {

	return {
    user: state.user.data,
    data: state.app.data,
  };
}

const mapDispatchToProps = {
  userLogout,
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar)