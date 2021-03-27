import { USER_LOGIN, USER_LOGOUT } from '../constants/app';

const initialState = {
  data: [],
}

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:{
      console.log('USER_LOGIN', action.data)
      return {data: action.data}
    }
    
    case USER_LOGOUT: {
      console.log('USER_LOGOUT')
      return initialState
    }
   
    default:
      return state;
  }
}