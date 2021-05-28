import * as types from "../actions/types";

const initialState = {
    data: []
};

const deposit_status = (state = initialState, action) => {
  switch (action.type) {
    case types.DEPOSIT_STATUS:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default deposit_status;
