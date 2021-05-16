import React, { Component } from 'react';
import { connect } from 'react-redux'

import { BrowserRouter as BR, Route, Switch } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container'


import { Breadcrumbs } from './Components/Breadcrumbs'
import HeaderBar from './Components/AppBar/AppBar';
import Footer from './Components/Footer/Footer';

import routes from "./routes";

class App extends Component {
  componentDidMount() {
    console.log("process.env : ", process.env); 
  }  

  render(){
    return( <BR>
                <div className="App">
                    <HeaderBar />
                    <Container>
                    
                    <Switch>
                  {routes.map(({ path, name, Component }, key) => (
                    <Route
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

                            <Footer>
                              <span>footer content</span>  
                            </Footer>  
                          </div>
                        );
                      }}
                    />
                  ))}
                </Switch>


                    </Container>
                    {/* <Footer> 
                        <span>footer content</span>  
                    </Footer> */}
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
