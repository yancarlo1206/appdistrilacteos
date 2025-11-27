export const validationsForm = (form) => {
    let errores = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexComments = /^.{1,255}$/;
    let regexText40 = /^.{1,40}$/;

    if (!form.tipoDocumento) {
        errores.tipoDocumento = "Please the field is required.";
    } else {
        errores.tipoDocumento = "";
    }

    if (!form.documento) {
        errores.documento = "Please the field is required.";
    } else if (!regexText40.test(form.documento.trim())) {
        errores.documento = "The field accepts up to 40 characters.";
    } else {
        errores.documento = "";
    }

    if (!form.nombre) {
        errores.nombre = "Please the field is required.";
    } else if (!regexText40.test(form.nombre.trim())) {
        errores.nombre = "The field accepts up to 40 characters.";
    } else {
        errores.nombre = "";
    }

    if (!form.telefono) {
        errores.telefono = "Please the field is required.";
    } else if (!regexText40.test(form.telefono.trim())) {
        errores.telefono = "The field accepts up to 40 characters.";
    } else {
        errores.telefono = "";
    }

    if (!form.direccion) {
        errores.direccion = "Please the field is required.";
    } else if (!regexText40.test(form.direccion.trim())) {
        errores.direccion = "The field accepts up to 40 characters.";
    } else {
        errores.direccion = "";
    }

    if (!form.correo) {
        errores.correo = "Please the field is required.";
    } else if (!regexText40.test(form.correo.trim())) {
        errores.correo = "The field accepts up to 40 characters.";
    } else {
        errores.correo = "";
    }

    if (!form.ciudad) {
        errores.ciudad = "Please the field is required.";
    } else {
        errores.ciudad = "";
    }

    return errores;
};

const RegistroForm = {
    validationsForm,
};

export default RegistroForm;