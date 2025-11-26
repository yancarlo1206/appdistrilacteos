// src/views/tickets/List.jsx
import React, { useContext, useState, useEffect } from "react";
import TicketsContext from "../../../context/TicketsContext";
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

const API_URL = process.env.REACT_APP_API_URL;

function List() {
  const { tickets, deleteData, saveData, estadoTickets, prioridadTickets, tipoTickets } = useContext(TicketsContext);

  const [filter, setFilter] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // Filtro por estado
  const [prioridadFiltro, setPrioridadFiltro] = useState(""); // Filtro por prioridad
  const [tipoFiltro, setTipoFiltro] = useState(""); // Filtro por tipo

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  const [formData, setFormData] = useState({
    tipo: "",
    prioridad: "",
    estado: "",
    observacion: "",
  });

  const [state, setState] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const newTicket = {
        tipo: { id: parseInt(formData.tipo) },
        prioridad: { id: parseInt(formData.prioridad) },
        estado: { id: parseInt(formData.estado) },
        observacion: formData.observacion,
      };
      await saveData(newTicket);
      setState({
        alert: (
          <ReactBSAlert
            success
            style={{ display: "block" }}
            title="✅ Ticket registrado correctamente"
            onConfirm={() => setState({ alert: null })}
            confirmBtnBsStyle="success"
            confirmBtnText="Aceptar"
          >
            El ticket fue agregado exitosamente.
          </ReactBSAlert>
        ),
      });

      setFormData({
        tipo: "",
        prioridad: "",
        estado: "",
        observacion: "",
      });

      toggleModal();
    } catch (error) {
      console.error("❌ Error al guardar el ticket:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchID = filter === "" || ticket.id.toString().includes(filter);
    const matchEstado = estadoFiltro === "" || ticket.estado.descripcion.toLowerCase() === estadoFiltro.toLowerCase();
    const matchPrioridad = prioridadFiltro === "" || ticket.prioridad.descripcion.toLowerCase() === prioridadFiltro.toLowerCase();
    const matchTipo = tipoFiltro === "" || ticket.tipo.descripcion.toLowerCase() === tipoFiltro.toLowerCase();

    return matchID && matchEstado && matchPrioridad && matchTipo;
  });

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "100px" },
    { name: "Tipo", selector: (row) => row.tipo.descripcion, sortable: true },
    { name: "Prioridad", selector: (row) => row.prioridad.descripcion, sortable: true },
    { name: "Estado", selector: (row) => row.estado.descripcion, sortable: true },
    { name: "Observaciones", selector: (row) => row.observacion, sortable: true },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <Button onClick={() => deleteData(row.id)}>Eliminar</Button>
        </>
      ),
    },
  ];

  return (
    <Container className="mt--7" fluid>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">Tickets</h3>
                  <p className="text-sm mb-0">Listado de tickets registrados en el sistema</p>
                </div>
                <div>
                  <Button onClick={toggleModal}>
                    <FaPlus style={{ marginRight: "8px" }} />
                    Agregar Ticket
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="mb-3">
                <Col md="6">
                  <FormGroup>
                    <Label for="buscar">Buscar por número de Ticket</Label>
                    <Input id="buscar" type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Filtrar por Estado</Label>
                    <Input type="select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                      <option value="">Todos</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Filtrar por Prioridad</Label>
                    <Input type="select" value={prioridadFiltro} onChange={(e) => setPrioridadFiltro(e.target.value)}>
                      <option value="">Todos</option>
                      <option value="Urgente">Urgente</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <DataTable columns={columns} data={filteredTickets} pagination highlightOnHover />
            </CardBody>
          </Card>
        </div>
      </Row>

      {/* Modal de agregar Ticket */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Agregar Ticket</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="4">
              <FormGroup>
                <Label for="tipo">Tipo</Label>
                <Input
                  type="select"
                  name="tipo"
                  id="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipoTickets.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
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
                  {prioridadTickets.map((prioridad) => (
                    <option key={prioridad.id} value={prioridad.id}>
                      {prioridad.descripcion}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label for="estado">Estado</Label>
                <Input
                  type="select"
                  name="estado"
                  id="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar estado</option>
                  {estadoTickets.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.descripcion}
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
          <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
          <Button color="success" onClick={handleSave}>Guardar</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default List;
