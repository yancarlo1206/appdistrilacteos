export const validationsForm = (form) => {
    let errores = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexComments = /^.{1,255}$/;
    let regexText40 = /^.{1,40}$/;

    if (!form.articulo) {
        errores.articulo = "Please the field is required.";
    } else{
        errores.articulo = "";
    }

    if (!form.cantidad) {
        errores.cantidad = "Please the field is required.";
    } else{
        errores.cantidad = "";
    }

    if (!form.valor_unitario) {
        errores.valor_unitario = "Please the field is required.";
    } else{
        errores.valor_unitario = "";
    }

    if (!form.valor) {
        errores.valor = "Please the field is required.";
    } else{
        errores.valor = "";
    }
        
    return errores;
};

const ArticuloCompraForm = {
    validationsForm,
  };
  
  export default ArticuloCompraForm;