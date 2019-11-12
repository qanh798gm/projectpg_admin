import React from "react";
import { connect } from "react-redux";
import { getTypes, getBrands } from "../actions/category_actions";
import { withRouter } from "react-router-dom";
import { addProduct, updateProduct } from "../actions/product_actions";
import { Button, Form, Input, Select } from "antd";
import NotificationAlert from "react-notification-alert";
import FileUpload from "../utils/fileupload";
// import CKEditor from "react-ckeditor-component";
const Option = Select.Option;
const { TextArea } = Input;
class Products extends React.Component {
  state = {
    brands: [],
    types: [],
    images: [],
    brand: "",
    type: "",
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
            this.setState({ images: item.images });
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
              brand: { value: item.brand._id },
              quantity: { value: item.quantity > 0 ? item.quantity : 0 },
              types: { value: item.wood._id },
              available: { value: item.available ? 1 : 0 },
              EngineCapacity: { value: item.frets },
              Publish: { value: item.publish ? 1 : 0 },
              shipping: { value: item.shipping ? 1 : 0 }
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
      if (!err) {
        let dataSubmit = {
          images: images,
          name: values.name,
          frets: values.EngineCapacity,
          description: values.description,
          price: values.price,
          brand: values.brand,
          quantity: values.quantity,
          wood: values.types,
          publish: values.Publish === 1 ? true : false,
          shipping: values.shipping === 1 ? true : false,
          available: values.available === 1 ? true : false
        };
        if (edit) {
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
            <Form.Item {...formItemLayout} label="Image">
              <FileUpload
                imagesHandler={images => this.imagesHandler(images)}
                reset={resetImages}
                images={this.state.images}
              />
            </Form.Item>

            <Form.Item {...formItemLayout} label="Name">
              {getFieldDecorator("name", {rules: [{ required: true, message: "Please input your name!" }]}) (
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
              {getFieldDecorator("brand", {
                rules: [{ required: true, message: "Please select a brand!" }]
              })(
                <Select
                  showSearch
                  placeholder="Select a brand"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {brands
                    ? brands.map((brand, i) => (
                        <Option value={brand._id} key={i}>
                          {brand.name}
                        </Option>
                      ))
                    : null}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Category">
              {getFieldDecorator("types", {
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
            <Form.Item {...formItemLayout} label="Available">
              {getFieldDecorator("available", {
                rules: [
                  {
                    required: true,
                    message: "Please select status for available!"
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select a status"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={1}>Yes</Option>
                  <Option value={0}>No</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Shipping">
              {getFieldDecorator("shipping", {
                rules: [
                  {
                    required: true,
                    message: "Please select status for shipping!"
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select a status"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={1}>Yes</Option>
                  <Option value={0}>No</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Engine Capacity">
              {getFieldDecorator("EngineCapacity", {
                rules: [
                  {
                    required: true,
                    message: "Please select a capacity!"
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select a capacity"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={250}>250cc to 750cc</Option>
                  <Option value={750}>750cc to 1000cc</Option>
                  <Option value={1000}>1000cc to 1500cc</Option>
                  <Option value={1500}>Other</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Publish">
              {getFieldDecorator("Publish", {
                rules: [
                  {
                    required: true,
                    message: "Please select a status!"
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select a status"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={1}>Publish</Option>
                  <Option value={0}>Hidden</Option>
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
