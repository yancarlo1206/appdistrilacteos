// src/views/aceptar/ListAceptacion.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReactBSAlert from "react-bootstrap-sweetalert";

const API_URL = process.env.REACT_APP_API_URL;

const ListAceptacion = () => {
  const [clientes, setClientes] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [mostrarCamposExtra, setMostrarCamposExtra] = useState(false);
  const [mostrarCampoRechazo, setMostrarCampoRechazo] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [observacion, setObservacion] = useState("");

  const [formExtra, setFormExtra] = useState({
    zona: "",
    tipo: "",
    vendedor: "",
    listaPrecios: "",
    usuario: "",
    password: "",
  });

  const [zonasDB, setZonasDB] = useState([]);
  const [tiposDB, setTiposDB] = useState([]);
  const [vendedoresDB, setVendedoresDB] = useState([]);
  const [listasPreciosDB, setListasPreciosDB] = useState([]);
  const [tiposDocumentoDB, setTiposDocumentoDB] = useState([]);
  const [ciudadesDB, setCiudadesDB] = useState([]);

  useEffect(() => {
    fetchPendientes();
    fetchData();
  }, []);

  // === Cargar clientes pendientes ===
  const fetchPendientes = async () => {
    setLoading(true);
    try {
      const [resProceso, resRevision] = await Promise.all([
        fetch(`${API_URL}cliente/pendientes?estado=En proceso`),
        fetch(`${API_URL}cliente/pendientes?estado=En revisión`),
      ]);

      const dataProceso = await resProceso.json();
      const dataRevision = await resRevision.json();

      const clientesCombinados = [
        ...(dataProceso.data || []),
        ...(dataRevision.data || []),
      ];

      const unicos = clientesCombinados.filter(
        (c, i, arr) => i === arr.findIndex((x) => x.id === c.id)
      );

      setClientes(unicos.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  // === Cargar catálogos desde BD ===
  const fetchData = async () => {
    try {
      const [zRes, tRes, vRes, lRes, tdRes, cRes] = await Promise.all([
        fetch(`${API_URL}zona`),
        fetch(`${API_URL}cliente_tipo`),
        fetch(`${API_URL}vendedor`),
        fetch(`${API_URL}lista_precio`),
        fetch(`${API_URL}tipo_documento`),
        fetch(`${API_URL}ciudad`),
      ]);
      const [z, t, v, l, td, c] = await Promise.all([
        zRes.json(),
        tRes.json(),
        vRes.json(),
        lRes.json(),
        tdRes.json(),
        cRes.json(),
      ]);

      setZonasDB(z.data || []);
      setTiposDB(t.data || []);
      setVendedoresDB(v.data || []);
      setListasPreciosDB(l.data || []);
      setTiposDocumentoDB(td.data || []);
      setCiudadesDB(c.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  // === Cambiar estado de cliente ===
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(
        `${API_URL}cliente/${id}/estado?nuevoEstado=${encodeURIComponent(
          nuevoEstado
        )}`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Error al cambiar estado");
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // === Revisar cliente ===
  const handleRevisar = async (cliente) => {
    setSelectedClient(cliente);
    setModalDetalle(true);
    setMostrarCamposExtra(false);
    await cambiarEstado(cliente.id, "En revisión");
  };

  // === Activar modo edición ===
  const handleAprobar = () => setMostrarCamposExtra(true);

  // === Guardar y aceptar ===
  const handleGuardarAceptacion = async () => {
    // Validación campos obligatorios
    const camposCliente = [
      "tipo_documento",
      "documento",
      "nombre",
      "correo",
      "telefono",
      "direccion",
      "ciudad",
    ];
    const camposExtra = [
      "zona",
      "tipo",
      "vendedor",
      "listaPrecios",
      "usuario",
      "password",
    ];

    const vaciosCliente = camposCliente.filter(
      (campo) => !selectedClient[campo] || selectedClient[campo] === ""
    );
    const vaciosExtra = camposExtra.filter(
      (campo) => !formExtra[campo] || formExtra[campo] === ""
    );

    if (vaciosCliente.length > 0 || vaciosExtra.length > 0) {
      setAlert(
        <ReactBSAlert
          warning
          title="Campos incompletos"
          onConfirm={() => setAlert(null)}
          confirmBtnBsStyle="warning"
        >
          Por favor completa todos los campos obligatorios antes de continuar.
        </ReactBSAlert>
      );
      return;
    }

    // Si pasa la validación, muestra confirmación
    setAlert(
      <ReactBSAlert
        info
        showCancel
        title="¿Aprobar cliente?"
        confirmBtnText="Sí, aprobar"
        cancelBtnText="Cancelar"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="secondary"
        onConfirm={async () => {
          try {
            // 1️⃣ Actualizar cliente (versión corregida)
            const clienteActualizado = {
              id: selectedClient.id,
              nombre: selectedClient.nombre,
              documento: selectedClient.documento,
              correo: selectedClient.correo,
              telefono: selectedClient.telefono,
              direccion: selectedClient.direccion,
              tipo_documento: {
                id: Number(
                  selectedClient.tipo_documento?.id ||
                    selectedClient.tipo_documento
                ),
                descripcion: selectedClient.tipo_documento?.descripcion || "",
              },
              ciudad: {
                id: Number(selectedClient.ciudad?.id || selectedClient.ciudad),
                descripcion: selectedClient.ciudad?.descripcion || "",
              },
              observacion: selectedClient.observacion || "",
            };

            // Enviar PUT con JSON completo
            // 1️⃣ Actualizar cliente (formato compatible con tu backend)
            const resCliente = await fetch(
              `${API_URL}cliente/${selectedClient.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: selectedClient.id,
                  nombre: selectedClient.nombre,
                  documento: selectedClient.documento,
                  correo: selectedClient.correo,
                  telefono: selectedClient.telefono,
                  direccion: selectedClient.direccion,
                  tipo_documento: {
                    id: Number(
                      selectedClient.tipo_documento?.id ||
                        selectedClient.tipo_documento
                    ),
                  },
                  ciudad: {
                    id: Number(
                      selectedClient.ciudad?.id || selectedClient.ciudad
                    ),
                  },
                  observacion: selectedClient.observacion || "",
                  cliente_estado: { id: 3 }, // 👈 AGREGA ESTO
                }),
              }
            );

            if (!resCliente.ok) {
              const errorText = await resCliente.text();
              console.error("Error PUT cliente:", errorText);
              throw new Error("Error al actualizar cliente");
            }

            // 2️⃣ Guardar datos extra en cliente_informacion
            await fetch(`${API_URL}cliente_informacion`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cliente: { id: selectedClient.id },
                zona: { id: formExtra.zona },
                cliente_tipo: { id: formExtra.tipo },
                vendedor: { id: formExtra.vendedor },
                lista_precio: { id: formExtra.listaPrecios },
                usuario: formExtra.usuario,
                password: formExtra.password,
              }),
            });

            // 3️⃣ Cambiar estado a Aceptado
            await cambiarEstado(selectedClient.id, "Aceptado");

            // 4️⃣ Mostrar confirmación de éxito
            setAlert(
              <ReactBSAlert
                success
                title="Éxito"
                onConfirm={() => setAlert(null)}
              >
                Cliente aprobado y datos guardados correctamente.
              </ReactBSAlert>
            );

            // 5️⃣ Resetear vistas
            setModalDetalle(false);
            setMostrarCamposExtra(false);
            setMostrarCampoRechazo(false);
            fetchPendientes(); // refresca la tabla
          } catch (err) {
            console.error("❌ Error guardando cliente:", err);
            setAlert(
              <ReactBSAlert
                danger
                title="Error"
                onConfirm={() => setAlert(null)}
              >
                Ocurrió un error al guardar la información.
              </ReactBSAlert>
            );
          }
        }}
        onCancel={() => setAlert(null)}
      >
        Se aprobará este cliente y se guardará la información adicional.
      </ReactBSAlert>
    );
  };

  // === Rechazar cliente ===
  const handleRechazar = () => {
    if (!mostrarCampoRechazo) {
      setMostrarCampoRechazo(true);
      return;
    }

    if (!observacion.trim()) {
      setAlert(
        <ReactBSAlert
          warning
          title="Campo vacío"
          onConfirm={() => setAlert(null)}
          confirmBtnBsStyle="warning"
        >
          Por favor escribe una observación o motivo de rechazo.
        </ReactBSAlert>
      );
      return;
    }

    setAlert(
      <ReactBSAlert
        danger
        showCancel
        confirmBtnText="Sí, rechazar"
        cancelBtnText="Cancelar"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="secondary"
        title="¿Rechazar cliente?"
        onConfirm={async () => {
          await cambiarEstado(selectedClient.id, "Rechazado");
          setModalDetalle(false);
          setMostrarCampoRechazo(false);
          setObservacion("");
          fetchPendientes();
          // 👇 mostrar confirmación nueva
          setAlert(
            <ReactBSAlert
              success
              title="Cliente rechazado"
              onConfirm={() => setAlert(null)}
            >
              El cliente fue rechazado correctamente.
            </ReactBSAlert>
          );
        }}
        onCancel={() => setAlert(null)}
      >
        ¿Seguro que deseas rechazar a este cliente?
      </ReactBSAlert>
    );
  };

  // === Control cambios en inputs ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si el cambio viene de los select de tipo_documento o ciudad
    if (name === "tipo_documento") {
      const tipo = tiposDocumentoDB.find((t) => t.id === Number(value));
      setSelectedClient((prev) => ({ ...prev, tipo_documento: tipo }));
    } else if (name === "ciudad") {
      const ciudad = ciudadesDB.find((c) => c.id === Number(value));
      setSelectedClient((prev) => ({ ...prev, ciudad }));
    } else {
      setSelectedClient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setFormExtra((prev) => ({ ...prev, [name]: value }));
  };

  // === Columnas tabla ===
  const columns = [
    {
      name: "Tipo Documento",
      selector: (row) => row.tipo_documento?.descripcion,
    },
    { name: "Documento", selector: (row) => row.documento },
    { name: "Nombre", selector: (row) => row.nombre },
    { name: "Correo", selector: (row) => row.correo },
    { name: "Teléfono", selector: (row) => row.telefono },
    { name: "Dirección", selector: (row) => row.direccion },
    {
      name: "Ciudad",
      selector: (row) => row.ciudad?.descripcion || "—",
    },
    {
      name: "Acción",
      width: "150px",
      cell: (row) => (
        <Button
          className="btn btn-sm btn-primary"
          style={{
            background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
            border: "none",
            borderRadius: "10px",
          }}
          onClick={() => handleRevisar(row)}
        >
          Revisar
        </Button>
      ),
    },
  ];

  return (
    <>
      {alert}
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Clientes Pendientes ({clientes.length})</h3>
              <Input
                type="text"
                placeholder="Buscar..."
                style={{ width: "300px" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-center p-5">
                <Spinner color="success" />
                <p className="mt-3">Cargando información...</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={clientes.filter((item) =>
                  Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(filter.toLowerCase())
                )}
                pagination
                highlightOnHover
              />
            )}
          </CardBody>
        </Card>
      </Container>

      {/* === MODAL DETALLE === */}
      <Modal isOpen={modalDetalle} size="lg">
        <ModalHeader
          toggle={() => {
            setModalDetalle(false);
            setMostrarCamposExtra(false);
            setMostrarCampoRechazo(false);
          }}
        >
          Detalle del Cliente
        </ModalHeader>
        <ModalBody>
          {selectedClient && (
            <>
              {/* Vista normal */}
              {!mostrarCamposExtra && (
                <Row>
                  <Col md="6">
                    <strong>ID:</strong> {selectedClient.id}
                  </Col>
                  <Col md="6">
                    <strong>Tipo Documento:</strong>{" "}
                    {selectedClient.tipo_documento?.descripcion}
                  </Col>
                  <Col md="6">
                    <strong>Nombre:</strong> {selectedClient.nombre}
                  </Col>
                  <Col md="6">
                    <strong>Documento:</strong> {selectedClient.documento}
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
                  <Col md="12" className="mt-3">
                    <strong>Observación:</strong>{" "}
                    {selectedClient.observacion || "Sin observación"}
                  </Col>
                </Row>
              )}

              {/* Modo edición */}
              {mostrarCamposExtra && (
                <>
                  <Row className="mb-3">
                    <Col md="6">
                      <Label>ID</Label>
                      <Input
                        name="id"
                        value={selectedClient.id || ""}
                        disabled
                      />
                    </Col>

                    <Col md="6">
                      <Label>Tipo Documento</Label>
                      <Input
                        type="select"
                        name="tipo_documento"
                        value={selectedClient.tipo_documento?.id || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccionar...</option>
                        {tiposDocumentoDB.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Número de Documento</Label>
                      <Input
                        name="documento"
                        value={selectedClient.documento || ""}
                        onChange={handleInputChange}
                      />
                    </Col>

                    <Col md="6">
                      <Label>Nombre</Label>
                      <Input
                        name="nombre"
                        value={selectedClient.nombre || ""}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Correo</Label>
                      <Input
                        name="correo"
                        value={selectedClient.correo || ""}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Teléfono</Label>
                      <Input
                        name="telefono"
                        value={selectedClient.telefono || ""}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Dirección</Label>
                      <Input
                        name="direccion"
                        value={selectedClient.direccion || ""}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Ciudad</Label>
                      <Input
                        type="select"
                        name="ciudad"
                        value={selectedClient.ciudad?.id || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccionar...</option>
                        {ciudadesDB.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="12">
                      <Label>Observación</Label>
                      <Input
                        type="textarea"
                        rows="3"
                        name="observacion"
                        value={selectedClient.observacion || ""}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <h5 className="text-success">Información adicional</h5>
                  <Row>
                    <Col md="6">
                      <Label>Zona</Label>
                      <Input
                        type="select"
                        name="zona"
                        value={formExtra.zona}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {zonasDB.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Tipo</Label>
                      <Input
                        type="select"
                        name="tipo"
                        value={formExtra.tipo}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {tiposDB.map((t) => (
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
                        name="vendedor"
                        value={formExtra.vendedor}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {vendedoresDB.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.nombre}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Lista de Precios</Label>
                      <Input
                        type="select"
                        name="listaPrecios"
                        value={formExtra.listaPrecios}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {listasPreciosDB.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.descripcion}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Usuario</Label>
                      <Input
                        name="usuario"
                        value={formExtra.usuario}
                        onChange={handleExtraChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Contraseña</Label>
                      <div style={{ position: "relative" }}>
                        <Input
                          type={mostrarPassword ? "text" : "password"}
                          name="password"
                          value={formExtra.password}
                          onChange={handleExtraChange}
                        />
                        <span
                          onClick={() => setMostrarPassword(!mostrarPassword)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "8px",
                            cursor: "pointer",
                          }}
                        >
                          {mostrarPassword ? (
                            <FaEye color="#58AB01" />
                          ) : (
                            <FaEyeSlash color="gray" />
                          )}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      color="success"
                      onClick={handleGuardarAceptacion}
                      style={{
                        borderRadius: "20px",
                        padding: "10px 20px",
                        background:
                          "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                        border: "none",
                      }}
                    >
                      Guardar y Aceptar
                    </Button>
                  </div>
                </>
              )}

              {/* Modal rechazo */}
              {mostrarCampoRechazo && (
                <Col md="12" className="mt-3">
                  <FormGroup>
                    <Label>Observación (motivo de rechazo)</Label>
                    <Input
                      type="textarea"
                      rows="3"
                      placeholder="Escribe el motivo de rechazo..."
                      value={observacion}
                      onChange={(e) => setObservacion(e.target.value)}
                    />
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        color="danger"
                        onClick={handleRechazar}
                        style={{
                          borderRadius: "10px",
                          padding: "10px 20px",
                          background:
                            "linear-gradient(90deg, #E74C3C 0%, #C0392B 100%)",
                          border: "none",
                        }}
                      >
                        Confirmar Rechazo
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => setMostrarCampoRechazo(false)}
                        style={{
                          borderRadius: "10px",
                          padding: "10px 20px",
                          marginLeft: "10px",
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
              )}

              {/* Botones principales */}
              {!mostrarCamposExtra && !mostrarCampoRechazo && (
                <div className="d-flex justify-content-end mt-4">
                  <Button
                    color="success"
                    onClick={handleAprobar}
                    style={{ borderRadius: "10px", padding: "10px 20px" }}
                  >
                    Aprobar
                  </Button>
                  <Button
                    color="danger"
                    onClick={handleRechazar}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 20px",
                      marginLeft: "10px",
                    }}
                  >
                    Rechazar
                  </Button>
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              setModalDetalle(false);
              setMostrarCamposExtra(false);
              setMostrarCampoRechazo(false);
            }}
            style={{ borderRadius: "20px" }}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ListAceptacion;
