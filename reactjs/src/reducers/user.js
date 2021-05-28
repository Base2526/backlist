import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, 
         FOLLOW_UP, ___FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, 
         DELETE_HISTORY, ADD_FOLLOWER_POST, FOLLOWER_POST, 
         NET_INFO, NOTIFICATIONS,
         LOADING_OVERLAY, CLEAR_CACHED,
        
         ADD_MY_APPS} from '../constants';
import { isEmpty } from '../utils';

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

  is_loading_overlay:false
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:{
      return {...state, data: action.data}
    }
    
    case USER_LOGOUT: {
      return initialState
    }

    case CLEAR_CACHED: {
      return initialState
    }

    case FETCH_PROFILE:{
      return {...state, data: {...state.data, ...action.data} }
    }

    case FOLLOW_UP: {
      let follow_ups = state.follow_ups
      let data = action.data
      if(isEmpty(follow_ups.find((item)=>item.id === data.id))){
        follow_ups = [...follow_ups, {"id": data.id, 
                                      "local": true, 
                                      "status": true,
                                      "owner_id": data.owner_id, 
                                      "date": Date.now()
                                    }]
      }else{
        follow_ups = follow_ups.map(el => (el.id === data.id ? {...el, "status": !el.status} : el))
      }
      /*
       ___followUp({"id": item.id, 
                              "local": true, 
                              "follow_up": follow_up, 
                              "unique_id": getUniqueId(), 
                              "owner_id": item.owner_id, 
                              "date": Date.now()}, 0);
      */
      return {...state, follow_ups}
    }

    case ___FOLLOW_UP:{
      if(action.mode == 0){
        let ___follow_ups = mergeArraysId([action.data], state.___follow_ups)
        return {
          ...state, ___follow_ups
        }
      }else if(action.mode == 1){
        let ___follow_ups = mergeArraysId(action.data, state.___follow_ups)
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

    case ADD_MY_APPS:{
      return { ...state, my_apps: action.data }
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

    case LOADING_OVERLAY:{
      return { ...state, is_loading_overlay:action.data}
    }

   
    default:
      return state;
  }
}

export default user