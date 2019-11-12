import * as Types from "../constants/types";

export default function(state = {}, action) {
  switch (action.type) {
    case Types.GET_PRODUCTS:
      return {
        ...state,
        allProducts: action.payload
      };
    case Types.ADD_PRODUCT:
      return { ...state, addProduct: action.payload };
    case Types.DELETE_PRODUCT:
      return {
        ...state,
        allProducts: state.allProducts.filter(
          product => product._id !== action.payload
        )
      };
    case Types.CLEAR_PRODUCT:
      return { ...state, addProduct: action.payload };
    case Types.UPDATE_PRODUCT:
      return {
        ...state,
        product: action.payload
      };
    default:
      return state;
  }
}
