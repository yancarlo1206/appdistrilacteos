import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import AceptarContext from "context/AceptarContext";
import NotificationContext from "context/NotificationContext";
import AuthFooter from "components/Footers/AuthFooter";
import ReactBSAlert from "react-bootstrap-sweetalert";

function FormularioCliente() {
  const [focus, setFocus] = useState({});

  const setFocusState = (name, value) => {
    setFocus((prev) => ({ ...prev, [name]: value }));
  };
  const [focusModal, setFocusModal] = useState({});
  const setFocusModalState = (name, value) => {
    setFocusModal((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    tipoDocumento: "",
    documento: "",
    nombre: "",
    telefono: "",
    direccion: "",
    correo: "",
    ciudad: "",
    observacion: "",
  });

  const { addClientePendiente } = useContext(AceptarContext);
  const { addNotification } = useContext(NotificationContext);

  const [modalEstado, setModalEstado] = useState(false);
  const [docBusqueda, setDocBusqueda] = useState("");
  const [tipoDocBusqueda, setTipoDocBusqueda] = useState("");
  const [resultadoEstado, setResultadoEstado] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [estadoSolicitud, setEstadoSolicitud] = useState({
    estado: "",
    progreso: 0,
    pasos: [
      { id: 1, label: "En Proceso", completed: false, active: false },
      { id: 2, label: "En Revisión", completed: false, active: false },
      { id: 3, label: "Resultado Final", completed: false, active: false },
    ],
  });

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  // 🔹 Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentoRes, ciudadRes] = await Promise.all([
          fetch(`${API_URL}tipodocumento`).then((res) => res.json()),
          fetch(`${API_URL}ciudad`).then((res) => res.json()),
        ]);

        setTiposDocumento(documentoRes.data || []);
        setCiudades(ciudadRes.data || []);
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      }
    };
    fetchData();
  }, [API_URL]);

  // 🔹 Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // 🔹 Confirmación de envío
  const confirmarEnvio = (e) => {
    e.preventDefault();

    const vaciosCliente = Object.entries(formData)
      .filter(([key, value]) => key !== "observacion" && value.trim() === "")
      .map(([key]) => key);

    if (vaciosCliente.length > 0) {
      setAlert(
        <ReactBSAlert
          warning
        style={{
          animation: "shake 0.3s ease-in-out",
          backgroundColor: "hsla(0, 100%, 98%, 1.00)",
          borderRadius: "2rem",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          border: "none",
        }}
          title={
            <span
              style={{ fontSize: "22px", fontWeight: "700", color: "#d68910" }}
            >
              ⚠ Campos incompletos
            </span>
          }
          onConfirm={() => setAlert(null)}
          confirmBtnCssClass="alert-confirm-btn"
          confirmBtnText="Entendido"
        >
          <p style={{ fontSize: "16px", marginTop: "10px" }}>
            Por favor completa todos los campos obligatorios antes de continuar.
          </p>
        </ReactBSAlert>
      );
      return;
    }

    setAlert(
      <ReactBSAlert
        info
        style={{
          animation: "shake 0.3s ease-in-out",
          backgroundColor: "hsla(0, 100%, 98%, 1.00)",
          borderRadius: "2rem",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          border: "none",
        }}
        className="alert-custom-container"
        showCancel
        confirmBtnText="Sí, enviar"
        cancelBtnText="Cancelar"
        confirmBtnCssClass="alert-btn-confirm"
        cancelBtnCssClass="alert-confirm-btn"
        title="¿Enviar información?"
        onConfirm={async () => {
          setAlert(null);
          await handleSubmit();
        }}
        onCancel={() => setAlert(null)}
      >
        ¿Seguro que deseas enviar la información del cliente?
      </ReactBSAlert>
    );
  };

  // 🔹 Enviar formulario (POST con validación previa)
  const handleSubmit = async (e = null) => {
    if (e) e.preventDefault();
    // setIsLoading(true);
    setShowMessage(false);

    try {
      // ✅ Verificar si el cliente ya existe
      const checkResponse = await fetch(`${API_URL}cliente`);
      const checkData = await checkResponse.json();

      const clienteExistente = checkData.data?.find(
        (c) => c.documento === formData.documento
      );
      if (clienteExistente) {
        setAlert(
          <ReactBSAlert
            warning
             style={{
          animation: "shake 0.3s ease-in-out",
          backgroundColor: "hsla(0, 100%, 98%, 1.00)",
          borderRadius: "2rem",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          border: "none",
        }}
            title={
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#d68910",
                }}
              >
                ⚠ Cliente ya registrado
              </span>
            }
            onConfirm={() => setAlert(null)}
            confirmBtnCssClass="alert-confirm-btn"
            confirmBtnText="Entendido"
          >
            ⚠️ Ya existe un registro con este número de documento.
            <br />
            No se puede registrar nuevamente.
          </ReactBSAlert>
        );
        // setIsLoading(false);
        return;
      }

      // ✅ Crear cuerpo con estado "En proceso" (id = 1)
      const body = {
        tipodocumento: { id: parseInt(formData.tipoDocumento) },
        documento: formData.documento,
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion,
        correo: formData.correo,
        ciudad: { id: parseInt(formData.ciudad) },
        observacion: formData.observacion,
        clienteestado: { id: 1 }, // Estado fijo "En proceso"
      };

      // console.log(" Enviando cliente:", JSON.stringify(body, null, 2));

      const response = await fetch(`${API_URL}cliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        const clienteCreado = result.data;

        addClientePendiente(clienteCreado);
        addNotification({
          id: clienteCreado.id,
          mensaje: `Nuevo registro: ${clienteCreado.nombre}`,
          estado: "En proceso",
          fecha: new Date().toISOString(),
        });

        setAlert(
          <ReactBSAlert
            success
            // className="alert-custom-container"
            confirmBtnText="Entendido"
            confirmBtnCssClass="alert-btn-confirm"
             style={{
          animation: "shake 0.3s ease-in-out",
          backgroundColor: "hsla(0, 100%, 98%, 1.00)",
          borderRadius: "2rem",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          border: "none",
        }}
            title={
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#58AB01",
                }}
              >
                ✔ Registro exitoso
              </span>
            }
            onConfirm={() => setAlert(null)}
          >
            ¡Cliente registrado exitosamente!
          </ReactBSAlert>
        );

        setFormData({
          tipoDocumento: "",
          documento: "",
          nombre: "",
          telefono: "",
          direccion: "",
          correo: "",
          ciudad: "",
          observacion: "",
        });
      } else {
        setAlert(
           <ReactBSAlert
          danger
          style={{
          animation: "shake 0.3s ease-in-out",
          backgroundColor: "hsla(0, 100%, 98%, 1.00)",
          borderRadius: "2rem",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          border: "none",
        }}
          title={
            <span
              style={{ fontSize: "22px", fontWeight: "700", color: "red" }}
            >
              ⚠ Error al registrar
            </span>
          }
          onConfirm={() => setAlert(null)}
           confirmBtnCssClass="alert-confirm-btn"
          confirmBtnText="Entendido"
        >
          "Error al enviar la solicitud. Verifique los campos e intente
          nuevamente."
        </ReactBSAlert>
          // <ReactBSAlert
          //   danger
          //   style={{
          //     animation: "shake 0.3s ease-in-out",
          //     backgroundColor: "rgba(235, 235, 235, 0.7)",
          //     borderRadius: "2rem",
          //     boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          //     padding: "20px",
          //     backdropFilter: "blur(6px)",
          //     transform: "translateY(-10px)",
          //     border: "none",
          //   }}
          //   title={
          //     <span
          //       style={{
          //         fontSize: "22px",
          //         fontWeight: "700",
          //         color: "#d68910",
          //       }}
          //     >
          //       ⚠ Error al registrar
          //     </span>
          //   }
          //   onConfirm={() => setAlert(null)}
          //   confirmBtnCssClass="alert-confirm-btn"
          //   confirmBtnText="Entendido"
          // >
          //   Error al registrarse.
          // </ReactBSAlert>
        );
      }
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      setAlert(
        <ReactBSAlert
            danger
         style={{
          animation: "shake 0.3s ease-in-out",
          backgroundColor: "hsla(0, 100%, 98%, 1.00)",
          borderRadius: "2rem",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          border: "none",
        }}
            title={
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#d68910",
                }}
              >
                ⚠ Error al registrar
              </span>
            }
            onConfirm={() => setAlert(null)}
            confirmBtnCssClass="alert-confirm-btn"
            confirmBtnText="Entendido"
          >
            Error al registrarse.
          </ReactBSAlert>
        // <ReactBSAlert
        //   danger
        //   style={{
        //     animation: "shake 0.3s ease-in-out",
        //     backgroundColor: "rgba(235, 235, 235, 0.7)",
        //     borderRadius: "2rem",
        //     boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
        //     padding: "20px",
        //     backdropFilter: "blur(6px)",
        //     transform: "translateY(-10px)",
        //     border: "none",
        //   }}
        //   title={
        //     <span
        //       style={{ fontSize: "22px", fontWeight: "700", color: "#d68910" }}
        //     >
        //       ⚠ Error al registrar
        //     </span>
        //   }
        //   onConfirm={() => setAlert(null)}
        // >
        //   "Error al enviar la solicitud. Verifique los campos e intente
        //   nuevamente."
        // </ReactBSAlert>
      );
    } finally {
      // setIsLoading(false);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  };

  const toggleModalEstado = () => {
    setModalEstado(!modalEstado);
    setResultadoEstado(null);
    setDocBusqueda("");
    setTipoDocBusqueda("");
    setEstadoSolicitud({
      estado: "",
      progreso: 0,
      pasos: [
        { id: 1, label: "En Proceso", completed: false, active: false },
        { id: 2, label: "En Revisión", completed: false, active: false },
        { id: 3, label: "Resultado Final", completed: false, active: false },
      ],
    });
  };

  const [erroresBusqueda, setErroresBusqueda] = useState({
    tipo: false,
    numero: false,
  });

  const handleBuscarEstado = async () => {
    if (!tipoDocBusqueda || !docBusqueda) {
      setErroresBusqueda({
        tipo: !tipoDocBusqueda,
        numero: !docBusqueda,
      });
      return;
    } else {
      // si ambos campos están completos, limpiamos los errores
      setErroresBusqueda({ tipo: false, numero: false });
    }

    setLoadingEstado(true);
    setResultadoEstado(null);

    try {
      // ✅ Llamada correcta al endpoint con ambos parámetros
      const response = await fetch(
        `${API_URL}cliente/estado?documento=${docBusqueda}&tipoDocumento=${tipoDocBusqueda}`
      );

      const result = await response.json();

      // ⚠️ Si no se encontró el cliente
      if (!response.ok || !result.data) {
        setResultadoEstado("Cliente no encontrado, regístrate.");
        setEstadoSolicitud(null); // ❗️ Esto oculta la línea de tiempo
        return;
      }

      // ✅ Si el cliente existe
      const estado =
        result.data.estado
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") || "en proceso";

      let newEstado = {
        estado: result.data.estado,
        progreso: 0,
        pasos: [
          { id: 1, label: "En Proceso", completed: false, active: false },
          { id: 2, label: "En Revisión", completed: false, active: false },
          { id: 3, label: "Resultado Final", completed: false, active: false },
        ],
      };

      if (estado.includes("proceso")) {
        newEstado.progreso = 33;
        newEstado.pasos[0].completed = true;
        newEstado.pasos[0].active = true;
      } else if (estado.includes("revision")) {
        newEstado.progreso = 66;
        newEstado.pasos[0].completed = true;
        newEstado.pasos[1].completed = true;
        newEstado.pasos[1].active = true;
      } else if (
        estado.includes("aceptado") ||
        estado.includes("aprobado") ||
        estado.includes("final") ||
        estado.includes("completado")
      ) {
        newEstado.progreso = 100;
        newEstado.pasos.forEach((p) => (p.completed = true));
        newEstado.pasos[2].active = true;
      } else if (estado.includes("rechazado")) {
        newEstado.progreso = 100;
        newEstado.pasos.forEach((p) => (p.completed = true));
        newEstado.pasos[2].active = true;
      }

      // ✅ Actualizar estados en pantalla
      setEstadoSolicitud(newEstado);
      setResultadoEstado(
        `${result.data.estado}${
          result.data.activo ? " (Activo)" : " (Inactivo)"
        }`
      );
    } catch (error) {
      console.error("❌ Error consultando estado:", error);
      setResultadoEstado("Error consultando el estado del cliente.");
    } finally {
      setLoadingEstado(false);
    }
  };

  // 🔹 Estilos reutilizados (los mismos del Login)
  const fieldContainer = {
    position: "relative",
    marginBottom: "35px",
  };
  const inputStyle = {
    fontSize: "16px",
    padding: "10px 10px 10px 5px",
    display: "block",
    width: "100%",
    border: "none",
    borderBottom: "2px solid rgba(0, 0, 0, 0.6)",
    background: "transparent",
    color: "gray",
    transition: "border-color 0.2s ease",
    outline: "none",
  };

  const labelStyle = {
    color: "gray",
    fontSize: "16px",
    fontWeight: "400",
    position: "absolute",
    pointerEvents: "none",
    left: "5px",
    top: "10px",
    transition:
      "top 0.05s ease-out, font-size 0.05s ease-out, color 0.05s linear",
  };

  return (
    <Container
      className="mt-5"
      fluid
      style={{
        backgroundColor: "transparent",
      }}
    >
      {alert}
      <style>
        {`
  .input-group,
  .input-group-alternative,
  .input-group-alternative .form-control,
  .input-group-alternative .input-group-text {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
  input, select, textarea {
    background: transparent !important;
  }
  input:focus, select:focus, textarea:focus {
    outline: none !important;
    }

    /* estilos del modal */
    .modal-content {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  .modal-header {
    border-bottom: none !important;
  }

  .modal-body {
    padding-top: 0 !important;
  }

  /* Aumentar el tamaño de la X del modal */
  .modal-header .close {
    font-size: 2rem !important;
    color: #333 !important;
    opacity: 0.8;
  }
    @keyframes shake {
  0% { transform: translateX(0px); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-6px); }
  100% { transform: translateX(0px); }
}
  .alert-confirm-btn {
  background: linear-gradient(90deg, #ff4d4d 0%, #cc0000 100%) !important;
  border: none !important;
  border-radius: 20px !important;
  color: #fff !important;
  font-weight: 600 !important;
  padding: 12px 20px !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
  transition: all 0.3s ease !important;
}

.alert-confirm-btn:hover {
  filter: brightness(1.1);
}
/* Animación shake */
@keyframes shake {
  0% { transform: translateX(0px); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-6px); }
  100% { transform: translateX(0px); }
}

/* Estilo del botón confirmar (Sí, enviar) */
.alert-btn-confirm {
  background: linear-gradient(90deg, #84C63B 0%, #58AB01 100%) !important;
  border: none !important;
  border-radius: 20px !important;
  color: #fff !important;
  font-weight: 600 !important;
  padding: 12px 25px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

.alert-btn-confirm:hover {
  filter: brightness(1.1);
}

/* Estilo del botón cancelar */
.alert-btn-cancel {
  background: #EBEBEB !important;
  color: #444 !important;
  border-radius: 20px !important;
  font-weight: 600 !important;
  padding: 12px 25px !important;
  border: none !important;
  transition: 0.3s ease !important;
}

.alert-btn-cancel:hover {
  background: #dcdcdc !important;
}

/* Quitar el fondo blanco redondo del ícono de éxito */
.sweet-alert .sa-icon.sa-success::before,
.sweet-alert .sa-icon.sa-success::after,
.sweet-alert .sa-icon.sa-success .sa-fix {
  background: transparent !important;
  display: none !important;
}

/* Quitar el círculo blanco grande */
.sweet-alert .sa-icon.sa-success {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

 


`}
      </style>

      {/* 🔸 Modal de carga */}
      {/* <Modal
        isOpen={isLoading}
        className="modal-dialog-centered"
        backdrop="static"
      >
        <ModalBody
          className="text-center py-5"
          style={{
            backgroundColor: "rgba(235,235,235,0.9)",
            borderRadius: "1.5rem",
            boxShadow: "14px 16px 25px rgba(0,0,0,0.6)",
          }}
        >
          <Spinner
            style={{ width: "3rem", height: "3rem", color: "#58ab01" }}
          />
          <h4 className="mt-3">Procesando solicitud...</h4>
        </ModalBody>
      </Modal> */}

      {/* 🔸 Modal resultado */}
      {/* <Modal isOpen={showMessage} toggle={() => setShowMessage(false)} centered>
        <div
          style={{
            backgroundColor: "rgba(235,235,235,0.9)",
            borderRadius: "1.5rem",
            boxShadow: "14px 16px 25px rgba(0,0,0,0.6)",
          }}
        >
          <ModalHeader toggle={() => setShowMessage(false)}>
            Resultado
          </ModalHeader>
          <ModalBody className="text-center py-4">
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {submitStatus.type === "success" ? (
                <i
                  style={{ color: "#58ab01" }}
                  className="fas fa-check-circle"
                ></i>
              ) : (
                <i
                  style={{ color: "#e63946" }}
                  className="fas fa-times-circle"
                ></i>
              )}
            </div>
            <h5 style={{ whiteSpace: "pre-line" }}>{submitStatus.message}</h5>
          </ModalBody>
        </div>
      </Modal> */}

      {/* 🔹 Modal Ver Estado */}
      <Modal
        isOpen={modalEstado}
        toggle={toggleModalEstado}
        centered
        className=" shadow border-0"
      >
        <div
           style={{
            backgroundColor: "hsla(0, 100%, 98%, 1.00)",
            borderRadius: "2rem",
            boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
            padding: "20px",
            backdropFilter: "blur(6px)",
            transform: "translateY(-10px)",
            border: "none",
          }}

        >
          <ModalHeader toggle={toggleModalEstado} >Consultar Estado</ModalHeader>
          <ModalBody>
            {/* TIPO DE DOCUMENTO */}
            <FormGroup style={fieldContainer}>
              <select
                name="tipoDocBusqueda"
                style={{
                  ...inputStyle,
                  borderBottom: erroresBusqueda.tipo
                    ? "2px solid #e63946"
                    : "2px solid rgba(0,0,0,0.6)",
                }}
                value={tipoDocBusqueda}
                onChange={(e) => setTipoDocBusqueda(e.target.value)}
                onFocus={() => setFocusModalState("tipoDoc", true)}
                onBlur={() => setFocusModalState("tipoDoc", false)}
              >
                <option value=""></option>
                {tiposDocumento.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.descripcion}
                  </option>
                ))}
              </select>

              <label
                htmlFor="tipoDocBusqueda"
                style={{
                  ...labelStyle,
                  top:
                    focusModal["tipoDoc"] || tipoDocBusqueda !== ""
                      ? "-20px"
                      : "10px",
                  fontSize:
                    focusModal["tipoDoc"] || tipoDocBusqueda !== ""
                      ? "13px"
                      : "16px",
                }}
              >
                Tipo de Documento
              </label>
            </FormGroup>

            {/* NÚMERO DE DOCUMENTO */}
            <FormGroup style={fieldContainer}>
              <input
                type="number"
                name="docBusqueda"
                style={{
                  ...inputStyle,
                  borderBottom: erroresBusqueda.numero
                    ? "2px solid #e63946"
                    : "2px solid rgba(0,0,0,0.6)",
                }}
                value={docBusqueda}
                onChange={(e) => setDocBusqueda(e.target.value)}
                onFocus={() => setFocusModalState("numDoc", true)}
                onBlur={() => setFocusModalState("numDoc", false)}
              />

              <label
                htmlFor="docBusqueda"
                style={{
                  ...labelStyle,
                  top:
                    focusModal["numDoc"] || docBusqueda !== ""
                      ? "-20px"
                      : "10px",
                  fontSize:
                    focusModal["numDoc"] || docBusqueda !== ""
                      ? "13px"
                      : "16px",
                }}
              >
                Número de Documento
              </label>
            </FormGroup>

            <Button
              onClick={handleBuscarEstado}
              style={{
                background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                border: "none",
                borderRadius: "20px",
                color: "#fff",
                fontWeight: "600",
                padding: "12px 20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              block
            >
              Buscar
            </Button>
            {loadingEstado && (
              <div className="text-center mt-4">
                <Spinner color="success" />
                <p className="mt-2">Consultando estado...</p>
              </div>
            )}

            {!loadingEstado && resultadoEstado && (
              <div className="mt-4 text-center">
                <h5
                  className="mb-4"
                  style={{
                    color: resultadoEstado.includes("Rechazado")
                      ? "#e63946"
                      : resultadoEstado.includes("Aceptado") ||
                        resultadoEstado.includes("Aprobado")
                      ? "#58ab01"
                      : resultadoEstado.includes("no encontrado")
                      ? "#e63946"
                      : "#ffb703",
                    fontWeight: "700",
                  }}
                >
                  {resultadoEstado}
                </h5>

                {/* 🔹 Línea de tiempo SOLO si hay estadoSolicitud */}
                {estadoSolicitud && (
                  <div
                    style={{
                      position: "relative",
                      marginTop: "40px",
                      padding: "40px 10px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "5%",
                        width: "90%",
                        height: "6px",
                        backgroundColor: "#e9ecef",
                        transform: "translateY(-50%)",
                        borderRadius: "3px",
                      }}
                    ></div>

                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "5%",
                        width: `${estadoSolicitud.progreso * 0.9}%`,
                        height: "6px",
                        backgroundColor: "#58ab01",
                        transform: "translateY(-50%)",
                        borderRadius: "3px",
                        transition: "width 0.8s ease-in-out",
                      }}
                    ></div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        position: "relative",
                        zIndex: 2,
                        width: "90%",
                        margin: "0 auto",
                      }}
                    >
                      {estadoSolicitud.pasos.map((paso) => (
                        <div
                          key={`${paso.id}-${paso.label}`}
                          style={{ textAlign: "center", flex: 1 }}
                        >
                          <div
                            style={{
                              width: "45px",
                              height: "45px",
                              borderRadius: "50%",
                              margin: "auto",
                              backgroundColor: paso.completed
                                ? "#58ab01"
                                : paso.active
                                ? "#B4E197"
                                : "#fff",
                              border: "4px solid #58ab01",
                              color:
                                paso.completed || paso.active
                                  ? "#fff"
                                  : "#58ab01",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "18px",
                              transition: "all 0.4s ease",
                              boxShadow: paso.active
                                ? "0 0 15px rgba(132,198,59,0.5)"
                                : "0 0 5px rgba(0,0,0,0.1)",
                            }}
                          >
                            {paso.completed ? (
                              <i className="fas fa-check"></i>
                            ) : (
                              paso.id
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              marginTop: "10px",
                              color: paso.active ? "#58ab01" : "#8898aa",
                            }}
                          >
                            {paso.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
        </div>
      </Modal>

      {/* 🔸 Formulario */}
      <Row className="justify-content-center">
        <Col md="8">
          <Card
            className="shadow"
            style={{
              backgroundColor: "#ffffffff",
              borderRadius: "2rem",
              boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
              padding: "20px",
              backdropFilter: "blur(6px)",
              transform: "translateY(-10px)",
              border: "none",
              marginTop: "-50px",
            }}
          >
            <CardHeader className="bg-transparent d-flex justify-content-center align-items-center">
              <h2
                className="text-black mb-0"
                style={{ fontWeight: "700", fontSize: "1.6rem" }}
              >
                Registro de Cliente
              </h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={confirmarEnvio}>
                <Row>
                  {[
                    {
                      name: "tipoDocumento",
                      label: "Tipo de Documento",
                      type: "select",
                      options: tiposDocumento,
                    },
                    {
                      name: "documento",
                      label: "Número de Documento",
                      type: "text",
                    },
                    { name: "nombre", label: "Nombre", type: "text" },
                    { name: "telefono", label: "Teléfono", type: "text" },
                    { name: "direccion", label: "Dirección", type: "text" },
                    { name: "correo", label: "Correo", type: "email" },
                    {
                      name: "ciudad",
                      label: "Ciudad",
                      type: "select",
                      options: ciudades,
                    },
                  ].map((field, i) => (
                    <Col md="6" key={i}>
                      <FormGroup style={fieldContainer}>
                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            style={inputStyle}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusState(field.name, true)}
                            onBlur={() => setFocusState(field.name, false)}
                            // required
                          >
                            <option value=""></option>
                            {field.options.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.descripcion}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            style={inputStyle}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusState(field.name, true)}
                            onBlur={() => setFocusState(field.name, false)}
                            // required
                          />
                        )}
                        <label
                          htmlFor={field.name}
                          style={{
                            ...labelStyle,
                            top:
                              focus[field.name] || formData[field.name] !== ""
                                ? "-20px"
                                : "10px",
                            fontSize:
                              focus[field.name] || formData[field.name] !== ""
                                ? "13px"
                                : "16px",
                            color: "gray",
                          }}
                        >
                          {field.label}
                        </label>
                      </FormGroup>
                    </Col>
                  ))}

                  <Col md="12">
                    <FormGroup style={fieldContainer}>
                      <textarea
                        name="observacion"
                        style={{
                          ...inputStyle,
                          border: "1px solid rgba(0,0,0,0.35)",
                          borderRadius: "8px",
                          padding: "10px",
                          minHeight: "80px",
                          transition: "0.3s ease all",
                        }}
                        value={formData.observacion}
                        onChange={handleChange}
                        onFocus={() => setFocusState("observacion", true)}
                        onBlur={() => setFocusState("observacion", false)}
                      />
                      <label
                        htmlFor="observacion"
                        style={{
                          ...labelStyle,
                          top:
                            focus["observacion"] || formData.observacion !== ""
                              ? "-20px"
                              : "10px",
                          fontSize:
                            focus["observacion"] || formData.observacion !== ""
                              ? "13px"
                              : "16px",
                          color: "gray",
                        }}
                      >
                        Observación
                      </label>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-3">
                  <Button
                    type="submit"
                    style={{
                      background:
                        "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                      border: "none",
                      borderRadius: "20px",
                      color: "#fff",
                      fontWeight: "600",
                      padding: "12px 20px",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Enviar Solicitud
                  </Button>

                  <Button
                    onClick={toggleModalEstado}
                      style={{
                      backgroundColor: "hsla(0, 0%, 52%, 1.00)",
                      border: "none",
                      borderRadius: "20px",
                      color: "#000000ff",
                      fontWeight: "600",
                      padding: "12px 20px",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Ver Estado
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      
    </Container>
  );
}

export default FormularioCliente;
