import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import AceptarContext from "context/AceptarContext";
import Header from "components/Headers/Header";
import ReactBSAlert from "react-bootstrap-sweetalert";

const FormularioAceptacion = () => {
  const { clientesPendientes, aprobarCliente, rechazarCliente } =
    useContext(AceptarContext);

  const [selectedClient, setSelectedClient] = useState(null);
  const [mostrarCampoRechazo, setMostrarCampoRechazo] = useState(false);
  const [observacion, setObservacion] = useState("");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (clientesPendientes && clientesPendientes.length > 0) {
      setSelectedClient(clientesPendientes[0]);
    } else {
      setSelectedClient(null);
    }
  }, [clientesPendientes]);

  const handleConfirmarRechazo = () => {
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
        title="¿Confirmar rechazo?"
        onConfirm={async () => {
          await rechazarCliente(selectedClient.id, observacion);
          setAlert(null);
          setMostrarCampoRechazo(false);
          setObservacion("");
        }}
        onCancel={() => setAlert(null)}
      >
        ¿Seguro que deseas rechazar al cliente{" "}
        <strong>{selectedClient.nombre}</strong>?
      </ReactBSAlert>
    );
  };

  if (!selectedClient) {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow text-center p-4">
                <h4>No hay clientes pendientes de aceptación.</h4>
                <Link className="btn btn-primary mt-3" to="/admin/aceptar">
                  Volver
                </Link>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      {alert}
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Aceptar Cliente</h3>
                <p className="text-sm mb-0">
                  Revise la información antes de aceptar o rechazar al cliente.
                </p>
              </CardHeader>

              <CardBody>
                <Form>
                  {/* Información del cliente */}
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">Nombre</label>
                        <Input
                          type="text"
                          value={selectedClient.nombre}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">Dirección</label>
                        <Input
                          type="text"
                          value={selectedClient.direccion}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">Teléfono</label>
                        <Input
                          type="text"
                          value={selectedClient.telefono}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">Correo</label>
                        <Input
                          type="text"
                          value={selectedClient.correo}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">Ciudad</label>
                        <Input
                          type="text"
                          value={selectedClient.ciudad?.descripcion}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* 🟠 Campo de observación si se va a rechazar */}
                  {mostrarCampoRechazo && (
                    <Row className="mt-3">
                      <Col lg="12">
                        <FormGroup>
                          <label className="form-control-label">
                            Observación (motivo de rechazo)
                          </label>
                          <Input
                            type="textarea"
                            placeholder="Escribe el motivo por el cual se rechaza al cliente..."
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            rows="4"
                          />
                        </FormGroup>
                      </Col>

                      <Col
                        className="d-flex justify-content-end"
                        style={{ gap: "10px" }}
                      >
                        <Button
                          type="button"
                          color="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmarRechazo();
                          }}
                          style={{
                            borderRadius: "20px",
                            padding: "12px 20px",
                            background:
                              "linear-gradient(90deg, #E74C3C 0%, #C0392B 100%)",
                            border: "none",
                          }}
                        >
                          Confirmar Rechazo
                        </Button>

                        <Button
                          type="button"
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMostrarCampoRechazo(false);
                            setObservacion("");
                          }}
                          style={{
                            borderRadius: "20px",
                            padding: "12px 20px",
                          }}
                        >
                          Cancelar
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {/* 🟢 Botones principales */}
                  {!mostrarCampoRechazo && (
                    <Row className="mt-4 justify-content-end">
                      <Button
                        type="button"
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          aprobarCliente(selectedClient.id);
                        }}
                        style={{
                          marginRight: "10px",
                          borderRadius: "20px",
                          padding: "12px 20px",
                        }}
                      >
                        Aceptar
                      </Button>

                      <Button
                        type="button"
                        color="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Mostrar campo de rechazo activado ✅");
                          setMostrarCampoRechazo(true);
                        }}
                        style={{
                          borderRadius: "20px",
                          padding: "12px 20px",
                        }}
                      >
                        Rechazar
                      </Button>

                      <Link
                        className="btn btn-secondary ml-3"
                        to="/admin/aceptar"
                        style={{
                          borderRadius: "20px",
                          padding: "12px 20px",
                        }}
                      >
                        Cancelar
                      </Link>
                    </Row>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FormularioAceptacion;
