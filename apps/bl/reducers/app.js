import { CHECK_DATA, FETCH_ALL_DATA, TEST_DATA, CLEAR_DATA } from '../constants/app';

const initialState = {
  user: [],
  data: [],
  test: [],
}

export const app = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_DATA:{
      console.log('FETCH_ALL_DATA action : ', action.data)
      return {
        ...state,
        data: [ ...state.data, ...action.data]
      }
    }
    
    case TEST_DATA: {
      // console.log('TEST_DATA state >> ', state)
      console.log('TEST_DATA action>> ', action.data)

      return {
        ...state,
        test: [...state.test, ...action.data]
      }
    }

    case CHECK_DATA: {
      console.log('CHECT_DATA state >> ', state)
      // console.log('CHECT_DATA action>> ', action.data)

      return state;
    }

    case CLEAR_DATA: {
      console.log('CLEAR_DATA ALL >> ', state)
      return initialState;
    }
      
    default:
      return state;
  }
}