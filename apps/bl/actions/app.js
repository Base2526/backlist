import { FETCH_ALL_DATA, TEST_DATA, CHECK_DATA, CLEAR_DATA } from '../constants/app';

const dataFetch = data => ({
  type: FETCH_ALL_DATA,
  data,
});

const textFetch = data => ({
  type: TEST_DATA,
  data,
});

const checkData = data => ({
  type: CHECK_DATA,
  data,
});

const clearData = data => ({
  type: CLEAR_DATA,
  data,
});

export const fetchDataAll = () => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //    //  console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch([{'1': '2'}]));
  //   })
  dispatch(dataFetch([{'1': '2'}]));
}

export const testFetchData = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //     console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch(response.data));
  //   })

  dispatch(textFetch([{'a': 'b'}]))
}

export const checkFetchData = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //     console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch(response.data));
  //   })

  dispatch(checkData({}))
}

export const clearDataALL = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //     console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch(response.data));
  //   })

  dispatch(clearData({}))
}