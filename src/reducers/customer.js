import * as Types from "../constants/types";

export default function(state = {}, action) {
  switch (action.type) {
    case Types.GETALL_CUSTOMER:
      return {
        ...state,
        customers: action.payload.filter(customer => customer.role !== 1)
      };

    case Types.EDIT_CUSTOMER:
      return {
        ...state,
        customer: action.payload
      };

    default:
      return { ...state };
  }
}