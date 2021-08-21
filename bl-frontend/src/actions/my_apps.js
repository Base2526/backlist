import { INIT_MY_APP, ADD_MY_APP, UPDATE_MY_APP, DELETE_MY_APP } from '../constants';

export const initMyApp = () => dispatch => {
  dispatch({ type: INIT_MY_APP });
}

export const addMyApp = (data) => dispatch => {
  dispatch({ type: ADD_MY_APP, data });
}

export const updateMyApp = (data) => dispatch => {
  dispatch({ type: UPDATE_MY_APP, data });
}

export const deleteMyApp = (data) => dispatch => {
  dispatch({ type: DELETE_MY_APP, data });
}