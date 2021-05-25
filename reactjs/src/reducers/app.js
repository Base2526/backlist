import { FETCH_DATA, CHECK_DATA, FETCH_ALL_DATA, TEST_DATA, CLEAR_DATA } from '../constants/app';

export const  mergeArrays = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
      jointArray = [...jointArray, ...array]
  })
  const uniqueArray = jointArray.reduce((newArray, item) =>{
      let found = newArray.find(({ id }) => id === item.id);
      if (found){
          return newArray
      } else {
          return [...newArray, item]
      }
  }, [])
  return uniqueArray
}

const initialState = {
  data: [],
  tests: []
}

export const app = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA:{
      return {
        ...state,
        data: mergeArrays(state.data, action.data)
      }
    }

    // case FETCH_ALL_DATA:{
    //   console.log('FETCH_ALL_DATA action : ', action.data)
    //   return {
    //     ...state,
    //     data: [ ...state.data, ...action.data]
    //   }
    // }
    
    // case TEST_DATA: {
    //   // console.log('TEST_DATA ', action.data)
    //   return {...state, 
    //             tests: action.data}
    // }

    // case CHECK_DATA: {
    //   console.log('CHECT_DATA state >> ', state)
    //   // console.log('CHECT_DATA action>> ', action.data)

    //   return state;
    // }

    // case CLEAR_DATA: {
    //   return initialState;
    // }
      
    default:
      return state;
  }
}