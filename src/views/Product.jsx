import React from "react";
import { connect } from "react-redux";
import { getTypes, getBrands } from "../actions/category_actions";
import { withRouter } from "react-router-dom";
import { addProduct, updateProduct } from "../actions/product_actions";
import { Button, Form, Input, Select, Upload, Icon } from "antd";
import NotificationAlert from "react-notification-alert";
import FileUpload from "../utils/fileupload";
// import CKEditor from "react-ckeditor-component";
import axios from '../axios'
const Option = Select.Option;
const { TextArea } = Input;


class Products extends React.Component {
  state = {
    brands: [],
    types: [],
    images: [],
    brand: "",
    type: "",
    categoryID: "",
    loading: false,
    resetImages: false,
    edit: false
  };
  componentWillMount() {
    const { match, product } = this.props;
    if (
      typeof match.params !== "undefined" &&
      match.params.id
    ) {
      if (product.allProducts) {
        product.allProducts.forEach(item => {
          if (item._id === match.params.id) {
            this.setState({ images: item.image });
          }
        });
      }
    }
  }
  componentDidMount() {
    const { form, match, product } = this.props;
    if (
      typeof this.props.match.params !== "undefined" &&
      this.props.match.params.id
    ) {
      this.setState({ edit: true });
      if (product.allProducts) {
        product.allProducts.forEach(item => {
          if (item._id === match.params.id) {
            form.setFields({
              description: { value: item.description },
              name: { value: item.name },
              price: { value: item.price },
              brand: { value: item.brand },
              quantity: { value: item.quantity > 0 ? item.quantity : 0 },
              categoryID: { value: item.categoryID }
            });
          }
        });
      }
    }
    this.props.dispatch(getBrands()).then(res => {
      this.setState({ brands: res.payload });
    });
    this.props.dispatch(getTypes()).then(res => {
      this.setState({ types: res.payload });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ resetImages: false });
  }
  imagesHandler = images => {
    this.setState({ images });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { images, edit } = this.state;
    const { form, match } = this.props;
    this.setState({ loading: true });
    form.validateFields((err, values) => {
      let categoryName = '';
      const sendToken = JSON.parse(localStorage.getItem("userData")).token;
      axios.get(`/categories/${values.categoryID}`, sendToken, {
        headers: {
          "Authorization": `Bearer ${sendToken}`
        }
      }).then(res => {
        categoryName = res.data
      })
      if (!err) {
        let dataSubmit = {
          image: images,
          name: values.name,
          description: values.description,
          price: values.price,
          brand: values.brand,
          categoryID: values.categoryID,
          categoryName: categoryName,
          quantity: values.quantity,
        };
        if (edit) {
          console.log('edit')
          this.props
            .dispatch(updateProduct(match.params.id, dataSubmit))
            .then(res => {
              if (res.payload.success) {
                this.setState({
                  loading: false,
                  resetImages: true,
                  images: []
                });
                this.props.history.goBack();
              }
            });
        } else {
          console.log(this.state.images)
          console.log('add')
          this.props.dispatch(addProduct(dataSubmit)).then(res => {
            if (res.payload.success) {
              this.setState({ loading: false, resetImages: true, images: [] });
              setTimeout(() => {
                var options = {};
                options = {
                  place: "tr",
                  message: (
                    <div>
                      <div>
                        <b>Add Product Successfully!</b>
                      </div>
                    </div>
                  ),
                  type: "success",
                  icon: "tim-icons icon-bell-55",
                  autoDismiss: 7
                };
                this.refs.notificationAlert.notificationAlert(options);
              }, 200);
              form.resetFields();
            } else {
              this.setState({ loading: false });
              var options = {};
              options = {
                place: "tr",
                message: (
                  <div>
                    <div>
                      <b>The brand name already exists</b>
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
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };
  handleChange = date => {
    console.log(`${date}-01-01`);
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const { brands, types, loading, resetImages } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <div className="content">
          {/* <YearPicker onChange={this.handleChange} /> */}
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Form
            onSubmit={this.handleSubmit}
            className="login-form"
            style={{ width: "70%", margin: "0 auto" }}
          >
            {/* <Form.Item {...formItemLayout} label="Image">
              <FileUpload
                imagesHandler={images => this.imagesHandler(images)}
                reset={resetImages}
                images={this.state.images}
              />
              {getFieldDecorator("image", {
                rules: [{ required: true, message: "Please upload image!" }], valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload name="logo" listType="picture">
                  <Button>
                    <Icon type="upload" /> Click to upload
                </Button>
                </Upload>,
              )}

            </Form.Item> */}

            <Form.Item {...formItemLayout} label="Name">
              {getFieldDecorator("name", { rules: [{ required: true, message: "Please input your name!" }] })(
                <Input placeholder="Name" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Description">
              {getFieldDecorator("description", {
                rules: [
                  { required: true, message: "Please input description!" }
                ]
              })(
                <TextArea
                  placeholder="Description"
                  autosize={{ minRows: 4, maxRows: 8 }}
                />
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="Price">
              {getFieldDecorator("price", {
                rules: [{ required: true, message: "Please input price!" }]
              })(<Input placeholder="Price" type="number" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Quantity">
              {getFieldDecorator("quantity", {
                rules: [{ required: true, message: "Please input quantity!" }]
              })(<Input placeholder="Quantity" type="number" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Brand">
              {getFieldDecorator("brand", { rules: [{ required: true, message: "Please input your brand!" }] })(
                <Input placeholder="Brand" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Category">
              {getFieldDecorator("categoryID", {
                rules: [
                  { required: true, message: "Please select a category!" }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {types
                    ? types.map((type, i) => (
                      <Option value={type._id} key={i}>
                        {type.name}
                      </Option>
                    ))
                    : null}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
                style={{ float: "right" }}
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    category: state.category,
    product: state.product
  };
};
const ProductsForm = Form.create()(Products);
export default connect(mapStateToProps)(withRouter(ProductsForm));
