import { INIT_APP_FOLLOW_UP, APP_FOLLOW_UP, APP_FOLLOW_UP_ALL } from '../constants';

export const initAppFollowUp = () => dispatch => {
  dispatch({ type: INIT_APP_FOLLOW_UP });
}

export const onAppFollowUp = (data) => dispatch => {
  dispatch({ type: APP_FOLLOW_UP, data });
}

export const onAppFollowUpALL = (data) => dispatch => {
  dispatch({ type: APP_FOLLOW_UP_ALL, data });
}
