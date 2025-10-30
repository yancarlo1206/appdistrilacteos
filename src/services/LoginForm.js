export const validationsForm = (form) => {
    let errores = {};

    if (!form.usuario) {
        errores.usuario = "El campo usuario es obligatorio.";
    }else{
        errores.usuario = "";
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