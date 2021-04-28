import { combineReducers } from 'redux';
import { app } from '../reducers/app';
import { user } from '../reducers/user';

const rootReducer = combineReducers({
  app,
  user
});

export default rootReducer;
