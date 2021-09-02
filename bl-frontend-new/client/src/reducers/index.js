import { combineReducers } from 'redux'

import user from './user'
import app from './app';
import setting from './setting'

import my_apps        from './my_apps'
import my_follows     from './my_follows'
import app_follow_up  from './app_follow_up'
import socket         from './socket'

export default combineReducers({
  user,
  app,
  setting,
  my_apps,
  my_follows,

  app_follow_up,

  socket
})