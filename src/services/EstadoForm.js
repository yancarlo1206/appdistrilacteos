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

    return errores;
};

const EstadoForm = {
    validationsForm,
};

export default EstadoForm;