import * as Types from "../constants/types";

export default function(state = {}, action) {
  switch (action.type) {
    case Types.GET_BRANDS:
      return { ...state, brands: action.payload };
    case Types.GET_TYPES:
      return { ...state, types: action.payload };
    case Types.DELETE_TYPE:
      return {
        ...state,
        types: state.types.filter(type => type._id !== action.payload)
      };
    case Types.ADD_TYPE:
      return {
        ...state,
        addTypes: action.payload.types
      };
    case Types.UPDATE_TYPE:
      return {
        ...state,
        type: action.payload
      };
    case Types.DELETE_BRAND:
      return {
        ...state,
        brands: state.brands.filter(brand => brand._id !== action.payload)
      };
    case Types.ADD_BRAND:
      return {
        ...state,
        addBrands: action.payload.brands
      };
    case Types.UPDATE_BRAND:
      return {
        ...state,
        brand: action.payload
      };
    default:
      return { ...state };
  }
}
