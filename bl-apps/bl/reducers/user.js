import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, 
         FOLLOW_UP, ___FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, 
         DELETE_HISTORY, ADD_FOLLOWER_POST, FOLLOWER_POST, NET_INFO, NOTIFICATIONS } from '../constants/app';

export const  mergeArrays = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
      jointArray = [...jointArray, ...array]
  })
  const uniqueArray = jointArray.reduce((newArray, item) =>{
    if (newArray.includes(item)){
      return newArray
    } else {
      return [...newArray, item]
    }
  }, [])
  return uniqueArray
}

export const  mergeArraysId = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
      jointArray = [...jointArray, ...array]
  })
  const uniqueArray = jointArray.reduce((newArray, item) =>{
      let found = newArray.find(({ id }) => id === item.id);
      if (found){
          return newArray
      } else {
          return [...newArray, item]
      }
  }, [])
  return uniqueArray
}

const initialState = {
  data: [],
  profile: [],
  follow_ups: [],
  ___follow_ups: [],
  my_apps: [],
  historys: [],
  follower_post: [],

  net_info:{},

  notifications:[],
}

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:{
      // console.log('Reduces > USER_LOGIN > ', action.data)
      return {...state, data: action.data}
    }
    
    case USER_LOGOUT: {
      // console.log('Reduces > USER_LOGOUT > ', action.data)
      return initialState
    }

    case FETCH_PROFILE:{
      // console.log('Reduces > FETCH_PROFILE > ', action.data)

      // console.log('Reduces > FETCH_PROFILE > ', state.data, {...state.data, ...action.data} )

      return {...state, data: {...state.data, ...action.data} }
    }

    case FOLLOW_UP: {
      // console.log('Reduces > FOLLOW_UP > ', action.data)

      // let follow_ups = state.follow_ups

      return {...state, follow_ups: action.data}
    }

    case ___FOLLOW_UP:{
      if(action.mode == 0){
        let ___follow_ups = mergeArraysId([action.data], state.___follow_ups)
        return {
          ...state, ___follow_ups
        }
      }else if(action.mode == 1){
        let ___follow_ups = mergeArraysId(action.data, state.___follow_ups)
        // let filt = ___follow_ups.filter(ite=>ite.follow_up)
        // console.log("____________action.data .length : ", ___follow_ups.length, filt.length, ___follow_ups)
        return {
          ...state, ___follow_ups
        }
      }
      return state;
    }

    case NOTIFICATIONS: {
      let notifications = mergeArraysId(action.data, state.notifications)
      return {
        ...state, notifications
      }
    }

    case FETCH_MY_APPS: {
      return {
        ...state, my_apps: action.data
      }
    }

    case ADD_HISTORY: {

      let historys = state.historys.filter((item)=>{ return item.search_text !== action.data.search_text })
      historys.splice(0, 0, action.data);

      return { ...state, historys }
    }

    case DELETE_HISTORY: {
      let historys = state.historys.filter((item)=>{ return item.search_text !== action.data.search_text })
      return { ...state, historys }
    }

    case ADD_FOLLOWER_POST: {
      return { ...state, follower_post:action.data }
    }

    case FOLLOWER_POST: {
      let follower_post = state.follower_post.filter((item)=>{ return item.post_id !== action.data.post_id })
      return { ...state, follower_post:[...follower_post, action.data] }
    }

    case NET_INFO: {
      return { ...state, net_info:action.data}
    }
   
    default:
      return state;
  }
}