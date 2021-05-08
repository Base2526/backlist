import * as types from "../actions/types";

const initialState = {
    data: []
};

const lotterys = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_LOTTERYS:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default lotterys;
