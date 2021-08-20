import { combineReducers } from 'redux'

import user from './user'
import app from './app';
import setting from './setting'

import my_apps from './my_apps'

export default combineReducers({
  user,
  app,
  setting,
  my_apps
})