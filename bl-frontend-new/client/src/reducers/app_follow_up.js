import { INIT_APP_FOLLOW_UP, APP_FOLLOW_UP, APP_FOLLOW_UP_ALL  } from '../constants';

const initialState = {
    data: []
}

const app_follow_up = (state = initialState, action) => {
    switch (action.type) {
        case INIT_APP_FOLLOW_UP:{
            return initialState;
        }

        case APP_FOLLOW_UP:{
            // let state_data  = state.data
            // let action_data = action.data;

            // let index = state_data.findIndex((obj => obj.id == action_data));
            // if(index === -1){
            //    let  new_state_data = [...state_data, {id: action_data, status:true, date: Date.now(), local:true}]

            //    return  { ...state, data: new_state_data }
            // }else{
            //     let  new_state_data = [...state_data]
            //     new_state_data[index] = {id: action_data, status:!state_data[index].status, date: Date.now(), local:true}
 
            //     return  { ...state, data: new_state_data }
            // }
        }

        case APP_FOLLOW_UP_ALL:{
            // return { ...state, data: action.data.my_follows };
        }

        default:
            return state;
    }

    return state;
}

export default app_follow_up