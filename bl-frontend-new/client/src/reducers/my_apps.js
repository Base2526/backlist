import { INIT_MY_APP, ADD_MY_APP, ADD_MY_APP_ALL, UPDATE_MY_APP, DELETE_MY_APP } from '../constants';

const initialState = {
    data: []
}

const my_apps = (state = initialState, action) => {
    switch (action.type) {
        case INIT_MY_APP:{
            return initialState;
        }

        case ADD_MY_APP:{
            let state_data  = state.data
            let action_data = action.data;

            let index = state_data.findIndex((obj => obj.id == action_data.nid));
            if(index === -1){
               let  new_state_data = [...state_data, action.data.data]

               return  { ...state, data: new_state_data }
            }
            break;
        }

        case ADD_MY_APP_ALL:{
            return {...state, data: action.data}
        }

        case UPDATE_MY_APP:{
            let state_data  = state.data
            let action_data = action.data;

            let index = state_data.findIndex((obj => obj.id == action_data.nid));
            if(index !== -1){
               let  new_state_data = [...state_data]
               new_state_data[index] = action.data.data

               return  { ...state, data: new_state_data }
            }
            break;
        }

        case DELETE_MY_APP:{
            let state_data  = state.data
            let action_data = action.data;

            let index = state_data.findIndex((obj => obj.id == action_data.nid));
            if(index !== -1){
                let  new_state_data = [...state_data]
                new_state_data.splice(index, 1);
                
                return  { ...state, data: new_state_data }
            }

            break;
        }

        default:
            return state;
    }

    return state;
}

export default my_apps