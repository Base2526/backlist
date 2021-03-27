import { USER_LOGIN, USER_LOGOUT } from '../constants/app';

const dataUserLogin = data => ({
  type: USER_LOGIN,
  data,
});

const dataUserLogout = data => ({
  type: USER_LOGOUT,
  data,
});

export const userLogin = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //    //  console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch([{'1': '2'}]));
  //   })
  dispatch(dataUserLogin(data));
}

export const userLogout = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //     console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch(response.data));
  //   })

  dispatch(dataUserLogout([{'a': 'b'}]))
}