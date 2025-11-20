// === Validaciones para el formulario de Aceptar Cliente ===
export const validationsForm = (form) => {
  let errores = {};

  // Expresiones regulares
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  let regexText40 = /^.{1,40}$/;
  let regexComments = /^.{1,255}$/;
  let regexPhone = /^[0-9]{7,15}$/;

  // --- Nombre ---
  if (!form.nombre) {
    errores.nombre = "Please, the name field is required.";
  } else if (!regexName.test(form.nombre.trim())) {
    errores.nombre = "The name only accepts letters and spaces.";
  } else if (!regexText40.test(form.nombre.trim())) {
    errores.nombre = "The name field accepts up to 40 characters.";
  } else {
    errores.nombre = "";
  }

  // --- Dirección ---
  if (!form.direccion) {
    errores.direccion = "Please, the address field is required.";
  } else if (!regexText40.test(form.direccion.trim())) {
    errores.direccion = "The address field accepts up to 40 characters.";
  } else {
    errores.direccion = "";
  }

  // --- Teléfono ---
  if (!form.telefono) {
    errores.telefono = "Please, the phone field is required.";
  } else if (!regexPhone.test(form.telefono.trim())) {
    errores.telefono = "The phone must contain between 7 and 15 digits.";
  } else {
    errores.telefono = "";
  }

  // --- Correo ---
  if (!form.correo) {
    errores.correo = "Please, the email field is required.";
  } else if (!regexEmail.test(form.correo.trim())) {
    errores.correo = "Please, enter a valid email.";
  } else {
    errores.correo = "";
  }

  // --- Comentarios (opcional) ---
  if (form.comentarios && !regexComments.test(form.comentarios.trim())) {
    errores.comentarios = "Comments must be up to 255 characters.";
  }

  return errores;
};

// === Exportación para mantener el mismo estilo que ClienteForm ===
const AceptarService = {
  validationsForm,
};

export default AceptarService;
