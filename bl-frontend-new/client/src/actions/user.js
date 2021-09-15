import Ajv from "ajv"
import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, 
         FOLLOW_UP, ___FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, 
         DELETE_HISTORY, ADD_FOLLOWER_POST, FOLLOWER_POST ,
        
         NET_INFO, NOTIFICATIONS,
         LOADING_OVERLAY, CLEAR_CACHED} from '../constants';


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


/*
Mode
 0 : single
 1 : multi
*/
const ___dataFollowup= (data, mode) => ({
  type: ___FOLLOW_UP,
  data,
  mode
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

// NET_INFO
const _netInfo = data => ({
  type: NET_INFO,
  data,
});


const _notifications = data => ({
  type: NOTIFICATIONS,
  data,
});

const _loading_overlay = data => ({
  type: LOADING_OVERLAY,
  data,
});

// 
const _clear_cached = data => ({
  type: CLEAR_CACHED,
  data,
});


/*
_id: "614097d046ebea647663f6d4"
uid: 60
account_name: "phoswo"
display_name: "Phoswo"
email: "phoswo@example.com"
gender: "30"
image_url: "http://frontend.banlist.info:8055/sites/default/files/pictures/2021-09/240959914_528400418251311_5122779305900211655_n.png"
pass: "177adf4afeacaed5a3c13e2578d9cf96:b33f5507e20bafb3a38a9ac87c9bd698"
type_login: "26"


  var innerSchema = {
    "type" : "object",
    "properties" : {
      _id: {type: "string"},
      ref: {type: "string"},
      nid: {type: "integer"},
      owner_id: {type: "integer"},
      status: {type: "boolean"},
    },
    "required" : ["_id", "ref", "nid", "owner_id", "status"]
  }


*/
export const userLogin = (data) => dispatch => {
  const schema = {
    type: "object",
    properties: {
      _id: {type: "string"},
      uid: {type: "number"},
      account_name: {type: "string"},
      display_name: {type: "string"},
      pass: {type: "string"},
      email: {type: "string"},
      gender: {type: "string"},
      type_login: {type: "string"},
      image_url: {type: "string"},
    },
    required: ["email"],
    // additionalProperties: false,
  }
  const ajv = new Ajv() 
  const validate = ajv.compile(schema)
  
  console.log("userLogin : >> ", data )
  if(validate(data)){
    dispatch(_dataUserLogin(data));
  }else{
    console.log('Ajv invalid addContentsData : ', data)
  }
}

export const userLogout = () => dispatch => {
  dispatch(_dataUserLogout({}))
}

export const fetchProfile = (basic_auth) => dispatch =>{
  // axios.post(`${API_URL}/api/fetch_profile?_format=json`, {}, {
  //   headers: { 
  //     'Authorization': `Basic ${basic_auth}` 
  //   }
  // })
  // .then(function (response) {
  //   let results = response.data

  //   console.log('updateProfile : ', results)
  //   if(results.result){
  //     let {profile} = results
  //     dispatch(_fetchProfile(profile));
  //   }
  // })
  // .catch(function (error) {
  //   console.log(error)
  // });
}

export const followUp = (data) => dispatch => {
  dispatch({ type: FOLLOW_UP, data });
}

export const ___followUp = (data, mode) => dispatch => {
  dispatch(___dataFollowup(data, mode));
}

// export const addMyApps = (data) => dispatch => {
//   dispatch({ type: ADD_MY_APPS, data });
// }

export const fetchMyApps = (basic_auth) => dispatch => {
  // axios.post(`${API_URL}/api/fetch_mypost?_format=json`, {}, {
  //   headers: { 
  //     'Authorization': `Basic ${basic_auth}` 
  //   }
  // })
  // .then(function (response) {
  //   let results = response.data
  //   if(results.result){
  //     let {datas} = results
  //     dispatch(_fetchMyApps(datas.map(function (my_app) {return my_app.id})));
  //   }
  // })
  // .catch(function (error) {
  //   console.log(error)
  // });
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

export const netInfo = (data) => dispatch => {
  dispatch(_netInfo(data));
}

export const onNotifications = (data) => dispatch => {
  dispatch(_notifications(data));
}

// const _loading_overlay = data => ({
//   type: LOADING_OVERLAY,
//   data,
// });
export const loadingOverlay = (data) => dispatch => {
  dispatch(_loading_overlay(data));
}

export const clearCached = (data) => dispatch => {
  dispatch(_clear_cached(data));
}