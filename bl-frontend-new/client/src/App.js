import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container'
import { ToastContainer, toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import io from 'socket.io-client';
import { CacheSwitch, CacheRoute, } from "react-router-cache-route";
import axios from 'axios';
import { Base64 } from 'js-base64';
import ls from 'local-storage';
import { deviceDetect } from "react-device-detect";
import HeaderBar from "./components/HeaderBar";
import Breadcrumb from "./components/Breadcrumb"
import Footer from './components/Footer';

import routes from "./routes";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import { userLogin, userLogout } from './actions/user';
import { addMyApp, updateMyApp, deleteMyApp } from './actions/my_apps';

import { onMyFollowALL, onMyFollowUpdateStatus } from './actions/my_follows'

import { onConnect, onDisconnect } from './actions/socket'

import { addContentsData, addFollowsData } from './actions/app'

import { setMaintenance } from './actions/setting'

import history from './history';

var _ = require('lodash');

let socket = undefined;
let interval = undefined;

const App = (props) => {
  const [maintenance, setMaintenance]   = useState(false);
  const [isLoadingOverlay, setIsLoadingOverlay]   = useState(false);

  useEffect(() => {
    checkLocalStorage()

    setMaintenance(false)
    return () => {
      setMaintenance() 
      setIsLoadingOverlay(false)

      socket = undefined;
      interval = undefined;
    };
  }, []);

  useEffect(() => {
    setMaintenance(props.maintenance)
  }, [props.maintenance]);

  useEffect(() => {
    setIsLoadingOverlay(props.is_loading_overlay)
  }, [props.is_loading_overlay]);

  useEffect(() => {
    
    // console.log('socketid() > [props.user] #0 > ', props.user , socket )  

    if( !_.isEmpty(socket) ){
      socket.disconnect()
      socket = null;
    }
    socketid()
  }, [props.user]);

  useEffect(async() => {
    if( _.isEmpty(interval) ){
      clearInterval(interval)

      interval = undefined
    }

    // console.log('useEffect [props.follows] #1: ')

    let {user, follows} = props
    // console.log("useEffect [props.follows] #2:", user, _.isEmpty(user), props)
    if(!_.isEmpty(user)){

      if(_.isEmpty(follows)){
        return;
      }

      let filter_follow_ups = follows.filter((im)=>im.local)
      
      // console.log("useEffect [props.follows] #3:", filter_follow_ups)
      if(!_.isEmpty(filter_follow_ups)){
        interval = setInterval(async(props)=>{
          let {user, follows} = props
          let response =  await axios.post(`/api/v1/syc_local`, 
                                          { 
                                            uid: user.uid, follows: JSON.stringify(follows) 
                                          }, 
                                          { headers: {'Authorization': `Basic ${ls.get('basic_auth')}` } });

          response = response.data
          console.log("/api/v1/syc_local : ", response )

          if(response.result){
            // props.onMyFollowUpdateStatus({})
          }

          clearInterval(interval)
        }, 2000, props)
      }else {
        // console.log("useEffect [props.follows] #5:")
      }
    }else{
      // console.log("useEffect [props.follows] #6:")
    }
  }, [props.follows]);

  const checkLocalStorage = ()=>{
    // http://apassant.net/2012/01/16/timeout-for-html5-localstorage/
    
    var hours = 4; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
      localStorage.setItem('setupTime', now)
    } else {
      if(now-setupTime > hours*60*60*1000) {
        // localStorage.clear()

        localStorage.removeItem('geolocation')

        localStorage.setItem('setupTime', now);
      }
    }
    
  }

  const geolocation = async () => {
    let data = JSON.parse(localStorage.getItem("geolocation"))
    if(_.isEmpty(data)){
      const res = await axios.get( process.env.REACT_APP_GEOLOCATION )
      if(res.status === 200){
        data = res.data
      }

      localStorage.setItem('geolocation', JSON.stringify(data))
    }
    return data;
  }

  const socketid = async() =>{
    // console.log('process.env :', process.env, ', props : ', props, ', geolocation : ', await geolocation())

    if(_.isEmpty(socket)){
      socket = io( "/", 
        // { headers:  {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} },
        
        // {
        //   auth: {
        //     token: "abcd"
        //   }
        // },
        { 
          // path: '/mysocket',
          // 'sync disconnect on unload': false,
          'sync disconnect on unload': true,
          query: {
            // "platform" : process.env.REACT_APP_PLATFORM, 
            // "unique_id": _uniqueId(props),
            "version"  : process.env.REACT_APP_VERSIONS,
            "device_detect" : JSON.stringify( deviceDetect() ),
            "geolocation" : JSON.stringify( await geolocation() ),
            auth_token: _.isEmpty(props.user) ? 0 : props.user.uid
          },
          // transports: ["websocket"]
        },
        // { transports: ["websocket"] }
        );
    }else{
      socket.auth.token = _.isEmpty(props.user) ? 0 : props.user.uid;
      socket.disconnect().connect()

      console.log('------------- disconnect ------------- #3')
    }                 
    
    if (socket.connected === false && socket.connecting === false) {
      // use a connect() or reconnect() here if you want
      socket.connect()
      console.log('reconnected!');

      socket.off('connect', onConnect)
      socket.off("uniqueID", onUniqueID);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', handleErrors);
      socket.off('connect_failed', handleErrors);
      socket.off('onSyc', handleSyc);

      socket.off('onUser', onUser);
      socket.off('onProfile', onProfile);
      socket.off('onContent', onContent);
      socket.off('onMyFollows', onMyFollows);
      socket.off('test', test);
      socket.off('onAppFollowers', onAppFollowers)
    }else{
      // console.log('socket :', socket)
    }

    socket.on('connect', onConnect)
    socket.on("uniqueID", onUniqueID);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', handleErrors);
    socket.on('connect_failed', handleErrors);
    socket.on('onSyc', handleSyc);

    socket.on('onUser', onUser);
    socket.on('onProfile', onProfile);
    socket.on('onContent', onContent);
    socket.on('onMyFollows', onMyFollows);
    socket.on('test', test);
    socket.off('onAppFollowers', onAppFollowers)
  }

  const handleSyc = (i) =>{
    console.log("handleSyc :", i )
    switch(i.type){
      case 'user':{
        let {operation_type} = i

        switch(operation_type){
          case 'delete':{
            ls.remove('basic_auth')
            ls.remove('session')

            socket.disconnect();  
            props.userLogout()
            
            history.push("/");
            break;
          }
        }
        break;
      }

      case 'follows':{

        let {operation_type, datas} = i

        switch(operation_type){
          case 'insert':{

            break;
          }

          case 'replace':
			    case 'update':{
            props.addFollowsData(datas)
            break;
          }
        }

        break;
      }

      case 'setting':{
        let {operation_type, datas} = i

        switch(operation_type){
          case 'maintenance':{
            props.setMaintenance(false)
            break;
          }
        }
        break;
      }
    }
  }

  const test = (data)=>{
    console.log("test :", data)
  }

  const handleErrors = (err)=>{
    console.log('connect_error + connect_failed', err);
  }

  const onConnect = () =>{
    console.log('Socket io, connent!');

    props.onConnect({connected: socket.connected})

    // props.setMaintenance(false)
  }

  const onDisconnect = () =>{
    console.log('Socket io, disconnect!');

    props.onDisconnect()

    // props.setMaintenance(true)
  }

  const onUniqueID = (data) =>{
    // console.log("unique_id :", data)

    // ls.set('socketIO', JSON.stringify(data))

    // var socketIO = ls.get('socketIO')

    // console.log("socketIO :", socketIO)
  }

  const onUser = (data) =>{
    console.log("onUser :", data)

    /*
    try {
      let mode = data.mode
      console.log("onUser mode", mode)
      switch(mode){
        case 'delete':{
          socket.disconnect();

          console.log('------------- disconnect ------------- #4')

          ls.remove('basic_auth')
          ls.remove('session')
          props.userLogout()

          console.log("onUser ok",)
          break;
        }
      }
    } catch (error) {
      // Catch internal functions, variables and return (jsx) errors.
      // You can also create a lib to log the error to an error reporting service
      // and use it here.
      console.log("onUser error :", error)
    }

    */
    // mode: "delete"
  }

  const onProfile = (data) =>{
    props.userLogin(data) 
  }

  const onContent = (data) =>{
    console.log("onContent :", data)

    // mode: "edit", nid: "104"}

    try {
      let mode = data.mode
      console.log("onContent mode", mode)
      switch(mode){
        case 'add':{
          console.log("onContent add")
          props.addMyApp(data)
          break;
        }
        case 'edit':{
          console.log("onContent edit")
          props.updateMyApp(data)
          break;
        }
        case 'delete':{
          console.log("onContent delete")
          props.deleteMyApp(data)
          break;
        }
      }
    } catch (error) {
      // Catch internal functions, variables and return (jsx) errors.
      // You can also create a lib to log the error to an error reporting service
      // and use it here.
      console.log("onContent error :", error)
    }
  }

  const onMyFollows = (data) =>{
    try{
      console.log("MY_FOLLOW_ALL : ", data)

      props.onMyFollowALL(data)
    } catch (err) {
      console.log(err)
    }
  }

  const onAppFollowers = (data) =>{
    console.log("onAppFollowers : ", data)

    // props.onMyFollowALL(data)
  }

  const onMaintenance = () =>{
    return (<div>We’ll be back soon! Sorry for the inconvenience but we’re performing some maintenance at the moment. We’ll be back online shortly!</div>)
  }

  const onMainView = () =>{
    return (<div>
              <Container>
              <ToastContainer />
              <CacheSwitch>
                {routes.map(({ path, name, Component }, key) => (
                  <CacheRoute
                    exact
                    path={path}
                    key={key}
                    render={props => {
                      const crumbs = routes
                        // Get all routes that contain the current one.
                        .filter(({ path }) => props.match.path.includes(path))
                        // Swap out any dynamic routes with their param values.
                        // E.g. "/pizza/:pizzaId" will become "/pizza/1"
                        .map(({ path, ...rest }) => ({
                          path: Object.keys(props.match.params).length
                            ? Object.keys(props.match.params).reduce(
                              (path, param) => path.replace(
                                `:${param}`, props.match.params[param]
                              ), path
                              )
                            : path,
                          ...rest
                        }));

                      // if(this.props.logged_in){
                      //   connect_socketIO(this.props)
                      // }

                      // console.log();
                      // console.log(`Generated crumbs for ${props.match.path}`);
                      crumbs.map(({ name, path }) =>{}
                      //  console.log({ name, path })
                      );
                      return (
                        <div className="bg-gray25">
                        <div className="container">
                          <div className="row">
                            <Breadcrumb crumbs={crumbs} />
                          </div>
                          
                          <Component {...props} />

                          <ScrollToTopBtn />
                        </div>
                        </div>
                      );
                    }}
                  />
                ))}
              </CacheSwitch>
              </Container>
              <Footer />  
            </div>)
  }

  return( <Router history={history}>
            <LoadingOverlay
              active={isLoadingOverlay}
              spinner
              text='Wait...'>
              <div className="App">
                  <HeaderBar  {...props}/>
                  { console.log('maintenance :', maintenance) }
                  { maintenance ? onMaintenance() : onMainView() }
              </div>
            </LoadingOverlay>
          </Router>)
}

const mapStateToProps = (state, ownProps) => {
	return {
    user: state.user.data,
    my_apps: state.my_apps.data,
    follow_ups: state.user.follow_ups,

    my_follows: state.my_follows.data,

    follows: state.app.follows,

    is_loading_overlay: state.user.is_loading_overlay,

    maintenance: state.setting.maintenance
  };
}

const mapDispatchToProps = {
  userLogin,
  userLogout,

  addMyApp, 
  updateMyApp, 
  deleteMyApp,
  onMyFollowALL,
  onMyFollowUpdateStatus,

  onConnect, 
  onDisconnect ,

  addFollowsData,
  setMaintenance
}

export default connect(mapStateToProps, mapDispatchToProps)(App)