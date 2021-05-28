import * as types from "../actions/types";

const initialState = {
    isActive: false,
    loadingText: ""
};

const loading_overlay = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING_OVERLAY_ACTIVE:
      // console.log(action);
      return {
        ...state,
        isActive:action.isActive,
        loadingText: action.loadingText,
      };
    default:
      return state;
  }
  return state;
};

export default loading_overlay;
