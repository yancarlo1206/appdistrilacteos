export const validationsForm = (form) => {
    let errores = {};

    if (!form.caracteristica) {
        errores.caracteristica = "Please the field is required.";
    } else{
        errores.caracteristica = "";
    }

    if (!form.valor) {
        errores.valor = "Please the field is required.";
    } else{
        errores.valor = "";
    }
        
    return errores;
};

const ArticuloCaracteristicaForm = {
    validationsForm,
  };
  
  export default ArticuloCaracteristicaForm; 