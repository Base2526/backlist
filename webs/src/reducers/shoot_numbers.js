import * as types from "../actions/types";

const initialState = {
    data: []
};

const shoot_numbers = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOOT_NUMBERS:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default shoot_numbers;
