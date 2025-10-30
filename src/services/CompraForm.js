export const validationsForm = (form) => {
    let errores = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexComments = /^.{1,255}$/;
    let regexText40 = /^.{1,40}$/;

    if (!form.proveedor) {
        errores.proveedor = "Please the field is required.";
    } else{
        errores.proveedor = "";
    }

    if (!form.valor) {
        errores.valor = "Please the field is required.";
    } else{
        errores.valor = "";
    }
        
    return errores;
};

const CompraForm = {
    validationsForm,
  };
  
  export default CompraForm;