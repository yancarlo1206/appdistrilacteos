export const validationsForm = (form) => {
    let errores = {};
    let regexText40 = /^.{1,40}$/;

    if (!form.descripcion) {
        errores.descripcion = "Please the field is required.";
    } else if (!regexText40.test(form.descripcion.trim())) {
        errores.descripcion = "The field accepts up to 40 characters.";
    } else{
        errores.descripcion = "";
    }

    return errores;
};

const CategoriaForm = {
    validationsForm,
  };
  
  export default CategoriaForm;