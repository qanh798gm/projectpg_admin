import * as Types from "../constants/types";
import axios from '../axios';

export const getCustomers = () => {
  const sendToken = JSON.parse(localStorage.getItem("userData")).token;
  const request = axios.get("/users", { headers: { "Authorization": `Bearer ${sendToken}` } }).then(res => res.data);
  return {
    type: Types.GETALL_CUSTOMER,
    payload: request
  };
};

export const editCustomer = (id, data) => {
  const request = axios
    .post(`/api/client/update/${id}`, data)
    .then(res => res.data);
  return {
    type: Types.EDIT_CUSTOMER,
    payload: request
  };
};
