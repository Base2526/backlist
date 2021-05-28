import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

import io from 'socket.io-client';

const App = (props) => {

  useEffect(() => {
    console.log('App >> ', props)

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

    // fetch()
    // fetch2()

    // ___follow()
  });

  const fetchNJ = ()=>{
    axios.get(`/api_node/api1`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(res => {
      // const persons = res.data;
      // this.setState({ persons });
      console.log(res)
    })
    .catch(function (error) {
      console.log('fetch : ', error)
    });

    axios.post(
        "/api_node/api2",
        {
          email: "Fred@gmail.com",
          password: "Flintstone",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.message);
      });
    
  }

  const fetchDP = ()=>{
    console.log("fetch")
    axios.post(`/api/search?_format=json`, {
      type: 0,
      key_word: '*',
      offset:0
    }, {
        headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
    })
    .then(function (response) {
      let results = response.data
      console.log('fetch : ', results)

    })
    .catch(function (error) {
      console.log('fetch : ', error)
    });
  
  }

  return (
    <div className="App">
     <div
      style={{cursor:'pointer'}}
      onClick={()=>{
        fetchNJ()
      }}
     >Test Call api NodeJs xxx( Server 1 )</div>
     <div
      style={{cursor:'pointer'}}
      onClick={()=>{
        fetchDP()
      }}
     >Test Call api Drupal( Server 2 )</div>
    </div>
  );
}

export default App;
