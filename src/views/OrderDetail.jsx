import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      item: {}
    };
  }
  componentDidMount() {
    const { match, report } = this.props;
    if (typeof match.params !== "undefined" && match.params.id) {
      if (report.allOrders) {
        report.allOrders.forEach(item => {
          if (item._id === match.params.id) {
            console.log(item._id === match.params.id)
            this.setState({ item });
          }
        });
      }
    }
  }

  render() {
    const { item } = this.state;
    return (
      <>
        <div className="content">
          <div className="row">
            <div
              className="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3"
              style={{ flex: "unset", maxWidth: "80%", margin: "0 auto" }}
            >
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6">
                  <address>
                    <strong>QA Store</strong>
                    <br />
                    <em>Address:</em>{" "}
                    {item.data ? (
                      item.data[0].address ? (
                        `${item.data[0].address.line1} ${item.data[0].address.city} ${item.data[0].address.country_code}`
                      ) : (
                          <>
                            {item.data ? item.data[0].Address : ""}
                            <br />
                          </>
                        )
                    ) : null}
                    <abbr title="Phone">Phone:</abbr>{" "}
                    {item.data ? item.data[0].Phone : "0905551967"}
                  </address>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 text-right">
                  <p>
                    <em>
                      Date:{" "}
                      {moment(new Date(item.product ? item.date : "")).format(
                        "LL"
                      )}
                    </em>
                  </p>
                  <p>
                    <em>
                      Receipt #: {item.data ? item.data[0].paymentID : ""}
                    </em>
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="text-center">
                  <h3>Receipt</h3>
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.products
                      ? item.products.map((item, i) => (
                        <tr key={i}>
                          <td className="col-md-9">
                            <em>{item.name}</em>
                          </td>
                          <td
                            className="col-md-1"
                            style={{ textAlign: "center" }}
                          >
                            {" "}
                            {item.quantity}{" "}
                          </td>
                          <td
                            className="col-md-1"
                            style={{ textAlign: "center" }}
                          >
                            <NumberFormat
                              value={item.price}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                            />
                          </td>
                          <td
                            className="col-md-1"
                            style={{ textAlign: "center" }}
                          >
                            <NumberFormat
                              value={parseInt(item.quantity * item.price, 10)}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                            />
                          </td>
                        </tr>
                      ))
                      : null}
                    <tr>
                      <td>   </td>
                      <td>   </td>
                      <td className="text-right">
                        <h4>
                          <strong>Total: </strong>
                        </h4>
                      </td>
                      <td className="text-center text-danger">
                        <h4>
                          <NumberFormat
                            value={item ? item.totalPrice : ""}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </h4>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    report: state.report
  };
};
export default connect(mapStateToProps)(withRouter(OrderDetail));
