// src/services/TicketsForm.js

const TicketsFormValidate = {
  validationsForm: (form) => {
    let errors = {};

    if (!form.fecha.trim()) {
      errors.fecha = "La fecha es obligatoria";
    }

    if (!form.tipo.trim()) {
      errors.tipo = "El tipo es obligatorio";
    }

    if (!form.prioridad.trim()) {
      errors.prioridad = "La prioridad es obligatoria";
    }

    if (!form.estado.trim()) {
      errors.estado = "El estado es obligatorio";
    }

    if (!form.observacion.trim()) {
      errors.observacion = "La observación es obligatoria";
    }

    return errors;
  },
};

export default TicketsFormValidate;
