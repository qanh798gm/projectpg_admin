import React from "react";
import {
  Button,
  Table,
  Divider,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Spin,
  Icon
} from "antd";
import {
  getTypes,
  deleteType,
  addType,
  editType
} from "../actions/category_actions";
import { connect } from "react-redux";
class Categories extends React.Component {
  state = {
    loading: false,
    visible: false,
    edit: false,
    categories: [],
    id: ""
  };

  componentDidMount() {
    this.props.dispatch(getTypes());
    // this.props.dispatch(auth()).then(res => {
    //   console.log(res.payload);
    //   if (!res.payload.isAdmin) {
    //     this.props.history.push("/login");
    //   }
    // });
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
  findName = (categories, name) => {
    var result = -1;
    categories.forEach((category, index) => {
      if (category.name === name) {
        result = index;
      }
    });
    return result;
  };
  onEdit = id => {
    this.setState({ visible: true, edit: true, id });
    const { form, category } = this.props;
    if (category.types) {
      category.types.forEach(item => {
        if (item._id === id) {
          form.setFields({ name: { value: item.name } });
        }
      });
    }
  };
  onconfirm = id => {
    this.props.dispatch(deleteType(id));
    setTimeout(() => {
      message.success("Delete Successfully");
    }, 180);
  };
  handleSubmit = e => {
    const { category, dispatch, form } = this.props;
    const { edit, id } = this.state;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (values.name !== undefined) {
        this.setState({
          loading: true
        });
      }
      if (!err) {
        if (category.types) {
          if (edit) {
            let index = this.findName(category.types, values.name);
            if (index === -1) {
              dispatch(editType(id, values));
              setTimeout(() => {
                this.setState({ loading: false, visible: false, edit: false });
                dispatch(getTypes());
                message.success("Update Successfully");
                form.resetFields();
              }, 1000);
            } else {
              this.setState({ loading: false });
              message.error("The category name already exists");
            }
          } else {
            let index = this.findName(category.types, values.name);
            if (index === -1) {
              dispatch(addType(values));
              setTimeout(() => {
                this.setState({ loading: false });
                dispatch(getTypes());
                message.success("Add Successfully");
                form.resetFields();
              }, 1000);
            } else {
              this.setState({ loading: false });
              message.error("The brand name already exists");
            }
          }
        }
      }
    });
  };

  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const columns = [
      {
        title: "Name",
        dataIndex: "Name",
        key: "Name"
      },
      {
        title: "Type",
        dataIndex: "Type",
        key: "Type"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Button onClick={() => this.onEdit(record.key)}>Edit</Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`Are you sure delete this brand ${record.Name}`}
              onConfirm={() => this.onconfirm(record.key)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </span>
        )
      }
    ];
    const dataSource = this.props.category.types
      ? this.props.category.types.map(item => {
        return {
          key: item._id,
          Name: item.name,
          Type: item.type
        };
      })
      : null;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <div className="content">
          <div style={{ overflow: "hidden" }}>
            <Button
              style={{ float: "right", marginBottom: 20 }}
              icon="plus-square"
              onClick={this.showModal}
            >
              Add New Category
            </Button>
          </div>
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
          title={this.state.edit ? "Edit Category" : "Add New Category"}
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
                rules: [
                  { required: true, message: "Please input category name!" }
                ]
              })(<Input placeholder="Name" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("type", {
                rules: [
                  { required: true, message: "Please input type!" }
                ]
              })(<Input placeholder="Type" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("description", {
                rules: [
                  { required: true, message: "Please input description!" }
                ]
              })(<Input placeholder="Description" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    category: state.category
  };
};
const CategoriesForm = Form.create()(Categories);
export default connect(mapStateToProps)(CategoriesForm);
