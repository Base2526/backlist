import { ON_CONNECT, ON_DISCONNECT } from '../constants';

const initialState = {
    data: []
}

const socket = (state = initialState, action) => {
    switch (action.type) {
        case ON_CONNECT:{
            return  { ...state, data: action.data }
        }

        case ON_DISCONNECT:{
            return initialState;
        }

        default:
            return state;
    }
}

export default socket