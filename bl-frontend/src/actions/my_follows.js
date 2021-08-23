import { INIT_MY_FOLLOW, MY_FOLLOW, MY_FOLLOW_ALL} from '../constants';

export const initMyFollow = () => dispatch => {
  dispatch({ type: INIT_MY_FOLLOW });
}

export const onMyFollow = (data) => dispatch => {
  dispatch({ type: MY_FOLLOW, data });
}

export const onMyFollowALL = (data) => dispatch => {
  dispatch({ type: MY_FOLLOW_ALL, data });
}
