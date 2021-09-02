import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
const io = require('socket.io-client');

class App extends Component {

  async componentDidMount(){
    // import io from "socket.io-client"
    const res = await axios.get( '/api/v1' )
    console.log("res :", res)
    console.log("My Server URL :"+window.location.href)


    const socket = io(window.location.href, {
                                                query: {
                                                    "platform" : "process.env.REACT_APP_PLATFORM", 
                                                },
                                                transports: ['polling', 'websocket'],
                                            });

    socket.on('connect', ()=>{
      console.log('Socket io, connent!');
    })
    
    socket.on('disconnect', ()=>{
      console.log('Socket io, onDisconnect!');
    });
    console.log('NEW SOCKET CREATED ::::::::::::::::::::::::::::::::');
  }

  onConnect = () =>{
    console.log('Socket io, connent!');
  }

  onDisconnect = () =>{
    console.log('Socket io, onDisconnect!');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. Test Asker
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React  ปปป
          </a>
        </header>
      </div>
    );
  }
}

export default App;
