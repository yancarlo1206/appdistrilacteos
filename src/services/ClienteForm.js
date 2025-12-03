export const validationsForm = (form) => {
    let errores = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexComments = /^.{1,255}$/;
    let regexText40 = /^.{1,40}$/;
    let regexPhone = /^\d+$/; // Solo números
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato de email

    if (!form.tipoDocumento) {
        errores.tipoDocumento = "Por favor, este campo es obligatorio.";
    } else {
        errores.tipoDocumento = "";
    }

    if (!form.documento) {
        errores.documento = "Por favor, este campo es obligatorio.";
    } else if (!regexText40.test(form.documento.trim())) {
        errores.documento = "El campo acepta hasta 40 caracteres.";
    } else {
        errores.documento = "";
    }

    if (!form.nombre) {
        errores.nombre = "Por favor, este campo es obligatorio.";
    } else if (!regexText40.test(form.nombre.trim())) {
        errores.nombre = "El campo acepta hasta 40 caracteres.";
    } else {
        errores.nombre = "";
    }

    if (!form.telefono) {
        errores.telefono = "Por favor, este campo es obligatorio.";
    } else if (!regexPhone.test(form.telefono.trim())) {
        errores.telefono = "El teléfono solo debe contener números.";
    } else if (!regexText40.test(form.telefono.trim())) {
        errores.telefono = "El campo acepta hasta 40 caracteres.";
    } else {
        errores.telefono = "";
    }

    if (!form.direccion) {
        errores.direccion = "Por favor, este campo es obligatorio.";
    } else if (!regexText40.test(form.direccion.trim())) {
        errores.direccion = "El campo acepta hasta 40 caracteres.";
    } else {
        errores.direccion = "";
    }

    if (!form.correo) {
        errores.correo = "Por favor, este campo es obligatorio.";
    } else if (!regexEmail.test(form.correo.trim())) {
        errores.correo = "Por favor, ingrese un correo electrónico válido.";
    } else if (!regexText40.test(form.correo.trim())) {
        errores.correo = "El campo acepta hasta 40 caracteres.";
    } else {
        errores.correo = "";
    }

    if (!form.ciudad) {
        errores.ciudad = "Por favor, este campo es obligatorio.";
    } else {
        errores.ciudad = "";
    }

    if (!form.clienteEstado) {
        errores.clienteEstado = "Por favor, este campo es obligatorio.";
    } else {
        errores.clienteEstado = "";
    }

    return errores;
};

const RegistroForm = {
    validationsForm,
};

export default RegistroForm;