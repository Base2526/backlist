import * as types from "../actions/types";

// import {disconnect_socketIO} from '../socket.io'

const initialState = {
  data:{},
  isLoggedIn: false
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_LOGIN:
      // console.log(action);
      return {
        ...state,
        user:action.user,
        isLoggedIn: true
      };
    case types.AUTH_UPDATE:{
      return {
        ...state,
        user:action.data,
        isLoggedIn: true
      };
    }
    case types.AUTH_LOGOUT:
      // disconnect_socketIO();
      return initialState;
    default:
      return state;
  }
};

export default auth;
