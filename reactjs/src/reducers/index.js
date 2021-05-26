import { combineReducers } from 'redux'

import user from './user'
import app from './app';
import setting from './setting'

export default combineReducers({
  user,
  app,
  setting
})