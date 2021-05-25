import * as types from "../actions/types";

const initialState = {
    data: []
};

const transfer_method = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_TRANSFER_METHOD:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default transfer_method;
