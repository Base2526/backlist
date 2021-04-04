const axios = require('axios');

import {API_URL} from "../constants"
import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, 
         FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, 
         DELETE_HISTORY, ADD_FOLLOWER_POST, FOLLOWER_POST } from '../constants/app';

const _dataUserLogin = data => ({
  type: USER_LOGIN,
  data,
});

const _dataUserLogout = data => ({
  type: USER_LOGOUT,
  data,
});


const _fetchProfile = data => ({
  type: FETCH_PROFILE,
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

const _addHistory = data => ({
  type: ADD_HISTORY,
  data,
});

const _deleteHistory = data => ({
  type: DELETE_HISTORY,
  data,
});

// ADD_FOLLOWER_POST
const _addfollowerPost = data => ({
  type: ADD_FOLLOWER_POST,
  data,
});

// FOLLOWER_POST
const _followerPost = data => ({
  type: FOLLOWER_POST,
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

export const fetchProfile = (basic_auth) => dispatch =>{
  axios.post(`${API_URL}/api/fetch_profile?_format=json`, {}, {
    headers: { 
      'Authorization': `Basic ${basic_auth}` 
    }
  })
  .then(function (response) {
    let results = response.data

    console.log('updateProfile : ', results)
    if(results.result){
      let {profile} = results
      // dispatch(_fetchProfile(profile));
    }
  })
  .catch(function (error) {
    console.log(error)
  });
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

export const addHistory = (data) => dispatch => {
  dispatch(_addHistory(data));
}

export const deleteHistory = (data) => dispatch => {
  dispatch(_deleteHistory(data));
}

export const addfollowerPost = (data) => dispatch => {
  dispatch(_addfollowerPost(data));
}

export const followerPost = (data) => dispatch => {
  dispatch(_followerPost(data));
}