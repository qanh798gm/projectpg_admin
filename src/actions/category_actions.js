import * as Types from "../constants/types";
import axios from "../axios";
export const getBrands = () => {
  const request = axios.get("/categories").then(res => res.data);
  return {
    type: Types.GET_BRANDS,
    payload: request
  };
};

export const deleteBrand = id => dispatch => {
  axios.get(`/api/brand/delete/${id}`).then(res =>
    dispatch({
      type: Types.DELETE_BRAND,
      payload: id
    })
  );
};
export const addBrand = data => {
  console.log(data);
  const request = axios.post("/api/item/brand", data).then(res => res.data);
  return {
    type: Types.ADD_BRAND,
    payload: request
  };
};
export const editBrand = (id, data) => {
  const request = axios
    .post(`/api/brand/update/${id}`, data)
    .then(res => res.data);
  return {
    type: Types.UPDATE_BRAND,
    payload: request
  };
};
// Category
export const getTypes = () => {
  const request = axios.get("/categories").then(res => res.data);
  return {
    type: Types.GET_TYPES,
    payload: request
  };
};
export const editType = (id, data) => {
  const request = axios
    .patch(`/categories/${id}`, data)
    .then(res => res.data);
  return {
    type: Types.UPDATE_TYPE,
    payload: request
  };
};
export const deleteType = id => dispatch => {
  axios.delete(`/categories/${id}`).then(res =>
    dispatch({
      type: Types.DELETE_TYPE,
      payload: id
    })
  );
};
export const addType = data => {
  const request = axios.post("/categories", data).then(res => res.data);
  return {
    type: Types.ADD_TYPE,
    payload: request
  };
};

