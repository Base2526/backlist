export const API_URL="http://banlist.info"
export const API_TOKEN="YWRtaW46U29ta2lkMDU4ODQ4Mzkx"
export const WEB_CLIENT_ID="693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com"
export const IOS_CLIENT_ID="693724870615-sctm232nea5uoce5us2l5le0mj7bi77p.apps.googleusercontent.com"
// export const API_URL_SOCKET_IO="http://143.198.223.146:3000"

export const API_URL_SOCKET_IO = () => {
    // if (process.env.NODE_ENV === 'development') {
        // return "http://localhost:3000"
    // }else{
        return "http://143.198.223.146:3000"
    // }
}

export const FETCH_ALL_DATA = 'FETCH_ALL_DATA';

export const FETCH_DATA = 'FETCH_DATA';

export const TEST_DATA = 'TEST_DATA';

export const CHECK_DATA = 'CHECK_DATA';

export const CLEAR_DATA = 'CLEAR_DATA';

export const USER_LOGIN     = 'USER_LOGIN';
export const USER_LOGOUT    = 'USER_LOGOUT';
export const FETCH_PROFILE  = 'FETCH_PROFILE';
export const FOLLOW_UP      = 'FOLLOW_UP';
export const ___FOLLOW_UP   = '___FOLLOW_UP';
export const FETCH_MY_APPS  = 'FETCH_MY_APPS';
export const ADD_MY_APPS    = 'ADD_MY_APPS';
export const ADD_HISTORY    = 'ADD_HISTORY';
export const DELETE_HISTORY = 'DELETE_HISTORY';
export const DELETE_MY_APP  = 'DELETE_MY_APP'; 

export const ADD_FOLLOWER_POST = 'ADD_FOLLOWER_POST' // use first login insert all
export const FOLLOWER_POST  = 'FOLLOWER_POST';       // case add each item
export const NET_INFO   = 'NET_INFO'
export const NOTIFICATIONS   = 'NOTIFICATIONS'


export const LOADING_OVERLAY   = 'LOADING_OVERLAY'
export const CLEAR_CACHED      = 'CLEAR_CACHED'

export const MAINTENANCE_MODE  = 'MAINTENANCE_MODE'
