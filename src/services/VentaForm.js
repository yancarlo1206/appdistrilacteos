export const validationsForm = (form) => {
    let errores = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexComments = /^.{1,255}$/;
    let regexText40 = /^.{1,40}$/;

    if (!form.cliente) {
        errores.cliente = "Please the field is required.";
    } else{
        errores.cliente = "";
    }

    if (!form.valor) {
        errores.valor = "Please the field is required.";
    } else{
        errores.valor = "";
    }
        
    return errores;
};

const VentaForm = {
    validationsForm,
  };
  
  export default VentaForm;