import { ADD_MY_APPS} from '../constants';

const initialState = {
    data: []
}

const my_apps = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MY_APPS:{
            return { ...state, data: action.data }
        }

        default:
            return state;
    }
}

export default my_apps