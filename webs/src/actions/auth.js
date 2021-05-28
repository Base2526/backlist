import * as types from "./types";
import { incrementProgress, decrementProgress } from "./progress";
// import history from "../history";

export const userLogin = (user) => ({
  type: types.AUTH_LOGIN,
  user
});

export const userUpdate = (data) => ({
  type: types.AUTH_UPDATE,
  data
});

export const userLogout = () => ({
  type: types.AUTH_LOGOUT,
});

const fakeLoginRequest = username =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      username === "foo" ? resolve(username) : reject("No such user");
    }, 1000),
  );

  // export const addTodo = text => ({
  //   type: 'ADD_TODO',
  //   id: nextTodoId++,
  //   text
  // })

export const doLogin = (username, password)  => {

  console.log(username, password);
  // dispatch(userLogin(username, password));
  // try {
  //   console.log(username, password);
  //   // const userResponse = await fakeLoginRequest(username);
      // dispatch(userLogin(username, password));
      // history.push("/");
  // } catch (error) {
  //   alert(error);
  // } finally {
  //   // dispatch(decrmentProgress());
  // }

  // dispatch(incrementProgress());
  // try {
  //   const userResponse = await fakeLoginRequest(username);
  //   dispatch(userLogin(userResponse));
  //   // history.push("/dashboard");
  // } catch (error) {
  //   alert(error);
  // } finally {
  //   dispatch(decrementProgress());
  // }
};

export const doLogout = () => dispatch => {
  dispatch(userLogout());
};
