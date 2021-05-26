import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as BR, Route, Switch } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container'
import { ToastContainer, toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

import ScrollToTopBtn from "./components/ScrollToTopBtn";

import io from 'socket.io-client';

// import io from "socket.io-client";
import {
  CacheSwitch,
  CacheRoute,
  useDidCache,
  useDidRecover
} from "react-router-cache-route";

import Breadcrumbs from './pages/Breadcrumbs'
import HeaderBar from './pages/HeaderBar';
import Footer from './pages/Footer';
import routes from "./routes";

class App extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   isLoadingOverlay:false
    // }
  }
  
  componentDidMount() {
    console.log("process.env : ", process.env); 

    // if(!isEmpty(user)){    
    //   socket = io(API_URL_SOCKET_IO(), { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${getUniqueId()}&version=${getVersion()}&uid=${user.uid}` });
    //   this.onSycNodeJs()
    // }else{
      // socket = io('http://143.198.223.146:3000', { query:`platform=platform&unique_id=unique_id&version=version` });

    //   socket = io('/', { query:`platform=platform&unique_id=unique_id&version=version` })

    // if (socket.connected === false && socket.connecting === false) {
    //   // use a connect() or reconnect() here if you want
    //   socket.connect()
    //   console.log('reconnected!');
    // }
    // }
    console.log("message >>> 1")

    // /nodejs/
    // const socket = io('/nodejs/', { query:`platform=platform&unique_id=unique_id&version=version` });
    // // if (socket.connected === false && socket.connecting === false) {
    //   // use a connect() or reconnect() here if you want
    //   socket.connect()
    //   console.log('reconnected!');
    // // }
    // socket.on("message", data => {
    //   // setResponse(data);
    //   console.log("message >>> ", data)
    // });

    // console.log("message >>> 2", socket)

    // const socket = io("/",  { query:`platform=platform&unique_id=unique_id&version=version` } )
    // socket.on('message', (messageNew) => {
    //   // temp.push(messageNew)
    //   // this.setState({ message: temp })
    //   console.log("message >>> ", messageNew)
    // })

    // const socket = io('/', {})

    // if (socket.connected === false && socket.connecting === false) {
    //   // use a connect() or reconnect() here if you want
    //   socket.connect()
    //   console.log('reconnected!');
    // }

    // console.log('socket', socket)

    /*
    
    this.socket = io("http://192.168.1.3:3000", {query:"platform=react"});
    this.socket.on('connect', function(){
      console.log('socket.io-client > connect');

    });
    */
    this.socketid();
  }

  socketid = () =>{
    const socket = io("/", {}, { transports: ["websocket"] });
    // if (socket.connected === false && socket.connecting === false) {
      // use a connect() or reconnect() here if you want
      socket.connect()
      console.log('reconnected!');
    // }
    socket.on('connect', () => {
      console.log('Socket io, connect!');
    })
    socket.on("message", data => {
      // setResponse(data);

      console.log(data)
    });

    socket.on('disconnect', ()=>{
      console.log('Socket io, disconnect!');

      // props.updateSocketIOStatus({status: false});
    });
  }

  render(){
    return( <BR>
                <LoadingOverlay
                  active={this.props.is_loading_overlay}
                  spinner
                  text='Wait...'>
                  <div className="App">
                      <HeaderBar {...this.props} />
                      <Container>
                      <ToastContainer />

                      {/* 
                      <div onClick={()=>this.setState({isLoadingOverlay : true})}>
                        isLoadingOverlay
                      </div> 
                      */}
                      

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
}

const mapStateToProps = (state, ownProps) => {
	return {
    is_loading_overlay: state.user.is_loading_overlay,
  };
}

const mapDispatchToProps = (dispatch) => {
	return { }
}

export default connect(mapStateToProps, null)(App)
