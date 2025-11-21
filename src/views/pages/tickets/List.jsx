import React, { useContext, useEffect, useState } from "react";
import TicketsContext from "../../../context/TicketsContext";
import Header from "components/Headers/Header.js";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FaPlus } from "react-icons/fa";
import ReactBSAlert from "react-bootstrap-sweetalert";

function List({ tab }) {
 const [datosPrueba, setDatosPrueba] = useState([
  {
    id: 101,
    usuario: "Juan Pérez",
    fecha: "2025-02-15",
    tipo: { descripcion: "Producto vencido" },
    prioridad: { descripcion: "Urgente" },
    tickets_estado: { descripcion: "En revisión" },
    tickets_observacion:
      "Se encontraron 12 unidades de yogur vencidas en estantería.",
    asignado: {
      id: 3,
      nombre: "Laura Martínez",
    },
    trazabilidad: [
      {
        fecha: "2025-02-15",
        estado: "En proceso",
        observacion: "Ticket creado automáticamente.",
        usuario: "Sistema",
        asignado: "Laura Martínez",
      },
      {
        fecha: "2025-02-15",
        estado: "En revisión",
        observacion: "Supervisor verifica productos vencidos.",
        usuario: "Sistema",
        asignado: "Laura Martínez",
      },
    ],
  },

  {
    id: 102,
    usuario: "Laura Martínez",
    fecha: "2025-02-16",
    tipo: { descripcion: "Refrigeración defectuosa" },
    prioridad: { descripcion: "Alta" },
    tickets_estado: { descripcion: "En proceso" },
    tickets_observacion:
      "La nevera de carnes frías está mostrando temperaturas inestables.",
    asignado: {
      id: 4,
      nombre: "Carlos Gómez",
    },
    trazabilidad: [
      {
        fecha: "2025-02-16",
        estado: "En proceso",
        observacion: "Reportado problema técnico en la nevera.",
        usuario: "Sistema",
        asignado: "Carlos Gómez",
      },
    ],
  },

  {
    id: 103,
    usuario: "Carlos Gómez",
    fecha: "2025-02-17",
    tipo: { descripcion: "Producto en mal estado" },
    prioridad: { descripcion: "Urgente" },
    tickets_estado: { descripcion: "En proceso" },
    tickets_observacion:
      "Queso costeño con olor desagradable. Posible contaminación.",
    asignado: {
      id: 5,
      nombre: "Sandra Ruiz",
    },
    trazabilidad: [
      {
        fecha: "2025-02-17",
        estado: "Pendiente",
        observacion: "Se detecta lote sospechoso.",
        usuario: "Sistema",
        asignado: "Sandra Ruiz",
      },
    ],
  },

  {
    id: 104,
    usuario: "Sandra Ruiz",
    fecha: "2025-02-17",
    tipo: { descripcion: "Falta de inventario" },
    prioridad: { descripcion: "Media" },
    tickets_estado: { descripcion: "Completado" },
    tickets_observacion:
      "Stock bajo en leche deslactosada 1L. Pedido completado al proveedor.",
    asignado: {
      id: 2,
      nombre: "Juan Pérez",
    },
    trazabilidad: [
      {
        fecha: "2025-02-17",
        estado: "En proceso",
        observacion: "Se confirma baja de inventario.",
        usuario: "Sistema",
        asignado: "Juan Pérez",
      },
      {
        fecha: "2025-02-18",
        estado: "Completado",
        observacion: "Proveedor entrega lote solicitado.",
        usuario: "Sistema",
        asignado: "Juan Pérez",
      },
    ],
  },

  {
    id: 105,
    usuario: "Andrés Torres",
    fecha: "2025-02-18",
    tipo: { descripcion: "Error en el precio" },
    prioridad: { descripcion: "Baja" },
    tickets_estado: { descripcion: "En proceso" },
    tickets_observacion:
      "El precio del jamón de pavo no coincide con la promoción en caja.",
    asignado: {
      id: 5,
      nombre: "Sandra Ruiz",
    },
    trazabilidad: [
      {
        fecha: "2025-02-18",
        estado: "En proceso",
        observacion: "Caja informa diferencia de precio.",
        usuario: "Sistema",
        asignado: "Sandra Ruiz",
      },
    ],
  },
]);

  const usuariosEstaticos = [
    { id: 1, nombre: "Deison Cardenas" },
    { id: 2, nombre: "Juan Pérez" },
    { id: 3, nombre: "Laura Martínez" },
    { id: 4, nombre: "Carlos Gómez" },
    { id: 5, nombre: "Sandra Ruiz" },
  ];

  const tiposEstaticos = [
    { id: 1, descripcion: "Producto vencido" },
    { id: 2, descripcion: "Producto en mal estado" },
    { id: 3, descripcion: "Falta de inventario" },
    { id: 4, descripcion: "Error en el precio" },
    { id: 5, descripcion: "Refrigeración defectuosa" },
  ];

  const prioridadesEstaticas = [
    { id: 1, descripcion: "Urgente" },
    { id: 2, descripcion: "Alta" },
    { id: 3, descripcion: "Media" },
    { id: 4, descripcion: "Baja" },
  ];
  const [trazabilidadModalOpen, setTrazabilidadModalOpen] = useState(false);
  const toggleTrazabilidadModal = () =>
    setTrazabilidadModalOpen(!trazabilidadModalOpen);

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  const {
    db: data,
    deleteData,
    estadoTickets,
    tipoTickets,
    prioridadTickets,
  } = useContext(TicketsContext);

  const [filter, setFilter] = useState("");
  const [state, setState] = useState({});
  const [idDelete, setIdDelete] = useState();

  // Estado para el modal de creación
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // Estado para el modal de detalle
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  // Determina si el ticket ya está finalizado
  const procesoFinalizado =
    selectedTicket?.tickets_estado?.descripcion === "Completado" ||
    selectedTicket?.tickets_estado?.descripcion === "Cancelado";

  const toggleDetailModal = () => setDetailModalOpen(!detailModalOpen);

  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    fecha: "",
    tipo: "",
    prioridad: "",
    estado: "",
    observacion: "",
    asignado: "",
  });

  // Manejar cambios de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar nuevo ticket (simulado)
  const handleSave = () => {
    if (!formData.tipo || !formData.prioridad || !formData.observacion) {
      alert("Completa todos los campos antes de guardar");
      return;
    }

    // Obtener el objeto según el ID del select
    const tipoObj = tiposEstaticos.find(
      (t) => t.id === parseInt(formData.tipo)
    );
    const prioridadObj = prioridadesEstaticas.find(
      (p) => p.id === parseInt(formData.prioridad)
    );

    // Fecha automática
    const hoy = new Date().toISOString().split("T")[0];

    const nuevoTicket = {
      id:
        datosPrueba.length > 0 ? datosPrueba[datosPrueba.length - 1].id + 1 : 1,
      fecha: hoy,
      asignado: usuariosEstaticos.find(
        (u) => u.id === parseInt(formData.asignado)
      ),
      creado_por: "Deison Cardenas",

      tipo: { descripcion: tipoObj.descripcion },
      prioridad: { descripcion: prioridadObj.descripcion },
      tickets_estado: { descripcion: "En Proceso" }, // ← automático
      tickets_observacion: formData.observacion,
      trazabilidad: [
        {
          fecha: hoy,
          estado: "En proceso",
          observacion: formData.observacion,
          usuario: "Deison Cardenas",
          asignado: usuariosEstaticos.find(
            (u) => u.id === parseInt(formData.asignado)
          )?.nombre,
        },
      ],
    };

    // Agregar al array
    setDatosPrueba((prev) => [...prev, nuevoTicket]);

    // Cerrar modal
    setModalOpen(false);

    // Limpiar formulario
    setFormData({
      fecha: "",
      tipo: "",
      prioridad: "",
      observacion: "",
    });
  };

  // Filtro de búsqueda
  const filteredData = datosPrueba.filter((item) => {
    const matchID = filter === "" || item.id.toString().includes(filter);

    const matchTipo =
      tipoFiltro === "" ||
      item.tipo.descripcion.toLowerCase() === tipoFiltro.toLowerCase();

    const matchEstado =
  estadoFiltro === "" ||
  item.tickets_estado.descripcion.toLowerCase() === estadoFiltro.toLowerCase();


    const matchPrioridad =
      prioridadFiltro === "" ||
      item.prioridad.descripcion.toLowerCase() ===
        prioridadFiltro.toLowerCase();

    return matchID && matchTipo && matchPrioridad && matchEstado;
  });

  // Columnas de la tabla
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "100px" },
    { name: "Fecha", selector: (row) => row.fecha, sortable: true },
    { name: "Tipo", selector: (row) => row.tipo.descripcion, sortable: true },
    {
      name: "Prioridad",
      selector: (row) => row.prioridad.descripcion,
      sortable: true,
    },
    {
      name: "Asignado a",
      selector: (row) => row.asignado?.nombre || "",
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.tickets_estado.descripcion,
      sortable: true,
    },
    {
      name: "Observacion",
      selector: (row) => row.tickets_observacion,
      sortable: true,
    },
    {
      name: "Acciones",
      width: "100px",
      cell: (row) => (
        <>
          <Button
            className="btn btn-primary btn-sm me-2"
            style={{
              background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "400",
              padding: "5pxx",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              setSelectedTicket(row);
              setDetailModalOpen(true);
            }}
          >
            Detallar
          </Button>

          {/* <Button
            className="btn btn-danger btn-sm"
            style={{
              backgroundColor: "red",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "400",
              padding: "5px 10px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
            onClick={(e) => handleDelete(e, row.id)}
          >
            Deshabilitar
          </Button> */}
        </>
      ),
    },
  ];

  // Confirmación de eliminación
  const confirmAlert = (id) => {
    setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block" }}
          title="¿Estás seguro?"
          onCancel={() => hideAlert()}
          onConfirm={() => {
            setIdDelete(id);
            hideAlert();
          }}
          showCancel
          confirmBtnBsStyle="primary"
          confirmBtnText="Sí, eliminarlo!"
          cancelBtnBsStyle="danger"
          cancelBtnText="Cancelar"
          btnSize=""
        >
          No podrás revertir esto!
        </ReactBSAlert>
      ),
    });
  };

  useEffect(() => {
    if (modalOpen) {
      const hoy = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, fecha: hoy }));
    }
  }, [modalOpen]);

  const hideAlert = () => {
    setState({ alert: null });
  };

  useEffect(() => {
    if (idDelete) {
      deleteData(idDelete);
    }
  }, [idDelete]);

  const handleDelete = (e, id) => {
    e.preventDefault();
    confirmAlert(id);
  };

  return (
    <>
      <style>
        {`
       @keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
      `}
      </style>
      {state.alert}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">Tickets</h3>
                    <p className="text-sm mb-0">
                      Listado de tickets registrados en el sistema
                    </p>
                  </div>
                  <div>
                    <Button
                      onClick={toggleModal}
                     className="btn"
                    >
                      <FaPlus style={{ marginRight: "8px" }} />
                      Agregar Tickets
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Row className="mb-3">
                  <Col md="6">
                    <FormGroup>
                      <Label for="buscar">Buscar por numero de Ticket</Label>
                      <Input
                        id="buscar"
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
  <Label>Filtrar por Estado</Label>
  <Input
    type="select"
    value={estadoFiltro}
    onChange={(e) => setEstadoFiltro(e.target.value)}
  >
    <option value="">Todos</option>
    <option value="En proceso">En proceso</option>
    <option value="En revisión">En revisión</option>
    {/* <option value="Pendiente">Pendiente</option> */}
    <option value="Completado">Completado</option>
    {/* <option value="Activo">Activo</option> */}
    <option value="Cancelado">Cancelado</option>
  </Input>
</FormGroup>

                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Filtrar por Prioridad</Label>
                      <Input
                        type="select"
                        value={prioridadFiltro}
                        onChange={(e) => setPrioridadFiltro(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {prioridadesEstaticas.map((e) => (
                          <option key={e.id} value={e.descripcion}>
                            {e.descripcion}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                />
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal Agregar Tickets */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Agregar Tickets</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label for="fecha">Fecha</Label>
                <Input
                  type="date"
                  name="fecha"
                  id="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  readOnly
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label for="tipo">Tipo de novedad</Label>
                <Input
                  type="select"
                  name="tipo"
                  id="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposEstaticos.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.descripcion}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="prioridad">Prioridad</Label>
                <Input
                  type="select"
                  name="prioridad"
                  id="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar prioridad</option>
                  {prioridadesEstaticas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.descripcion}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label for="asignado">Asignar a</Label>
                <Input
                  type="select"
                  name="asignado"
                  id="asignado"
                  value={formData.asignado}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar usuario</option>
                  {usuariosEstaticos.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            <Col md="12">
              <FormGroup>
                <Label for="observacion">Observación</Label>
                <Input
                  type="textarea"
                  name="observacion"
                  id="observacion"
                  value={formData.observacion}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={toggleModal}
            style={{
              backgroundColor: "red",
              border: "none",
              borderRadius: "20px",
              color: "#fff",
              fontWeight: "600",
              padding: "12px 20px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            style={{
              background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
              border: "none",
              borderRadius: "20px",
              color: "#fff",
              fontWeight: "600",
              padding: "12px 20px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            Guardar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Detalle Ticket */}
      <Modal isOpen={detailModalOpen} toggle={toggleDetailModal} size="lg">
        <ModalHeader toggle={toggleDetailModal}>
          Detalles del Ticket
        </ModalHeader>
        <ModalBody>
          {selectedTicket ? (
            <div className="p-3">
              <Row className="mb-2">
                <Col md="6">
                  <strong>ID:</strong> {selectedTicket.id}
                </Col>
                <Col md="6">
                  <strong>Fecha:</strong> {selectedTicket.fecha}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md="6">
                  <strong>Tipo:</strong> {selectedTicket.tipo?.descripcion}
                </Col>
                <Col md="6">
                  <strong>Prioridad:</strong>{" "}
                  {selectedTicket.prioridad?.descripcion}
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <strong>Estado:</strong>{" "}
                  {selectedTicket.tickets_estado?.descripcion}
                </Col>
                <Col md="6">
                  <strong>Asignado a:</strong>{" "}
                  {selectedTicket.asignado?.nombre || ""}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md="12">
                  <strong>Observaciones:</strong>
                  <div className="mt-2">
                    {selectedTicket.tickets_observacion || "Sin observaciones"}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <p>Cargando información...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            style={{
              background: "linear-gradient(90deg, #86C63B 0%, #58AB01 100%)",
              borderRadius: "20px",
            }}
            onClick={() => {
              // Aquí se conserva el seleccionado antes de abrir el modal
              setSelectedTicket((prev) => ({
                ...prev,
                nuevoAsignado: prev.asignado?.id || "", // ← aquí prellenamos
              }));
              setDetailModalOpen(false);
              setTrazabilidadModalOpen(true);
            }}
          >
            Ver trazabilidad
          </Button>
          <Button
            color="secondary"
            onClick={toggleDetailModal}
            style={{
              backgroundColor: "red",
              border: "none",
              borderRadius: "20px",
              color: "#fff",
              fontWeight: "600",
              padding: "12px 20px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* MODAL VER TRAZABILIDAD */}
      <Modal
        isOpen={trazabilidadModalOpen}
        toggle={toggleTrazabilidadModal}
        size="lg"
      >
        <ModalHeader toggle={toggleTrazabilidadModal}>
          Trazabilidad del Ticket #{selectedTicket?.id}
        </ModalHeader>

        <ModalBody>
          {selectedTicket && (
            <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
              {/* INFO PRINCIPAL */}
              <h5>
                <b>Información del Ticket</b>
              </h5>
              <Row className="mb-3">
                <Col md="6">
                  <strong>Registrado por:</strong>{" "}
                  {selectedTicket.creado_por ||
                    selectedTicket.usuario ||
                    "No registrado"}
                </Col>
                <Col md="6">
                  <strong>Fecha:</strong> {selectedTicket.fecha}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="6">
                  <strong>Tipo:</strong> {selectedTicket.tipo.descripcion}
                </Col>
                <Col md="6">
                  <strong>Prioridad:</strong>{" "}
                  {selectedTicket.prioridad.descripcion}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="6">
                  <strong>Estado actual:</strong>
                  {selectedTicket.tickets_estado.descripcion}
                </Col>
                 <Col md="6">
                  <strong>Asignado a:</strong>
                  {selectedTicket.asignado?.nombre || ""}
                </Col>
              </Row>
              <hr />
              {/* LINEA DE TIEMPO */}
              <h5>
                <b>Línea de Tiempo</b>
              </h5>
              <div
                style={{
                  borderLeft: "3px solid #58AB01",
                  marginLeft: "20px",
                  paddingLeft: "20px",
                }}
              >
                {selectedTicket.trazabilidad?.map((t, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "20px",
                      position: "relative",
                      animation: "fadeInUp 0.4s ease",
                    }}
                  >
                    {/* PUNTO */}
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#58AB01",
                        borderRadius: "50%",
                        position: "absolute",
                        left: "-28px",
                        top: "5px",
                      }}
                    ></div>

                    <p style={{ margin: 0, fontWeight: "bold" }}>{t.fecha}</p>
                    <p style={{ margin: 0, color: "#58AB01" }}>{t.estado}</p>
                    <p
                      style={{ margin: 0, fontStyle: "italic", color: "#666" }}
                    >
                      {t.observacion}
                      <br />
                      <span style={{ color: "#999" }}>
                        — Creado por: {t.usuario || "Sistema"}
                        {t.asignado && (
                          <>
                            {" · "}Asignado a: <b>{t.asignado}</b>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                ))}

                {/* MENSAJE DE PROCESO FINALIZADO */}
                {procesoFinalizado && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 15px",
                      backgroundColor: "#FFF3CD",
                      borderLeft: "5px solid #D9534F",
                      borderRadius: "6px",
                      color: "#856404",
                      fontWeight: "bold",
                    }}
                  >
                    ⚠️ Este proceso ya fue finalizado.
                  </div>
                )}
              </div>
              <hr />
              {/* CAMBIO DE ESTADO */}
              {/* Mostrar mensaje si está finalizado */}
              {procesoFinalizado && (
                <div
                  style={{
                    background: "#F4F7F0",
                    borderLeft: "5px solid #58AB01",
                    padding: "15px 20px",
                    borderRadius: "10px",
                    marginTop: "15px",
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                >
                  <h5
                    style={{ margin: 0, fontWeight: "bold", color: "#58AB01" }}
                  >
                    ⚠ Este ticket está finalizado
                  </h5>
                  <p style={{ margin: 0, marginTop: "5px", color: "#555" }}>
                    El proceso ha sido marcado como{" "}
                    <b>{selectedTicket.tickets_estado.descripcion}</b> y no
                    admite más cambios.
                  </p>
                </div>
              )}
              {/* Si NO está finalizado, mostrar inputs */}
              {!procesoFinalizado && (
                <>
                  <h5>
                    <b>Actualizar estado del ticket</b>
                  </h5>
                  <FormGroup>
                    <Label>Cambiar encargado</Label>
                    <Input
                      type="select"
                      value={
                        selectedTicket.nuevoAsignado ??
                        selectedTicket.asignado?.id ??
                        ""
                      }
                      onChange={(e) =>
                        setSelectedTicket((prev) => ({
                          ...prev,
                          nuevoAsignado: e.target.value,
                        }))
                      }
                    >
                      <option value="">Seleccionar usuario</option>
                      {usuariosEstaticos.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>

                  <FormGroup>
                    <Label>Nuevo Estado</Label>
                    <Input
                      type="select"
                      value={selectedTicket.nuevoEstado || ""}
                      onChange={(e) =>
                        setSelectedTicket((prev) => ({
                          ...prev,
                          nuevoEstado: e.target.value,
                        }))
                      }
                    >
                      <option value="">Seleccionar</option>
                      <option value="En proceso">En proceso</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </Input>
                  </FormGroup>

                  <FormGroup>
                    <Label>Observación (obligatoria)</Label>
                    <Input
                      type="textarea"
                      rows="3"
                      value={selectedTicket.nuevaObservacion || ""}
                      onChange={(e) =>
                        setSelectedTicket((prev) => ({
                          ...prev,
                          nuevaObservacion: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>
                </>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {!procesoFinalizado && (
            <Button
              color="success"
              style={{
                background: "linear-gradient(90deg, #86C63B 0%, #58AB01 100%)",
                borderRadius: "20px",
              }}
              onClick={() => {
                if (
                  !selectedTicket.nuevoEstado ||
                  !selectedTicket.nuevaObservacion
                ) {
                  alert(
                    "Debes seleccionar un estado y escribir una observación"
                  );
                  return;
                }

                const hoy = new Date().toISOString().split("T")[0];

                const nuevaEntrada = {
                  fecha: hoy,
                  estado: selectedTicket.nuevoEstado,
                  observacion: selectedTicket.nuevaObservacion,
                  usuario: "Deison Cardenas",
                  finalizado:
                    selectedTicket.nuevoEstado === "Completado" ||
                    selectedTicket.nuevoEstado === "Cancelado",
                  asignado: selectedTicket.nuevoAsignado
                    ? usuariosEstaticos.find(
                        (u) => u.id === parseInt(selectedTicket.nuevoAsignado)
                      ).nombre
                    : selectedTicket.asignado?.nombre,
                };

                setDatosPrueba((prev) =>
                  prev.map((ticket) =>
                    ticket.id === selectedTicket.id
                      ? {
                          ...ticket,
                          tickets_estado: {
                            descripcion: selectedTicket.nuevoEstado,
                          },
                          asignado: selectedTicket.nuevoAsignado
                            ? usuariosEstaticos.find(
                                (u) =>
                                  u.id ===
                                  parseInt(selectedTicket.nuevoAsignado)
                              )
                            : ticket.asignado,
                          trazabilidad: [...ticket.trazabilidad, nuevaEntrada],
                        }
                      : ticket
                  )
                );

                setSelectedTicket((prev) => ({
                  ...prev,
                  tickets_estado: { descripcion: selectedTicket.nuevoEstado },
                  trazabilidad: [...prev.trazabilidad, nuevaEntrada],
                  nuevoEstado: "",
                  nuevaObservacion: "",
                }));
              }}
            >
              Guardar
            </Button>
          )}

          <Button
            color="secondary"
            onClick={toggleTrazabilidadModal}
            style={{
              background: "linear-gradient(90deg, #ff4d4d 0%, #cc0000 100%)",
              borderRadius: "20px",
              color: "#ebebeb",
              fontWeight: "600",
            }}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default List;
