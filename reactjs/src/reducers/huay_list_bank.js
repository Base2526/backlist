import * as types from "../actions/types";

const initialState = {
    data: []
};

const huay_list_bank = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_HUAY_LIST_BANK:
      console.log(action);
      return {
        ...state,
        data:action.data,
      };
    default:
      return state;
  }
};

export default huay_list_bank;
