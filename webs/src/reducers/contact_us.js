import * as types from "../actions/types";

const initialState = {
    data: {}
};

const contact_us = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_CONTACT_US:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default contact_us;
