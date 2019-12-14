import React from "react";
import { Button, Badge, message } from "antd";
import { getOrders, updatePayment } from "../actions/report_actions";
import { getCustomers } from "../actions/customer_actions";
import { connect } from "react-redux";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import * as _ from 'lodash';
import { isArray } from "util";
class ManageOrders extends React.Component {
  state = {
    loading: false,
    skip: 0,
    take: 10,
    categories: [],
    id: ""
  };

  componentDidMount() {
    this.props.dispatch(getOrders());
    this.props.dispatch(getCustomers());
    // this.props.dispatch(auth()).then(res => {
    //   console.log(res.payload);
    //   if (!res.payload.isAdmin) {
    //     this.props.history.push("/login");
    //   }
    // });
  }
  onEditStatus = id => {
    if (id) {
      this.props.dispatch(updatePayment(id, { status: "Active" })).then(res => {
        if (res.payload.success) {
          setTimeout(() => {
            this.props.dispatch(getOrders());
            message.success("Update Successfully");
          }, 100);
        }
      });
    }
  };
  showdata = () => {
    let newData = [];
    if (this.props.report.allOrders) {
      newData = this.props.report.allOrders.map((item, i) => {
        return [
          item.ownerEmail
          ,
          `${moment(new Date(item.createdAt)).format("LL")}`,
          <NumberFormat
            value={item.totalPrice}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />,
          item.detail[3],
          item.status,

          <>
            {item.status === "Pending" ? (
              <Button
                type="primary"
                onClick={() => {
                  this.onEditStatus(item._id);
                }}
              >
                Active
              </Button>
            ) : (
                " "
              )}
            &nbsp;
            <Link to={`orderdetail/${item._id}`}>
              <Button style={{ background: "#ba54f5" }}>Detail</Button>
            </Link>
          </>
        ];
      });
    }
    return newData;
  };
  render() {
    const columns = ["Customer Email", "Date", "Amount", "Payment", "Status", "Actions"];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false
    };
    return (
      <>
        <div className="content">
          <MUIDataTable
            title={"Manage Orders"}
            data={this.showdata()}
            columns={columns}
            options={options}
          />
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    report: state.report,
    customer: state.customer
  };
};

export default connect(mapStateToProps)(ManageOrders);
