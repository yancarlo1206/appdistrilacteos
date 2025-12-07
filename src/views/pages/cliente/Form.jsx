import React, { useContext, useEffect, useState, useRef } from "react";
import Select from "react-select";
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

  const handleSelectChange = (selectedOption, action) => {
    handleChange({
      target: {
        name: action.name,
        value: selectedOption ? selectedOption.value : ""
      }
    });
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#65e45eff" : "#cad1d7",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(94, 114, 228, 0.25)" : null,
      "&:hover": {
        borderColor: "#65e45eff"
      }
    })
  };

  // Helper to find the current selected option object
  const getSelectedOption = (options, value) => {
    return options.find(option => option.value === value) || null;
  };

  // Map data to options
  const optionsTipoDocumentos = tipoDocumentos.map(i => ({ value: i.id, label: i.text }));
  const optionsCiudades = ciudades.map(i => ({ value: i.id, label: i.text }));
  const optionsTipoClientes = tipoClientes.map(i => ({ value: i.id, label: i.text }));
  const optionsZonas = zonas.map(i => ({ value: i.id, label: i.text }));
  const optionsListaPrecios = listaPrecios.map(i => ({ value: i.id, label: i.text }));
  const optionsVendedores = vendedores.map(i => ({ value: i.id, label: i.nombre || i.text }));
  const optionsEstadoClientes = estadoClientes.map(i => ({ value: i.id, label: i.text }));

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
                          <Select
                            id="input-tipoDocumento"
                            name="tipoDocumento"
                            options={optionsTipoDocumentos}
                            value={getSelectedOption(optionsTipoDocumentos, form.tipoDocumento)}
                            onChange={handleSelectChange}
                            onBlur={handleBlur}
                            placeholder="Seleccione..."
                            styles={customStyles}
                            className={errors.tipoDocumento ? "is-invalid" : ""}
                          />
                          <div className="invalid-feedback" style={{ display: errors.tipoDocumento ? "block" : "none" }}>
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
                          <Select
                            id="input-ciudad"
                            name="ciudad"
                            options={optionsCiudades}
                            value={getSelectedOption(optionsCiudades, form.ciudad)}
                            onChange={handleSelectChange}
                            onBlur={handleBlur}
                            placeholder="Seleccione..."
                            styles={customStyles}
                            className={errors.ciudad ? "is-invalid" : ""}
                          />
                          <div className="invalid-feedback" style={{ display: errors.ciudad ? "block" : "none" }}>
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
                                Tipo Cliente <span className="text-danger">*</span>
                              </label>
                              <Select
                                id="input-tipoCliente"
                                name="tipoCliente"
                                options={optionsTipoClientes}
                                value={getSelectedOption(optionsTipoClientes, form.tipoCliente)}
                                onChange={handleSelectChange}
                                onBlur={handleBlur}
                                placeholder="Seleccione..."
                                styles={customStyles}
                                className={errors.tipoCliente ? "is-invalid" : ""}
                              />
                              <div className="invalid-feedback" style={{ display: errors.tipoCliente ? "block" : "none" }}>
                                {errors.tipoCliente}
                              </div>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-zona"
                              >
                                Zona <span className="text-danger">*</span>
                              </label>
                              <Select
                                id="input-zona"
                                name="zona"
                                options={optionsZonas}
                                value={getSelectedOption(optionsZonas, form.zona)}
                                onChange={handleSelectChange}
                                onBlur={handleBlur}
                                placeholder="Seleccione..."
                                styles={customStyles}
                                className={errors.zona ? "is-invalid" : ""}
                              />
                              <div className="invalid-feedback" style={{ display: errors.zona ? "block" : "none" }}>
                                {errors.zona}
                              </div>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-listaPrecio"
                              >
                                Lista Precio <span className="text-danger">*</span>
                              </label>
                              <Select
                                id="input-listaPrecio"
                                name="listaPrecio"
                                options={optionsListaPrecios}
                                value={getSelectedOption(optionsListaPrecios, form.listaPrecio)}
                                onChange={handleSelectChange}
                                onBlur={handleBlur}
                                placeholder="Seleccione..."
                                styles={customStyles}
                                className={errors.listaPrecio ? "is-invalid" : ""}
                              />
                              <div className="invalid-feedback" style={{ display: errors.listaPrecio ? "block" : "none" }}>
                                {errors.listaPrecio}
                              </div>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-vendedor"
                              >
                                Vendedor <span className="text-danger">*</span>
                              </label>
                              <Select
                                id="input-vendedor"
                                name="vendedor"
                                options={optionsVendedores}
                                value={getSelectedOption(optionsVendedores, form.vendedor)}
                                onChange={handleSelectChange}
                                onBlur={handleBlur}
                                placeholder="Seleccione..."
                                styles={customStyles}
                                className={errors.vendedor ? "is-invalid" : ""}
                              />
                              <div className="invalid-feedback" style={{ display: errors.vendedor ? "block" : "none" }}>
                                {errors.vendedor}
                              </div>
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
                              <Select
                                id="input-clienteEstado"
                                name="clienteEstado"
                                options={optionsEstadoClientes}
                                value={getSelectedOption(optionsEstadoClientes, form.clienteEstado)}
                                onChange={handleSelectChange}
                                onBlur={handleBlur}
                                placeholder="Seleccione..."
                                styles={customStyles}
                                isDisabled={true}
                                className={errors.clienteEstado ? "is-invalid" : ""}
                              />
                              <div className="invalid-feedback" style={{ display: errors.clienteEstado ? "block" : "none" }}>
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
