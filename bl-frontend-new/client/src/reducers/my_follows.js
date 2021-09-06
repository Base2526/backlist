import { INIT_MY_FOLLOW, MY_FOLLOW, MY_FOLLOW_ALL, MY_FOLLOW_UPDATE_STATUS} from '../constants';

const initialState = {
    data: []
}

const my_follows = (state = initialState, action) => {
    switch (action.type) {
        case INIT_MY_FOLLOW:{
            return initialState;
        }

        case MY_FOLLOW:{
            let state_data  = state.data
            let action_data = action.data;

            let index = state_data.findIndex((obj => obj.nid == action_data.nid));
            if(index === -1){
               let  new_state_data = [...state_data, {nid: action_data.nid, status:true, date: Date.now(), local:true}]

               return  { ...state, data: new_state_data }
            }else{
                let  new_state_data = [...state_data]
                new_state_data[index] = {nid: action_data.nid, status:!state_data[index].status, date: Date.now(), local:true}
 
                return  { ...state, data: new_state_data }
            }
        }

        case MY_FOLLOW_ALL:{
            return { ...state, data: action.data.my_follows }
        }

        case MY_FOLLOW_UPDATE_STATUS:{
            let state_data  = state.data
            state_data.map((sd)=>{
                sd.local = false;
                return sd
            })
            return { ...state, data: state_data }
        }

        default:
            return state;
    }

    return state;
}

export default my_follows