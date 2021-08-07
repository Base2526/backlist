import { MAINTENANCE_MODE } from '../constants';

const initialState = {
    maintenance: false,
}

const setting = (state = initialState, action) => {
  switch (action.type) {
    case MAINTENANCE_MODE:{
      return {...state, maintenance: action.data}
    }
    
    default:
      return state;
  }
}

export default setting