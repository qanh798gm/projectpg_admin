import React from "react";
import {
  Button,
  Table,
  Divider,
  Form,
  message,
  Popconfirm,
  Spin,
  Icon, Modal, InputNumber
} from "antd";
import { getProducts, deleteProduct } from "../actions/product_actions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import NotificationAlert from "react-notification-alert";
import axios from '../axios'

class ManageProducts extends React.Component {
  state = {
    loading: false,
    visible: false,
    edit: false,
    categories: [],
    id: "",
    allProducts: [],
    quantity: 0,
    stock: 0,
    idToUpdate: '',
    stockModal: false
  };

  componentDidMount() {
    this.props.dispatch(getProducts()).then(res => {
      this.setState({ allProducts: res.payload });
      res.payload.forEach(item => {
        if (item.quantity == 0) {
          var options = {};
          options = {
            place: "tr",
            message: (
              <div>
                <div>
                  <b>Product {item.name} is out of stock!</b>
                </div>
              </div>
            ),
            type: "danger",
            icon: "tim-icons icon-bell-55",
            autoDismiss: 7
          };
          this.refs.notificationAlert.notificationAlert(options);
        }
      });
    });

    // this.props.dispatch(auth()).then(res => {
    //   if (!res.payload.isAdmin) {
    //     this.props.history.push("/login");
    //   }
    // });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.product) {
      this.setState({ allProducts: nextProps.product.allProducts });
    }
  }
  onconfirm = id => {
    this.props.dispatch(deleteProduct(id));
    setTimeout(() => {
      message.success("Delete Successfully");
    }, 180);
  };

  cancel = e => {
    console.log(e);
  };
  showImage = image => {
    return (
      <img src={image} width={50} style={{ borderRadius: "10px" }} alt="" />
    );
  };

  stockHandler = (_id, quantity) => {
    const product = {
      _id: _id,
      quantity: parseInt(quantity),
    }
    const sendToken = JSON.parse(localStorage.getItem("userData")).token;
    axios.post(`/users/addToCart`, product,
      { headers: { "Authorization": `Bearer ${sendToken}` } })
      .then(response => {
        console.log(response)
      })
  }

  onEdit = id => {
    this.setState({ visible: true, edit: true, id });
    const { form, product } = this.props;
    if (product.products) {
      product.products.forEach(item => {
        if (item._id === id) {
          form.setFields({ name: { value: item.name } });
        }
      });
    }
  };

  handleOk = e => {
    console.log(this.state.stock)
    const sendToken = JSON.parse(localStorage.getItem("userData")).token;
    console.log(sendToken)
    console.log(this.state.idToUpdate)
    axios.patch(`/products/${this.state.idToUpdate}`, {
      quantity: this.state.stock
    }, {
      headers: {
        "Authorization": `Bearer ${sendToken}`
      }
    }).then(res => {
      console.log(res)

      this.props.dispatch(getProducts()).then(res => {
        this.setState({ allProducts: res.payload });
        res.payload.forEach(item => {
          if (item.quantity == 0) {
            var options = {};
            options = {
              place: "tr",
              message: (
                <div>
                  <div>
                    <b>Product {item.name} is out of stock!</b>
                  </div>
                </div>
              ),
              type: "danger",
              icon: "tim-icons icon-bell-55",
              autoDismiss: 7
            };
            this.refs.notificationAlert.notificationAlert(options);
          }
        });
      });

      this.setState({
        stockModal: false,
      });
    }).catch(e => {
      console.log(e)
    })



  };

  handleCancel = e => {

    this.setState({
      stockModal: false,
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
      // {
      //   title: "Image",
      //   dataIndex: "Image",
      //   key: "Image"
      // },
      {
        title: "Description",
        dataIndex: "Description",
        key: "Description"
      },
      {
        title: "Price",
        dataIndex: "Price",
        key: "Price"
      },
      {
        title: "Quantity",
        dataIndex: "Quantity",
        key: "Quantity"
      },
      {
        title: "Brand",
        dataIndex: "Brand",
        key: "Brand"
      },
      {
        title: "Category",
        dataIndex: "Category",
        key: "Category"
      },
      {
        title: "Action",
        key: "operation",
        render: (text, record) => (
          <span>
            <Link to={`/admin/edit-product/${record.key}`}>
              {" "}
              <Button>Edit</Button>
            </Link>
            <Divider type="vertical" />
            <Button type="info"
              onClick={() => this.setState({ stockModal: true, stock: record.Quantity, idToUpdate: record.key })}
            >
              Stock
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`Are you sure delete this product ${record.Name}`}
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
    const dataSource = this.state.allProducts
      ? this.state.allProducts.map(item => {
        return {
          key: item._id,
          Name: item.name,
          // Image: item.images.length
          //   ? this.showImage(item.images[0].url)
          //   : "No Image",
          Description: `${item.description.slice(0, 50)}...`,
          Category: item.categoryName,
          Brand: item.brand,
          Price: item.price,
          Quantity: item.quantity,
        };
      })
      : null;

    const { getFieldDecorator } = this.props.form;

    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <div style={{ overflow: "hidden" }}>
            <Link to="/admin/add-Product">
              {" "}
              <Button
                style={{ float: "right", marginBottom: 20 }}
                icon="plus-square"
                onClick={this.showModal}
              >
                Add New Product
              </Button>
            </Link>
          </div>
          {dataSource ? (
            <Table
              bordered
              style={{ background: "#e9ecef" }}
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
          ) : (
              <Spin indicator={antIcon} />
            )}
        </div>

        <Modal
          title="Stock"
          visible={this.state.stockModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="quantity">
            <input type="number" min="0" value={this.state.stock} onChange={(event) => this.setState({ stock: event.target.value })} />
          </div>
        </Modal>

      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    product: state.product
  };
};
const ManageProductsForm = Form.create()(ManageProducts);
export default connect(mapStateToProps)(ManageProductsForm);
