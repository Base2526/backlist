import { USER_LOGIN, USER_LOGOUT, FOLLOW_UP, FETCH_MY_APPS } from '../constants/app';

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

const initialState = {
  data: [],
  follow_ups: [],
  my_apps: [],
}

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:{
      console.log('USER_LOGIN', action.data)
      return {...state, data: action.data}
    }
    
    case USER_LOGOUT: {
      console.log('USER_LOGOUT')
      return initialState
    }

    case FOLLOW_UP: {
      console.log('Reduces > FOLLOW_UP > ', action.data)
      return {...state, follow_ups: action.data}
    }

    case FETCH_MY_APPS: {
      return {
        ...state, my_apps: action.data
      }
    }
   
    default:
      return state;
  }
}