import { combineReducers } from "redux";
import user from "./user";
import category from "./category";
import product from "./product";
import report from "./report";
import customer from "./customer";
const rootReducer = combineReducers({
  user,
  category,
  product,
  report,
  customer
});
export default rootReducer;
