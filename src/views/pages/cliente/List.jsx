// src/views/cliente/List.jsx
import React, { useContext, useEffect, useState } from "react";
import ClienteContext from "../../../context/ClienteContext";
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
  Spinner,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FaPlus } from "react-icons/fa";
import ReactBSAlert from "react-bootstrap-sweetalert";
import NotificationContext from "context/NotificationContext";

const API_URL = process.env.REACT_APP_API_URL;

function List({ tab }) {
  const {
    db: data,
    deleteData,
    saveData,
    ciudades,
    estadoClientes,
    tipoDocumentos,
  } = useContext(ClienteContext);

  const { addNotification } = useContext(NotificationContext);

  const [filter, setFilter] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // 👈 filtro por estado

  const [state, setState] = useState({}); // para las alerts
  const [idDelete, setIdDelete] = useState();

  // modal agregar
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // modal detalle
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null); // 👈 datos de cliente informacion
  const [editMode, setEditMode] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // catálogos extra para cliente informacion
  const [zonasDB, setZonasDB] = useState([]);
  const [tiposClienteDB, setTiposClienteDB] = useState([]);
  const [vendedoresDB, setVendedoresDB] = useState([]);
  const [listasPreciosDB, setListasPreciosDB] = useState([]);

  // modal deshabilitar
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [disableObs, setDisableObs] = useState("");
  const [disableClientId, setDisableClientId] = useState(null);

  // formulario agregar
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    documento: "",
    nombre: "",
    telefono: "",
    direccion: "",
    correo: "",
    ciudad: "",
    estado: "",
    observacion: "",
  });

  // formulario edición dentro del modal de detalle
  const [editForm, setEditForm] = useState({
    tipodocumento: "",
    documento: "",
    nombre: "",
    telefono: "",
    direccion: "",
    correo: "",
    ciudad: "",
    observacion: "",
    clienteEstado: "",
  });

  const [editInfoForm, setEditInfoForm] = useState({
    zona: "",
    tipocliente: "",
    vendedor: "",
    listaprecio: "",
  });

  const hideAlert = () => setState({ alert: null });

  // cargar catálogos para cliente informacion
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [zRes, tcRes, vRes, lpRes] = await Promise.all([
          fetch(`${API_URL}zona`),
          fetch(`${API_URL}tipocliente`),
          fetch(`${API_URL}vendedor`),
          fetch(`${API_URL}listaprecio`),
        ]);
        const [z, tc, v, lp] = await Promise.all([
          zRes.json(),
          tcRes.json(),
          vRes.json(),
          lpRes.json(),
        ]);
        setZonasDB(z.data || []);
        setTiposClienteDB(tc.data || []);
        setVendedoresDB(v.data || []);
        setListasPreciosDB(lp.data || []);
      } catch (err) {
        console.error("Error cargando catálogos extra:", err);
      }
    };
    fetchCatalogos();
  }, []);

  // manejo inputs modal agregar
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // GUARDAR CLIENTE (modal agregar)
  const handleSave = async () => {
    try {
      const nuevoCliente = {
        tipodocumento: { id: parseInt(formData.tipodocumento) },
        documento: formData.documento,
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion,
        correo: formData.correo,
        ciudad: { id: parseInt(formData.ciudad) },
        observacion: formData.observacion,
        clienteEstado: {
          id: formData.estado ? parseInt(formData.estado) : 1, // En proceso por defecto
        },
      };

      await saveData(nuevoCliente);

      addNotification({
        id: Date.now(),
        mensaje: `Nuevo registro: ${nuevoCliente.nombre}`,
        estado: "En proceso",
      });

      setState({
        alert: (
          <ReactBSAlert
            success
            style={{ display: "block" }}
            title="✅ Cliente registrado correctamente"
            onConfirm={() => {
              hideAlert();
              setModalOpen(false);
            }}
            confirmBtnBsStyle="success"
            confirmBtnText="Aceptar"
          >
            El cliente <strong>{nuevoCliente.nombre}</strong> fue agregado
            exitosamente.
          </ReactBSAlert>
        ),
      });

      setFormData({
        tipoDocumento: "",
        documento: "",
        nombre: "",
        telefono: "",
        direccion: "",
        correo: "",
        ciudad: "",
        estado: "",
        observacion: "",
      });
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error);
    }
  };

  // abrir modal detalle
  const handleOpenDetail = async (cliente) => {
    setSelectedClient(cliente);
    setDetailModalOpen(true);
    setEditMode(false);
    setClienteInfo(null);
    setLoadingDetail(true);

    // llenar formulario de edición con datos del cliente
    setEditForm({
      tipodocumento: cliente.tipodocumento?.id || "",
      documento: cliente.documento || "",
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      correo: cliente.correo || "",
      ciudad: cliente.ciudad?.id || "",
      observacion: cliente.observacion || "",
      clienteEstado: cliente.clienteEstado?.id || "",
    });

    try {
      // traemos TODA la info y buscamos la del cliente
      const resInfo = await fetch(`${API_URL}clienteinformacion`);
      const dataInfo = await resInfo.json();
      const infoCliente =
        (dataInfo.data || []).find((ci) => ci.cliente?.id === cliente.id) ||
        null;
      setClienteInfo(infoCliente);

      setEditInfoForm({
        zona: infoCliente?.zona?.id || "",
        tipocliente: infoCliente?.tipocliente?.id || "",
        vendedor: infoCliente?.vendedor?.id || "",
        listaprecio: infoCliente?.listaprecio?.id || "",
      });
    } catch (err) {
      console.error("Error cargando clienteinformacion:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // guardar edición (cliente + cliente informacion)
  const handleSaveEdit = () => {
    setState({
      alert: (
        <ReactBSAlert
          info
          showCancel
          title="¿Guardar cambios?"
          confirmBtnText="Sí, guardar"
          cancelBtnText="Cancelar"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="secondary"
          onConfirm={async () => {
            try {
              // 1) actualizar cliente
              const resCliente = await fetch(
                `${API_URL}cliente/${selectedClient.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: selectedClient.id,
                    nombre: editForm.nombre,
                    documento: editForm.documento,
                    correo: editForm.correo,
                    telefono: editForm.telefono,
                    direccion: editForm.direccion,
                    tipodocumento: { id: Number(editForm.tipodocumento) },
                    ciudad: { id: Number(editForm.ciudad) },
                    observacion: editForm.observacion || "",
                    clienteEstado: {
                      id: editForm.clienteEstado
                        ? Number(editForm.clienteEstado)
                        : 1,
                    },
                  }),
                }
              );

              if (!resCliente.ok) {
                const t = await resCliente.text();
                console.error("Error actualizando cliente:", t);
                throw new Error("Error actualizando cliente");
              }

              // 2) guardar/actualizar cliente informacion
              const infoBody = {
                cliente: { id: selectedClient.id },
                zona: editInfoForm.zona
                  ? { id: Number(editInfoForm.zona) }
                  : null,
                tipocliente: editInfoForm.tipocliente
                  ? { id: Number(editInfoForm.tipocliente) }
                  : null,
                vendedor: editInfoForm.vendedor
                  ? { id: Number(editInfoForm.vendedor) }
                  : null,
                listaprecio: editInfoForm.listaprecio
                  ? { id: Number(editInfoForm.listaprecio) }
                  : null,
              };

              if (
                infoBody.zona &&
                infoBody.tipocliente &&
                infoBody.vendedor &&
                infoBody.listaprecio
              ) {
                if (clienteInfo && clienteInfo.id) {
                  // PUT
                  await fetch(
                    `${API_URL}clienteinformacion/${clienteInfo.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(infoBody),
                    }
                  );
                } else {
                  // POST
                  await fetch(`${API_URL}clienteinformacion`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(infoBody),
                  });
                }
              }

              // 3) recargar lista
              // lo más fácil: cerrar y que el padre recargue; aquí no tenemos un fetch, así que
              // vamos a actualizar el cliente en el estado local también:
              setSelectedClient((prev) => ({
                ...prev,
                ...{
                  nombre: editForm.nombre,
                  documento: editForm.documento,
                  correo: editForm.correo,
                  telefono: editForm.telefono,
                  direccion: editForm.direccion,
                  observacion: editForm.observacion,
                  tipodocumento: tipoDocumentos.find(
                    (t) => t.id === Number(editForm.tipodocumento)
                  ),
                  ciudad: ciudades.find(
                    (c) => c.id === Number(editForm.ciudad)
                  ),
                  clienteEstado: estadoClientes.find(
                    (e) => e.id === Number(editForm.clienteEstado)
                  ),
                },
              }));

              setEditMode(false);

              setState({
                alert: (
                  <ReactBSAlert
                    success
                    title="Datos actualizados"
                    onConfirm={() => setState({ alert: null })}
                  >
                    La información del cliente se actualizó correctamente.
                  </ReactBSAlert>
                ),
              });
            } catch (err) {
              console.error(err);
              setState({
                alert: (
                  <ReactBSAlert
                    danger
                    title="Error"
                    onConfirm={() => setState({ alert: null })}
                  >
                    No se pudo actualizar el cliente.
                  </ReactBSAlert>
                ),
              });
            }
          }}
          onCancel={() => setState({ alert: null })}
        >
          Se guardarán los cambios realizados al cliente.
        </ReactBSAlert>
      ),
    });
  };

  // abrir modal de confirmación (habilitar o deshabilitar)
  const handleDisableClick = (cliente) => {
    const esInactivo =
      cliente.clienteEstado?.id === 5 ||
      cliente.clienteEstado?.descripcion?.toLowerCase() === "inactivo";

    setState({
      alert: (
        <ReactBSAlert
          warning
          showCancel
          confirmBtnText={esInactivo ? "Sí, habilitar" : "Sí, deshabilitar"}
          cancelBtnText="Cancelar"
          confirmBtnBsStyle={esInactivo ? "success" : "danger"}
          cancelBtnBsStyle="secondary"
          title={
            esInactivo
              ? "¿Deseas volver a habilitar este cliente?"
              : "¿Deseas deshabilitar este cliente?"
          }
          onConfirm={async () => {
            try {
              const nuevoEstadoId = esInactivo ? 3 : 5; // 5 = Activo, 6 = Inactivo

              const response = await fetch(`${API_URL}cliente/${cliente.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...cliente,
                  tipodocumento: { id: cliente.tipodocumento.id },
                  ciudad: { id: cliente.ciudad.id },
                  clienteestado: { id: nuevoEstadoId },
                }),
              });

              if (!response.ok) throw new Error("Error actualizando estado");
              //se actualiza cada 0.8s
              setTimeout(() => window.location.reload(), 800);
              setState({
                alert: (
                  <ReactBSAlert
                    success
                    title={
                      esInactivo
                        ? "Cliente habilitado correctamente"
                        : "Cliente deshabilitado correctamente"
                    }
                    onConfirm={() => setState({ alert: null })}
                  >
                    El cliente <strong>{cliente.nombre}</strong> ha sido{" "}
                    {esInactivo ? "habilitado" : "deshabilitado"} exitosamente.
                  </ReactBSAlert>
                ),
              });
            } catch (error) {
              console.error("❌ Error al cambiar estado:", error);
              setState({
                alert: (
                  <ReactBSAlert
                    danger
                    title="Error al actualizar el estado"
                    onConfirm={() => setState({ alert: null })}
                  >
                    No se pudo cambiar el estado del cliente. Intenta
                    nuevamente.
                  </ReactBSAlert>
                ),
              });
            }
          }}
          onCancel={() => setState({ alert: null })}
        >
          {esInactivo
            ? "El cliente volverá a estar activo en el sistema."
            : "El cliente pasará al estado Inactivo y no podrá realizar operaciones."}
        </ReactBSAlert>
      ),
    });
  };

  const handleConfirmDisable = async () => {
    if (!disableObs.trim()) {
      setState({
        alert: (
          <ReactBSAlert
            warning
            title="Observación requerida"
            onConfirm={() => setState({ alert: null })}
          >
            Debes escribir el motivo de deshabilitación.
          </ReactBSAlert>
        ),
      });
      return;
    }

    // aquí podrías hacer un PUT al cliente para cambiar su estado y guardar la obs
    // por ahora usamos el deleteData que ya tenías
    deleteData(disableClientId);
    setDisableModalOpen(false);
    setState({
      alert: (
        <ReactBSAlert
          success
          title="Cliente deshabilitado"
          onConfirm={() => setState({ alert: null })}
        >
          El cliente fue deshabilitado con la observación indicada.
        </ReactBSAlert>
      ),
    });
  };

  // filtrado: solo por documento, correo o nombre
  const filteredData = data
    .filter((item) => {
      const term = filter.toLowerCase();
      return (
        item.documento?.toLowerCase().includes(term) ||
        item.correo?.toLowerCase().includes(term) ||
        item.nombre?.toLowerCase().includes(term)
      );
    })
    .filter((item) => {
      if (!estadoFiltro) return true;
      // estado viene como objeto
      return (
        item.clienteestado?.descripcion?.toLowerCase() ===
        estadoFiltro.toLowerCase()
      );
    });

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "100px" },
    {
      name: "Documento",
      selector: (row) => row.documento,
      sortable: true,
    },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Teléfono", selector: (row) => row.telefono, sortable: true },
    { name: "Correo", selector: (row) => row.correo, sortable: true },
    {
      name: "Ciudad",
      selector: (row) => row.ciudad?.descripcion,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.clienteEstado?.descripcion,
      sortable: true,
    },
    {
      name: "Acciones",
      width: "220px",
      cell: (row) => (
        <>
          <Button
            className="btn btn-primary btn-sm"
            style={{
              background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
              color: "#EBEBEB",
              border: "none",
              borderRadius: "10px",
            }}
            onClick={() => handleOpenDetail(row)}
          >
            Detallar
          </Button>

          <Button
            className="btn btn-sm"
            style={{
              marginLeft: "5px",
              background:
                row.clienteEstado?.id === 5
                  ? "#58AB01"
                  : "linear-gradient(90deg, #ff4d4d 0%, #cc0000 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#EBEBEB",
              fontWeight: "600",
            }}
            onClick={() => handleDisableClick(row)}
          >
            {row.clienteestado?.id === 6 ? "Habilitar" : "Deshabilitar"}
          </Button>
        </>
      ),
    },
  ];
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
    <>
      {state.alert}
      {/* <style>
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
        .modal-content{ background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  .modal-header {
    border-bottom: none !important;
  }

  .modal-body {
    padding-top: 0 !important;
  } */}
    
  {/* .modal-header .close {
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

        `}
      </style>*/}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">Clientes</h3>
                    <p className="text-sm mb-0">
                      Listado de clientes registrados en el sistema
                    </p>
                  </div>
                  <div>
                    <Button
                      onClick={toggleModal}
                      style={{
                        background:
                          "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                        border: "none",
                        borderRadius: "20px",
                        color: "#fff",
                        fontWeight: "600",
                        padding: "12px 20px",
                      }}
                    >
                      <FaPlus style={{ marginRight: "8px" }} />
                     Agregar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <Row className="mb-3">
                  <Col md="6">
                    <FormGroup>
                      <Label for="buscar">Buscar (doc, correo o nombre)</Label>
                      <Input
                        id="buscar"
                        type="text"
                        placeholder="Buscar..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Filtrar por estado</Label>
                      <Input
                        type="select"
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="Aceptado">Aceptado</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
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

      {/* Modal de agregar cliente */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
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
          <ModalHeader toggle={toggleModal}>Cliente</ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="tipoDocumento">Tipo de Documento</Label>
                  <Input
                    type="select"
                    name="tipoDocumento"
                    id="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {tipoDocumentos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.descripcion}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="documento">Número de Documento</Label>
                  <Input
                    type="text"
                    name="documento"
                    id="documento"
                    value={formData.documento}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="nombre">Nombre</Label>
                  <Input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="telefono">Teléfono</Label>
                  <Input
                    type="text"
                    name="telefono"
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="direccion">Dirección</Label>
                  <Input
                    type="text"
                    name="direccion"
                    id="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="correo">Correo</Label>
                  <Input
                    type="email"
                    name="correo"
                    id="correo"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="ciudad">Ciudad</Label>
                  <Input
                    type="select"
                    name="ciudad"
                    id="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar ciudad</option>
                    {ciudades.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.descripcion}
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
              }}
            >
              Guardar
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* 🔍 Modal Detalle Cliente */}
      <Modal
        isOpen={detailModalOpen}
        toggle={() => setDetailModalOpen(false)}
        size="lg"
        
      >
        <ModalHeader toggle={() => setDetailModalOpen(false)}>
          Detalles del Cliente
        </ModalHeader>
        <ModalBody>
          {loadingDetail ? (
            <div className="text-center p-4">
              <Spinner color="success" />
            </div>
          ) : selectedClient ? (
            <>
              {!editMode ? (
                <>
                  <Row>
                    <Col md="6">
                      <strong>ID:</strong> {selectedClient.id}
                    </Col>
                    <Col md="6">
                      <strong>Nombre:</strong> {selectedClient.nombre}
                    </Col>
                    <Col md="6">
                      <strong>Documento:</strong> {selectedClient.documento}
                    </Col>
                    <Col md="6">
                      <strong>Tipo Documento:</strong>{" "}
                      {selectedClient.tipoDocumento?.descripcion}
                    </Col>
                    <Col md="6">
                      <strong>Teléfono:</strong> {selectedClient.telefono}
                    </Col>
                    <Col md="6">
                      <strong>Correo:</strong> {selectedClient.correo}
                    </Col>
                    <Col md="6">
                      <strong>Dirección:</strong> {selectedClient.direccion}
                    </Col>
                    <Col md="6">
                      <strong>Ciudad:</strong>{" "}
                      {selectedClient.ciudad?.descripcion}
                    </Col>
                    <Col md="6">
                      <strong>Estado:</strong>{" "}
                      {selectedClient.clienteEstado?.descripcion}
                    </Col>
                    <Col md="12" className="mt-3">
                      <strong>Observaciones:</strong> <br />
                      {selectedClient.observacion || "Sin observaciones"}
                    </Col>
                  </Row>

                  <hr />
                  <h5 className="mt-3">
                    Información de cliente (clienteinformacion)
                  </h5>
                  <Row>
                    <Col md="6">
                      <strong>Zona:</strong>{" "}
                      {clienteInfo?.zona?.descripcion || "N/A"}
                    </Col>
                    <Col md="6">
                      <strong>Tipo de cliente:</strong>{" "}
                      {clienteInfo?.tipocliente?.descripcion || "N/A"}
                    </Col>
                    <Col md="6">
                      <strong>Vendedor:</strong>{" "}
                      {clienteInfo?.vendedor?.nombre || "N/A"}
                    </Col>
                    <Col md="6">
                      <strong>Lista de precio:</strong>{" "}
                      {clienteInfo?.listaprecio?.descripcion || "N/A"}
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  {/* modo edición */}
                  <Row>
                    <Col md="6">
                      <Label>Tipo de documento</Label>
                      <Input
                        type="select"
                        value={editForm.tipodocumento}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            tipodocumento: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        {tipoDocumentos.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Documento</Label>
                      <Input
                        value={editForm.documento}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            documento: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col md="6">
                      <Label>Nombre</Label>
                      <Input
                        value={editForm.nombre}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            nombre: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col md="6">
                      <Label>Correo</Label>
                      <Input
                        value={editForm.correo}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            correo: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col md="6">
                      <Label>Teléfono</Label>
                      <Input
                        value={editForm.telefono}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            telefono: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col md="6">
                      <Label>Dirección</Label>
                      <Input
                        value={editForm.direccion}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            direccion: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col md="6">
                      <Label>Ciudad</Label>
                      <Input
                        type="select"
                        value={editForm.ciudad}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            ciudad: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar ciudad</option>
                        {ciudades.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Estado</Label>
                      <Input
                        type="select"
                        value={editForm.clienteEstado}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            clienteestado: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar estado</option>
                        {estadoClientes.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="12">
                      <Label>Observación</Label>
                      <Input
                        type="textarea"
                        rows="3"
                        value={editForm.observacion}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            observacion: e.target.value,
                          }))
                        }
                      />
                    </Col>
                  </Row>

                  <hr />
                  <h5 className="mt-3">Información adicional</h5>
                  <Row>
                    <Col md="6">
                      <Label>Zona</Label>
                      <Input
                        type="select"
                        value={editInfoForm.zona}
                        onChange={(e) =>
                          setEditInfoForm((p) => ({
                            ...p,
                            zona: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        {zonasDB.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Tipo de cliente</Label>
                      <Input
                        type="select"
                        value={editInfoForm.tipocliente}
                        onChange={(e) =>
                          setEditInfoForm((p) => ({
                            ...p,
                            tipocliente: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        {tiposClienteDB.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Vendedor</Label>
                      <Input
                        type="select"
                        value={editInfoForm.vendedor}
                        onChange={(e) =>
                          setEditInfoForm((p) => ({
                            ...p,
                            vendedor: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        {vendedoresDB.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.nombre}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Lista de precio</Label>
                      <Input
                        type="select"
                        value={editInfoForm.listaprecio}
                        onChange={(e) =>
                          setEditInfoForm((p) => ({
                            ...p,
                            listaprecio: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        {listasPreciosDB.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </>
              )}
            </>
          ) : (
            <p>Cargando información...</p>
          )}
        </ModalBody>
        <ModalFooter>
          {selectedClient && !editMode && (
            <Button
              color="primary"
              onClick={() => setEditMode(true)}
                 style={{
                background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                border: "none",
                borderRadius: "20px",
                color: "#fff",
                fontWeight: "600",
                padding: "12px 20px",
              }}
            >
              Editar
            </Button>
          )}
          {editMode && (
            <Button
              color="success"
              onClick={handleSaveEdit}
                style={{
                background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                border: "none",
                borderRadius: "20px",
                color: "#fff",
                fontWeight: "600",
                padding: "12px 20px",
              }}
            >
              Guardar
            </Button>
          )}
          <Button
            color="secondary"
            onClick={() => {
              setDetailModalOpen(false);
              setEditMode(false);
            }}
               style={{
                backgroundColor: "red",
                border: "none",
                borderRadius: "20px",
                color: "#fff",
                fontWeight: "600",
                padding: "12px 20px",
              }}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal deshabilitar con observación */}
      <Modal
        isOpen={disableModalOpen}
        toggle={() => setDisableModalOpen(false)}
      >
        <ModalHeader toggle={() => setDisableModalOpen(false)}>
          Deshabilitar cliente
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Motivo de deshabilitación</Label>
            <Input
              type="textarea"
              rows="4"
              value={disableObs}
              onChange={(e) => setDisableObs(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDisableModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="danger" onClick={handleConfirmDisable}>
            Deshabilitar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default List;
