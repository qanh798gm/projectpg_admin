import * as Types from "../constants/types";

export default function (state = {}, action) {
  switch (action.type) {
    case Types.LOGIN:
      return { ...state, loginSuccess: action.payload };
    case Types.LOGOUT:
      return { ...state, logOutSuccess: action.payload };
    // case Types.AUTH_USER:
    //   return { ...state, userData: action.payload };
    default:
      return state;
  }
}
