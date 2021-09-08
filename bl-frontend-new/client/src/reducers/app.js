import { ADD_CONTENTS_DATA, SET_TOTAL_VALUE, CLEAR_ALL_CONTENTS_DATA, MY_FOLLOW } from '../constants';

var _ = require('lodash');

const initialState = {
  total_value: 0,
  data: []
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTENTS_DATA:{
      let merged = _.merge(_.keyBy(state.data, 'nid'), _.keyBy(action.data, 'nid'));
      return { ...state, data: _.values(merged)}
    }

    case SET_TOTAL_VALUE:{
      return { ...state, total_value: action.data}
    }

    case MY_FOLLOW:{
      let state_data  = state.data
      let action_data = action.data;

      let index = state_data.findIndex((obj => obj.nid == action_data.nid));
      
      let __t = state_data[index];
      if(!_.isEmpty(__t)){
        let app_followers = __t.app_followers

        let _index = app_followers.findIndex((obj => obj.uid == action_data.uid));
        if(_index === -1){
          app_followers = [...app_followers, {uid: action_data.uid, status: true, date  : Date.now()}]
        }else{
          app_followers[_index].status = action_data.status
          console.log('app_followers :', app_followers, app_followers[_index].status)
        }

        state_data.splice(index,1, {...__t, app_followers})
      }

      return { ...state, data: state_data};
    }

    case CLEAR_ALL_CONTENTS_DATA:{
      return initialState
    }
      
    default:
      return state;
  }
}

export default app