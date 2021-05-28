import * as types from "../actions/types";
const initialState = {
  is_connect:false,
};

const socket_io = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_SOCKET_IO_STATUS:
      return {
        ...state,
        is_connect:action.data.status
      };
    default:
      return state;
  }
};

export default socket_io;
