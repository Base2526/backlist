import { ADD_CONTENTS_DATA, ADD_FOLLOWS_DATA, ADD_FOLLOW_DATA, SET_TOTAL_VALUE, CLEAR_ALL_CONTENTS_DATA, MY_FOLLOW } from '../constants';

var _ = require('lodash');

const initialState = {
  total_value: 0,
  data: [],
  follows: []
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

    case ADD_FOLLOWS_DATA: {
      let merged = _.merge(_.keyBy(state.follows, 'nid'), _.keyBy(action.data, 'nid'));
      return { ...state, follows: _.values(merged)}
    }

    case ADD_FOLLOW_DATA:{
      let state_data    = state.data
      let state_follows = state.follows

      let action_data   = action.data;

      // ------------- content -------------
      // console.log('MY_FOLLOW > #0 ', state_data, action_data.nid)
      let find_content = state_data.find((o) => o.nid == action_data.nid)
      if(!_.isEmpty(find_content)){

        let index = state_data.findIndex((o) => o.nid == action_data.nid)

        if(_.has(find_content, 'app_followers')){
          // console.log('MY_FOLLOW > #1 ', action_data, find_content)

          let app_followers = find_content.app_followers
          let find_app_followers = app_followers.find((o)=>o.uid === action_data.uid)
          if(_.isEmpty(find_app_followers)){
            app_followers = [...app_followers, {uid: action_data.uid, status: action_data.status, date  : Date.now()}]
          }else{
            app_followers = app_followers.map((o)=>{
                                  if(o.uid === action_data.uid){
                                    o.status = action_data.status
                                  }
                                  return o
                                })
          }

          find_content = {...find_content, app_followers}
        }else{
          find_content = {...find_content, app_followers: [{uid: action_data.uid, status: action_data.status, date  : Date.now()}]}
        }

        state_data.splice(index, 1, find_content)

        // ------------- content -------------

        // ------------- follows -------------


        // console.log('MY_FOLLOW > #2 ',action_data, state_follows)

        let find_follow = state_follows.find((o)=>o.nid === action_data.nid)

        let follows = []
        if(!_.isEmpty(find_follow)){
          // console.log('MY_FOLLOW > #3 ')
          follows = state_follows.map((o)=>{
                          if(o.nid === action_data.nid){
                            o.status = action_data.status;
                            o.local  = true;
                          }
                          return o
                        })
        }else {
          // console.log('MY_FOLLOW > #4 ')
          follows = [...state_follows, { "nid": action_data.nid, "status": action_data.status, "date": Date.now(), "local": true}]
        }
       
        // console.log('MY_FOLLOW > #5 ', follows)
        // ------------- follows -------------
        
        return { ...state, data: state_data, follows};
      }

      
      /*
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
      */

      // return state
    }

    case CLEAR_ALL_CONTENTS_DATA:{
      return initialState
    }
      
    default:
      return state;
  }
}

export default app