import * as Types from "../constants/types";
import axios from "../axios";
export const loginAdmin = dataToSubmit => {
  const request = axios
    .post("/users/login", dataToSubmit)
    .then(res => res.data);
  return {
    type: Types.LOGIN,
    payload: request
  };
};
// export const auth = () => {
//   const request = axios.get("/api/client/authAdmin").then(res => res.data);
//   return {
//     type: Types.AUTH_USER,
//     payload: request
//   };
// };
export const logout = () => {
  // const request = axios.post("/api/users/logout").then(res => res.data);
  const sendToken = JSON.parse(localStorage.getItem("userData")).token;
  const request = axios.post('/users/logout', sendToken, {
    headers: {
      "Authorization": `Bearer ${sendToken}`
    }
  }).then(res => {
    console.log(res.data)
  });

  return {
    type: Types.LOGOUT,
    payload: request
  };
};
