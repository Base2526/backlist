import { ON_CONNECT, ON_DISCONNECT } from '../constants';

export const onConnect = (data) => dispatch => {
  dispatch({ type: ON_CONNECT, data });
}

export const onDisconnect = () => dispatch => {
  dispatch({ type: ON_DISCONNECT });
}