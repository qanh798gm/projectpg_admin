export const validate = (element, formdata = []) => {
    let error = [true, ""];
    if (element.validation.email) {
        var regularexpressions = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const valid = regularexpressions.test(String(element.value).toLowerCase());
        const message = `${!valid ? "Must be a valid email" : ""}`;
        error = !valid ? [valid, message] : error;
    }
    if (element.validation.required) {
        const valid = element.value.trim() !== "";
        const message = `${!valid ? "This field is required" : ""}`;
        error = !valid ? [valid, message] : error;
    }
    if (element.validation.confirm) {
        var valid =  element.value.trim() === formdata[element.validation.confirm].value;
       
        const message = `${!valid ? "Password do not match" : ""}`;
        error = !valid ? [valid, message] : error;
    }
    return error;
};
export const update = (element, formdata, formName) => {
    const newFormdata = {
        ...formdata
    };
    const newElement = {
        ...newFormdata[element.id]
    };
    newElement.value = element.event.target.value; // element bao la tu onChange of formfield truyen ra
    if (element.blur) {
        let validData = validate(newElement, formdata);
        newElement.valid = validData[0]; //true or false
        newElement.validationMessage = validData[1]; // '' or 'This field is required'
    }
    newElement.touched = element.blur;
    newFormdata[element.id] = newElement;

    return newFormdata;
};
export const generateData = (formdata, formName) => {
    let dataToSubmit = {};

    for (let key in formdata) {
        if(key !== 'confirmPassword' ){
            dataToSubmit[key] = formdata[key].value;
        }
        
    }
    return dataToSubmit;
};

export const isFormValid = (formdata, formName) => {
    let formIsValid = true;

    for (let key in formdata) {
        // console.log('1:' +formIsValid)
        formIsValid =  formIsValid && formdata[key].valid ; //formIsvalid(2) la gia tri cua lan lap dau. Cu moi lan lap qua la moi gia tri khac nhau
        // console.log('12 : '+formIsValid, formdata[key].valid)
        // console.log('2:' +formIsValid)
    }
   
    return formIsValid;
};
