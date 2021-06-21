import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as BR, Route, Switch } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container'
import { ToastContainer, toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import io from 'socket.io-client';
import { CacheSwitch, CacheRoute } from "react-router-cache-route";
import axios from 'axios';
import { Base64 } from 'js-base64';

import Breadcrumbs from './pages/Breadcrumbs'
import HeaderBar from './pages/HeaderBar';
import Footer from './pages/Footer';
import routes from "./routes";
import ScrollToTopBtn from "./components/ScrollToTopBtn";

import { isEmpty, uniqueId } from "./utils"

const App = (props) => {
  const [timeInterval, setTimeInterval] = React.useState(undefined);

  useEffect(() => {
    socketid()
    console.log('socketid()')
  }, []);

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
        axios.post(`/node/follow_up`, {
          unique_id: _uniqueId(props),
          datas: JSON.stringify(follow_ups)
        }, {
            // headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
        })
        .then((response) => {
          let results = response.data
          console.log('/node/follow_up : ', results)
        })
        .catch( (error) => {
          console.log('/node/follow_up : ', error)
        });
      }

      
    }
  } 

  const socketid = () =>{
    console.log('process.env :', process.env)

    /*
    
    */
    const socket = io( "/", 
                      { path: '/mysocket' },
                      { query:{"platform"  : process.env.REACT_APP_PLATFORM, 
                               "unique_id" : _uniqueId(props),
                               "version"   : process.env.REACT_APP_VERSIONS }}, 
                      { transports: ["websocket"] });
    if (socket.connected === false && socket.connecting === false) {
      // use a connect() or reconnect() here if you want
      socket.connect()
      console.log('reconnected!');

      socket.off('connect', onConnect)
      socket.off("uniqueID", onUniqueID);
      socket.off('disconnect', onDisconnect);
    }else{
      console.log('socket :', socket)
    }

    socket.on('connect', onConnect)
    socket.on("uniqueID", onUniqueID);
    socket.on('disconnect', onDisconnect);
  }

  const onConnect = () =>{
    console.log('Socket io, connent!');
  }

  const onUniqueID = (data) =>{
    console.log("unique_id :", data)
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

  console.log('state.user.follow_ups :', state.user.follow_ups)
	return {
    user: state.user.data,
    follow_ups: state.user.follow_ups,


    is_loading_overlay: state.user.is_loading_overlay,
  };
}

const mapDispatchToProps = (dispatch) => {
	return { }
}

export default connect(mapStateToProps, null)(App)
