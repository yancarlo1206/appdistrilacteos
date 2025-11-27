export const validationsForm = (form) => {
    let errores = {};
    let regexText40 = /^.{1,40}$/;

    if (!form.observacion) {
        errores.observacion = "Please the field is required.";
    } else if (!regexText40.test(form.observacion.trim())) {
        errores.observacion = "The field accepts up to 40 characters.";
    } else {
        errores.observacion = "";
    }

    if (!form.prioridad) {
        errores.prioridad = "Please the field is required.";
    } else {
        errores.prioridad = "";
    }

    if (!form.tipo) {
        errores.tipo = "Please the field is required.";
    } else {
        errores.tipo = "";
    }

    if (!form.estado) {
        errores.estado = "Please the field is required.";
    } else {
        errores.estado = "";
    }

    return errores;
};

const TicketFormValidate = {
    validationsForm,
};

export default TicketFormValidate;
