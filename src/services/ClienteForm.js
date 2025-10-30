export const validationsForm = (form) => {
    let errores = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexComments = /^.{1,255}$/;
    let regexText40 = /^.{1,40}$/;

    if (!form.nombre) {
        errores.nombre = "Please the field is required.";
    } else if (!regexText40.test(form.nombre.trim())) {
        errores.nombre = "The field accepts up to 40 characters.";
    } else{
        errores.nombre = "";
    }

    if (!form.direccion) {
        errores.direccion = "Please the field is required.";
    } else if (!regexText40.test(form.direccion.trim())) {
        errores.direccion = "The field accepts up to 40 characters.";
    } else{
        errores.direccion = "";
    }

    if (!form.telefono) {
        errores.telefono = "Please the field is required.";
    } else if (!regexText40.test(form.telefono.trim())) {
        errores.telefono = "The field accepts up to 40 characters.";
    } else{
        errores.telefono = "";
    }

    if (!form.correo) {
        errores.correo = "Please the field is required.";
    } else if (!regexText40.test(form.correo.trim())) {
        errores.correo = "The field accepts up to 40 characters.";
    } else{
        errores.correo = "";
    }
        

    return errores;
};

const ClienteForm = {
    validationsForm,
  };
  
  export default ClienteForm;