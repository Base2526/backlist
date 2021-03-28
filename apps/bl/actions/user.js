const axios = require('axios');

import {_fetchData} from './app'

import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID, API_URL_SOCKET_IO} from "../constants"
import { USER_LOGIN, USER_LOGOUT, FOLLOW_UP, FETCH_MY_APPS } from '../constants/app';

const _dataUserLogin = data => ({
  type: USER_LOGIN,
  data,
});

const _dataUserLogout = data => ({
  type: USER_LOGOUT,
  data,
});

const _dataFollowup = data => ({
  type: FOLLOW_UP,
  data,
});

const _fetchMyApps = data => ({
  type: FETCH_MY_APPS,
  data,
});


export const userLogin = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //    //  console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch([{'1': '2'}]));
  //   })
  dispatch(_dataUserLogin(data));
}

export const userLogout = () => dispatch => {
  dispatch(_dataUserLogout({}))
}

export const followUp = (data) => dispatch => {
  dispatch(_dataFollowup(data));
}

export const fetchMyApps = (basic_auth) => dispatch => {
  axios.post(`${API_URL}/api/fetch_mypost?_format=json`, {}, {
    headers: { 
      'Authorization': `Basic ${basic_auth}` 
    }
  })
  .then(function (response) {
    let results = response.data
    if(results.result){
      let {datas} = results
      dispatch(_fetchMyApps(datas.map(function (my_app) {return my_app.id})));
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}

/*
axios.post(`${API_URL}/api/fetch?_format=json`, {
      nid_last,
    }, {
      headers: { 
        'Authorization': `Basic ${API_TOKEN}` 
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log('results : ', results)
      if(results.result){
        // true
        // console.log('true');
        // console.log(results);

        let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        // if(datas && datas.length > 0){
        //   _this.setState({spinner: false, execution_time, datas, count});
        // }else{

        // _this.setState({data: [ ..._this.state.data, ...datas]});

        _this.props.fetchData(datas);
        
        // _this.setState({data: [...this.state.data, ...datas]})
        //   alert('Empty result.');
        // }
        
      }else{
        // false
        // console.log('false');

        // _this.setState({spinner: false})
      }

      _this.setState({loading: false})
    })
    .catch(function (error) {
      console.log(error)
      _this.setState({loading: false})
    });
*/