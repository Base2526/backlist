import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as BR, Route, Switch } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container'
import { ToastContainer, toast } from 'react-toastify';

import ScrollToTopBtn from "./Components/Fields/ScrollToTopBtn";

// import io from "socket.io-client";
import {
  CacheSwitch,
  CacheRoute,
  useDidCache,
  useDidRecover
} from "react-router-cache-route";

import { Breadcrumbs } from './Components/Breadcrumbs'
import HeaderBar from './Components/Home/HeaderBar';
import Footer from './Components/Home/Footer';
import routes from "./routes";

class App extends Component {
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
  }  

  render(){

    return( <BR>
                <div className="App">
                    <HeaderBar {...this.props} />
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
            </BR>)
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('state : ', state)
	return {};
}

const mapDispatchToProps = (dispatch) => {
	return { }
}

export default connect(mapStateToProps, null)(App)
