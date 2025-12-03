import React, { useContext, useEffect, useState, useRef } from "react";
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

import { Link, useParams } from "react-router-dom";
import ClienteContext from "context/ClienteContext";
import ClienteFormValidate from "../../../services/ClienteForm";
import { useForm } from "hooks/useForm";
import Header from "components/Headers/Header";

const initialForm = {
  nombre: "",
  direccion: "",
  telefono: "",
  correo: "",
  tipoDocumento: "",
  documento: "",
  ciudad: "",
  clienteEstado: "",
};

const initialFormUpdate = {
  nombre: "",
  direccion: "",
  telefono: "",
  correo: "",
  tipoDocumento: "",
  documento: "",
  ciudad: "",
  tipoCliente: "",
  zona: "",
  vendedor: "",
  listaPrecio: "",
  clienteEstado: "",
};

const Formulario = () => {
  const {
    detail: data,
    updateData,
    saveData,
    setModule,
    module,
    setToDetail,
    setDetail,
    setToUpdate,
    ciudades,
    tipoDocumentos,
    estadoClientes,
    zonas,
    vendedores,
    listaPrecios,
    tipoClientes,
  } = useContext(ClienteContext);

  const {
    validateInit,
    validate,
    form,
    errors,
    setValidateInit,
    setValidate,
    setForm,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialForm, ClienteFormValidate.validationsForm);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setToDetail(id);
      setToUpdate(id);
      setModule("actualizar");
    } else {
      setModule("agregar");
    }
  }, []);

  useEffect(() => {
    setForm(data);
    if (module === "actualizar") {
      setErrors(initialFormUpdate);
    } else {
      setErrors(initialForm);
    }
  }, [data]);

  const handleUpdate = (e) => {
    e.preventDefault();
    let valid = handleSubmit(e);
    if (valid) {
      updateData(form);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    let valid = handleSubmit(e);
    if (valid) {
      saveData(form);
    }
  };

  return (
    <>
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="">
                <div className="align-items-center row">
                  <div className="col-11">
                    <h3 className="mb-0">{module?.toUpperCase()} CLIENTE</h3>
                    <p className="text-sm mb-0">
                      Formulario de gestion de clientes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Form autoComplete="off">
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-tipoDocumento"
                          >
                            Tipo Documento <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-tipoDocumento"
                            type="select"
                            name="tipoDocumento"
                            value={form.tipoDocumento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={errors.tipoDocumento !== ""}
                          >
                            <option value="" hidden></option>
                            {tipoDocumentos.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.text}
                              </option>
                            ))};
                          </Input>
                          <div className="invalid-feedback">
                            {errors.tipoDocumento}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-documento"
                          >
                            Documento <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-documento"
                            placeholder=""
                            type="text"
                            name="documento"
                            required="required"
                            invalid={errors.documento !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.documento}
                          />
                          <div className="invalid-feedback">
                            {errors.documento}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-nombre"
                          >
                            Nombre <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-nombre"
                            placeholder=""
                            type="text"
                            name="nombre"
                            required="required"
                            invalid={errors.nombre !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.nombre}
                          />
                          <div className="invalid-feedback">
                            {errors.nombre}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-telefono"
                          >
                            Teléfono <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-telefono"
                            placeholder=""
                            type="number"
                            name="telefono"
                            required="required"
                            invalid={errors.telefono !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.telefono}
                            autoComplete="off"
                            inputMode="numeric"
                            min={0}
                            step="any"
                          />
                          <div className="invalid-feedback">
                            {errors.telefono}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-correo"
                          >
                            Correo <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-correo"
                            placeholder=""
                            type="email"
                            name="correo"
                            required="required"
                            invalid={errors.correo !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.correo}
                            autoComplete="off"
                          />
                          <div className="invalid-feedback">
                            {errors.correo}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-direccion"
                          >
                            Dirección <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-direccion"
                            placeholder=""
                            type="text"
                            name="direccion"
                            required="required"
                            invalid={errors.direccion !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.direccion}
                            autoComplete="off"
                          />
                          <div className="invalid-feedback">
                            {errors.direccion}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-ciudad"
                          >
                            Ciudad <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-ciudad"
                            type="select"
                            name="ciudad"
                            value={form.ciudad}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={errors.ciudad !== ""}
                          >
                            <option value="" hidden></option>
                            {ciudades.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.text}
                              </option>
                            ))};
                          </Input>
                          <div className="invalid-feedback">
                            {errors.ciudad}
                          </div>
                        </FormGroup>
                      </Col>
                      {module === 'actualizar' && (
                        <>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-tipoCliente"
                              >
                                Tipo Cliente
                              </label>
                              <Input
                                className="form-control"
                                id="input-tipoCliente"
                                type="select"
                                name="tipoCliente"
                                value={form.tipoCliente}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="" hidden></option>
                                {tipoClientes.map(item => (
                                  <option key={item.id} value={item.id}>
                                    {item.text}
                                  </option>
                                ))};
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-zona"
                              >
                                Zona
                              </label>
                              <Input
                                className="form-control"
                                id="input-zona"
                                type="select"
                                name="zona"
                                value={form.zona}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="" hidden></option>
                                {zonas.map(item => (
                                  <option key={item.id} value={item.id}>
                                    {item.text}
                                  </option>
                                ))};
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-listaPrecio"
                              >
                                Lista Precio
                              </label>
                              <Input
                                className="form-control"
                                id="input-listaPrecio"
                                type="select"
                                name="listaPrecio"
                                value={form.listaPrecio}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="" hidden></option>
                                {listaPrecios.map(item => (
                                  <option key={item.id} value={item.id}>
                                    {item.text}
                                  </option>
                                ))};
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-vendedor"
                              >
                                Vendedor
                              </label>
                              <Input
                                className="form-control"
                                id="input-vendedor"
                                type="select"
                                name="vendedor"
                                value={form.vendedor}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="" hidden></option>
                                {vendedores.map(item => (
                                  <option key={item.id} value={item.id}>
                                    {item.text}
                                  </option>
                                ))};
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-estadoCliente"
                              >
                                Estado Cliente <span className="text-danger">*</span>
                              </label>
                              <Input
                                className="form-control"
                                id="input-clienteEstado"
                                type="select"
                                name="clienteEstado"
                                value={form.clienteEstado}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={errors.clienteEstado !== ""}
                              >
                                <option value="" hidden></option>
                                {estadoClientes.map(item => (
                                  <option key={item.id} value={item.id}>
                                    {item.text}
                                  </option>
                                ))};
                              </Input>
                              <div className="invalid-feedback">
                                {errors.clienteEstado}
                              </div>
                            </FormGroup>
                          </Col>
                        </>
                      )}
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-observacion"
                          >
                            Observación
                          </label>
                          <Input
                            className="form-control"
                            id="input-observacion"
                            placeholder=""
                            type="textarea"
                            rows="3"
                            name="observacion"
                            required="required"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.observacion}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="col justify-content-end">
                      {module == "actualizar" ? (
                        <Button
                          color="success"
                          href=""
                          onClick={handleUpdate}
                        >
                          Actualizar
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          href=""
                          onClick={handleSave}
                        >
                          Guardar
                        </Button>
                      )}
                      <Link
                        className="btn btn-danger"
                        color="default"
                        to={"/admin/cliente"}
                      >
                        Cancelar
                      </Link>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Formulario;
