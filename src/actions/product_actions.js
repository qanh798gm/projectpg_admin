import * as Types from "../constants/types";
import axios from "../axios";

export const getProducts = () => {
  const request = axios.get("/products").then(res => res.data);
  return {
    type: Types.GET_PRODUCTS,
    payload: request
  };
};
export const updateProduct = (id, data) => {
  const request = axios
    .patch(`/products/${id}`, data)
    .then(res => res.data);
  return {
    type: Types.UPDATE_PRODUCT,
    payload: request
  };
};
export const addProduct = datatoSubmit => {
  const request = axios
    .post(`/products`, datatoSubmit)
    .then(response => response.data);

  return {
    type: Types.ADD_PRODUCT,
    payload: request
  };
};

export const clearProduct = () => {
  return {
    type: Types.CLEAR_PRODUCT,
    payload: ""
  };
};
export const deleteProduct = id => dispatch => {
  axios.get(`/api/item/delete/${id}`).then(res =>
    dispatch({
      type: Types.DELETE_PRODUCT,
      payload: id
    })
  );
};
