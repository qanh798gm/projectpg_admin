import * as Types from "../constants/types";

export default function(state = {}, action) {
  switch (action.type) {
    case Types.REPORT_MONTH:
      return { ...state, allMonths: action.payload.results };
    case Types.REPORT_DATE:
      return { ...state, data: action.payload.results };
    case Types.GET_ORDERS:
      return { ...state, allOrders: action.payload };
    case Types.UPDATE_PAYMENT:
      return { ...state, order: action.payload };
    case Types.REPORT_PRODUCT:
      return { ...state, data: action.payload.results };
    case Types.REPORT_CUSTOMER:
      return { ...state, dataCustomer: action.payload.results };
    default:
      return { ...state };
  }
}
