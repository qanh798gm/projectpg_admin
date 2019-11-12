import React from "react";
import {
  Button,
  Table,
  Divider,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Icon
} from "antd";

import { connect } from "react-redux";
import { getCustomers, editCustomer } from "../actions/customer_actions";
class ManageCustomers extends React.Component {
  state = {
    loading: false,
    visible: false,
    id: ""
  };

  componentDidMount() {
    this.props.dispatch(getCustomers());
  }
  showModal = () => {
    this.props.form.setFields({ name: { value: "" } });
    this.setState({
      visible: true
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
      edit: false
    });
  };
  findName = (brands, name) => {
    var result = -1;
    brands.forEach((brand, index) => {
      if (brand.name === name) {
        result = index;
      }
    });
    return result;
  };
  onEdit = id => {
    this.setState({ visible: true, id });
    const { form, customer } = this.props;
    if (customer.customers) {
      customer.customers.forEach(item => {
        if (item._id === id) {
          form.setFields({
            name: { value: item.name },
            email: { value: item.email }
          });
        }
      });
    }
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { id } = this.state;
    e.preventDefault();

    form.validateFields((err, values) => {
      if ((values.name && values.email) !== "") {
        this.setState({
          loading: true
        });
      }
      if (!err) {
        dispatch(editCustomer(id, values)).then(res => {
          if (res.payload.success) {
            dispatch(getCustomers());
            setTimeout(() => {
              this.setState({ loading: false, visible: false });
              message.success("Update Customer Successfully");
              form.resetFields();
            }, 1500);
          }
        });
      }
    });
  };

  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const columns = [
      {
        title: "First Name",
        dataIndex: "Name",
        key: "Name"
      },
      {
        title: "Email",
        dataIndex: "Email",
        key: "Email"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Button type="primary" onClick={() => this.onEdit(record.key)}>
              {" "}
              Edit Customer
            </Button>
            <Divider type="vertical" />
          </span>
        )
      }
    ];
    const dataSource = this.props.customer.customers
      ? this.props.customer.customers.map(item => {
        return {
          key: item._id,
          Name: item.name,
          Email: item.email
        };
      })
      : null;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <div className="content">
          {dataSource ? (
            <Table
              bordered
              style={{ background: "#e9ecef" }}
              dataSource={dataSource}
              columns={columns}
            />
          ) : (
              <Spin indicator={antIcon} />
            )}
        </div>
        <Modal
          title={"Edit Customer"}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          ]}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Please input first name!" }]
              })(<Input placeholder="First Name" />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("email", {
                rules: [{ required: true, message: "Please input your email!" }]
              })(<Input placeholder="Email" />)}
            </Form.Item>
            <Form.Item />
          </Form>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    customer: state.customer
  };
};
const CustomerForm = Form.create()(ManageCustomers);
export default connect(mapStateToProps)(CustomerForm);