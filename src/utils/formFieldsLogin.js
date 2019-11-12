import React from "react";

const FormField = ({ formdata, change, id, name }) => {
  const showError = () => {
    let errorMessage = null;
    if (formdata.validation && !formdata.valid) {
      errorMessage = (
        <div style={{color:'red',marginTop:'-1em'}}>{formdata.validationMessage}</div>
      );
    }
    return errorMessage;
  };
  const renderTemplate = () => {
    let formTemplate = null;
    switch (formdata.element) {
      case "input":
        formTemplate = (
          <div style={{marginTop:'1em'}}>
            <div
              className="wrap-input100 validate-input m-b-23"
              data-validate="Username is reauired"
            >
              <span className="label-input100">{name}</span>
              <input
                className="input100"
                {...formdata.config} // copy formdata.config roi gan gia tri tuong ung cho tung key => exp: placeholder:"Enter your email"
                value={formdata.value}
                onBlur={event => change({ event, id, blur: true })} //Thuộc tính onblur được kích hoạt ngay khi người dùng chuyển con trỏ nháy ra ngoài thẻ.
                onChange={event => change({ event, id })}
              />
              <span className="focus-input100" data-symbol="&#xf206;" />
            </div>
            {showError()}
          </div>
        );
        break;

      default:
        formTemplate = null;
    }

    return formTemplate;
  };
  return <div>{renderTemplate()}</div>;
};

export default FormField;
