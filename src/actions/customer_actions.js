import * as Types from "../constants/types";
import axios from '../axios';

export const getCustomers = () => {
  const request = axios.get("/usersAll").then(res => res.data);
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
