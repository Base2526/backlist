import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, 
         FOLLOW_UP, ___FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, 
         DELETE_HISTORY, ADD_FOLLOWER_POST, FOLLOWER_POST ,
        
        
         NET_INFO, NOTIFICATIONS,
         LOADING_OVERLAY, CLEAR_CACHED,
        
         ADD_MY_APPS} from '../constants';


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

export const userLogin = (data) => dispatch => {
  dispatch(_dataUserLogin(data));
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

export const addMyApps = (data) => dispatch => {
  dispatch({ type: ADD_MY_APPS, data });
}

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