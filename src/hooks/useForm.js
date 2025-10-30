import { useState } from "react";

export const useForm = (initialForm, validateForm) => {

  const [validateInit, setValidateInit] = useState(false);  
  const [validate, setValidate] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChangeSelect = (value, name) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleChangeCombo = (e) => {
    const { name, value } = e.target;
    const text = e.target.options[e.target.selectedIndex].text;
    setForm({
      ...form,
      [name]: value,[name+"_text"]: text,
    });
  };

  const handleChecked = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.checked,
    });
  };

  const handleBlur = (e) => {
    handleChange(e);
    if(validateInit){
        setErrors(validateForm(form));
    }
  };

  const handleBlurCombo = (e) => {
    handleChangeCombo(e);
    if(validateInit){
        setErrors(validateForm(form));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let cont = 0;
    setValidateInit(true);
    let erroresTemp = validateForm(form);
    setErrors(erroresTemp);
    Object.entries(erroresTemp).forEach(([key, value]) => {
        if(value){
            cont++;
            setValidate(false);
        }
    });
    if(cont){
        return false;
    }else{
        return true;
    }
  };

  return {
    validateInit,
    validate,
    form,
    errors,
    setValidateInit,
    setValidate,
    setForm,
    setErrors,
    handleChange,
    handleChangeCombo,
    handleChangeSelect,
    handleChecked,
    handleBlur,
    handleBlurCombo,
    handleSubmit,
  };
};