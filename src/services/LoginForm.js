export const validationsForm = (form) => {
    let errores = {};

    if (!form.username) {
        errores.username = "El campo usuario es obligatorio.";
    }else{
        errores.username = "";
    }

    if (!form.password) {
        errores.password = "El campo contraseña es obligatorio.";
    }else{
        errores.password = "";
    }

    return errores;
};

const LoginForm = {
    validationsForm,
  };
  
  export default LoginForm;