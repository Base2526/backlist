import * as types from "../actions/types";

const initialState = {
    data: []
};

const yeekee_round = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_YEEKEE_ROUND:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default yeekee_round;
