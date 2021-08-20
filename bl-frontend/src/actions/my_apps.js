import { ADD_MY_APPS } from '../constants';

export const addMyApps = (data) => dispatch => {
  dispatch({ type: ADD_MY_APPS, data });
}