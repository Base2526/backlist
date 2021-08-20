import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as BR, Route, Switch } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container'
import { ToastContainer, toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import io from 'socket.io-client';
import { CacheSwitch, CacheRoute, } from "react-router-cache-route";
import axios from 'axios';
import { Base64 } from 'js-base64';

import ls from 'local-storage';

import Breadcrumbs from './pages/Breadcrumbs'
import HeaderBar from './pages/HeaderBar';
import Footer from './pages/Footer';
import routes from "./routes";
import ScrollToTopBtn from "./components/ScrollToTopBtn";

import { isEmpty, uniqueId } from "./utils"

import { userLogin, userLogout } from './actions/user';

let socket = undefined;

const App = (props) => {
  const [timeInterval, setTimeInterval] = React.useState(undefined);

  // useEffect(() => {
  //   socketid()
  //   console.log('socketid()')
  // }, []);

  useEffect(() => {
    socketid()
    console.log(' socketid() > [props.user] ')
  }, [props.user]);

  useEffect(() => {
    if(!isEmpty(timeInterval)){
      clearInterval(timeInterval)
    }
    setTimeInterval(setInterval(syc, 30000, props))
  }, [props.user, props.follow_ups]);


  const _uniqueId = (props) =>{
    return uniqueId(isEmpty(props.user) ? '' : props.user.uid)
  }

  const syc =(props)=>{
    let {user, follow_ups} = props
    if(!isEmpty(props.user)){
      let filter_follow_ups = follow_ups.filter((im)=>im.local)

      console.log("interval syc :", Date().toLocaleString(), _uniqueId(props), props, filter_follow_ups)

      if(!isEmpty(filter_follow_ups)){
        // axios.post(`/node/follow_up`, {
        //   unique_id: _uniqueId(props),
        //   datas: JSON.stringify(follow_ups)
        // }, {
        //     // headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
        // })
        // .then((response) => {
        //   let results = response.data
        //   console.log('/node/follow_up : ', results)
        // })
        // .catch( (error) => {
        //   console.log('/node/follow_up : ', error)
        // });
      }
    }
  } 

  const socketid = () =>{
    console.log('process.env :', process.env, ', props : ', props)

    /*
    
    {
      extraHeaders: {
        Authorization: "Bearer authorization_token_here"
      }
    }
    */

    if(isEmpty(socket)){
      socket = io( "/", 
        // { headers:  {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} },
        
        // {
        //   auth: {
        //     token: "abcd"
        //   }
        // },
        { 
          path: '/api/mysocket',
          query: {
            "platform" : process.env.REACT_APP_PLATFORM, 
            // "unique_id": _uniqueId(props),
            "version"  : process.env.REACT_APP_VERSIONS
          },
          auth: {
            token: isEmpty(props.user) ? 0 : props.user.uid
          }
        },
        // {
        //   auth: {
        //     token: "123"
        //   },
        //   query: {
        //     "unique_id": "my-value"
        //   }
        // },
        // { query:{ `platform=${process.env.REACT_APP_PLATFORM}&unique_id=3434&version=${process.env.REACT_APP_VERSIONS}` }}, 
        
        { transports: ["websocket"] });
    }else{
      socket.auth.token = isEmpty(props.user) ? 0 : props.user.uid;
      socket.disconnect().connect();
    }                 
    
    if (socket.connected === false && socket.connecting === false) {
      // use a connect() or reconnect() here if you want
      socket.connect()
      console.log('reconnected!');

      socket.off('connect', onConnect)
      socket.off("uniqueID", onUniqueID);
      socket.off('disconnect', onDisconnect);

      socket.off('onUser', onUser);
      socket.off('onProfile', onProfile);
      socket.off('onContent', onContent);
    }else{
      console.log('socket :', socket)
    }

    socket.on('connect', onConnect)
    socket.on("uniqueID", onUniqueID);
    socket.on('disconnect', onDisconnect);

    socket.on('onUser', onUser);
    socket.on('onProfile', onProfile);
    socket.on('onContent', onContent);
  }

  const onConnect = () =>{
    console.log('Socket io, connent!');
  }

  const onUniqueID = (data) =>{
    console.log("unique_id :", data)

    ls.set('socketIO', JSON.stringify(data))

    var socketIO = ls.get('socketIO')

    console.log("socketIO :", socketIO)
  }

  const onUser = (data) =>{
    console.log("onUser :", data)

    try {
      let mode = data.mode
      console.log("onUser mode", mode)
      switch(mode){
        case 'delete':{
          socket.disconnect();

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

    // mode: "delete"
  }

  const onProfile = (data) =>{
    console.log("onProfile :", data)

    props.userLogin(data)

    console.log("onProfile : >> ", data)
  }

  const onContent = (data) =>{
    console.log("onContent :", data)

    // mode: "edit", nid: "104"}

    try {
      let mode = data.mode
      console.log("onContent mode", mode)
      switch(mode){
        case 'add':
        case 'edit':{
          console.log("onContent add, edit")

          console.log("onContent props.my_apps ", props.my_apps)
          /*
          let myArray = [
            {id: 0, name: "Jhon"},
            {id: 1, name: "Sara"},
            {id: 2, name: "Domnic"},
            {id: 3, name: "Bravo"}
          ]
          
          let objIndex = myArray.findIndex((obj => obj.id == 1));
          
          myArray[objIndex] = {id: 1000, name: "444"}
          console.log( myArray );
          */

          let my_apps = props.my_apps
          let index = my_apps.findIndex((obj => obj.id == data.nid));

          my_apps[index] = data.data

          console.log("onContent {add, edit} ", my_apps)

          break;
        }
        case 'delete':{
          console.log("onContent delete")

          let index = my_apps.findIndex((obj => obj.id == data.nid));

          let my_apps = props.my_apps
          my_apps.splice(index, 1);

          console.log("onContent {delete} ", my_apps)
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

  const onDisconnect = () =>{
    console.log('Socket io, disconnect!');
  }

  return( <BR>
            <LoadingOverlay
              active={props.is_loading_overlay}
              spinner
              text='Wait...'>
              <div className="App">
                  <HeaderBar {...props} />
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
                          console.log(`Generated crumbs for ${props.match.path}`);
                          crumbs.map(({ name, path }) => console.log({ name, path }));
                          return (
                            <div className="p-8">
                              <Breadcrumbs crumbs={crumbs} />
                              <Component {...props} />

                              <ScrollToTopBtn />
                              
                            </div>
                          );
                        }}
                      />
                    ))}
                  </CacheSwitch>
                  </Container>
                <Footer />  
              </div>
            </LoadingOverlay>
          </BR>)
}

const mapStateToProps = (state, ownProps) => {

  console.log('state :', state)
	return {
    user: state.user.data,
    my_apps: state.my_apps.data,
    follow_ups: state.user.follow_ups,


    is_loading_overlay: state.user.is_loading_overlay,
  };
}

const mapDispatchToProps = {
  userLogin,
  userLogout
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
