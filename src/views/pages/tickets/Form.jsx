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
import TicketsContext from "context/TicketsContext";
import TicketsFormValidate from "../../../services/TicketsForm";
import { useForm } from "hooks/useForm";
import Header from "components/Headers/Header";

const initialForm = {
  fecha: "",
  tipo: "",
  prioridad: "",
  estado: "",
  observacion: "",

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
  } = useContext(TicketsContext);

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
  } = useForm(initialForm, TicketsFormValidate.validationsForm);

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
    setErrors(initialForm);
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
      {/* <Header /> */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="">
                <div className="align-items-center row">
                  <div className="col-11">
                    <h3 className="mb-0">{module?.toUpperCase()} TICKETS</h3>
                    <p className="text-sm mb-0">
                      Formulario de gestion de tickets
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-fecha"
                          >
                            Fecha <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-fecha"
                            placeholder=""
                            type="text"
                            name="fecha"
                            required="required"
                            invalid={errors.fecha !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.fecha}
                          />
                          <div className="invalid-feedback">
                            {errors.fecha}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-tipo"
                          >
                            Tipo <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-tipo"
                            placeholder=""
                            type="text"
                            name="tipo"
                            required="required"
                            invalid={errors.tipo !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.tipo}
                          />
                          <div className="invalid-feedback">
                            {errors.tipo}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-prioridad"
                          >
                            Prioridad <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-prioridad"
                            placeholder=""
                            type="text"
                            name="prioridad"
                            required="required"
                            invalid={errors.prioridad !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.prioridad}
                          />
                          <div className="invalid-feedback">
                            {errors.prioridad}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-estado"
                          >
                            Estado <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-estado"
                            placeholder=""
                            type="text"
                            name="estado"
                            required="required"
                            invalid={errors.estado !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.estado}
                          />
                          <div className="invalid-feedback">
                            {errors.estado}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-observacion"
                          >
                            Observacion <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="form-control"
                            id="input-observacion"
                            placeholder=""
                            type="text"
                            name="observacion"
                            required="required"
                            invalid={errors.observacion !== ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={data.observacion}
                          />
                          <div className="invalid-feedback">
                            {errors.observacion}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="col justify-content-end">
                      {module == "actualizar" ? (
                        <Button color="primary" href="" onClick={handleUpdate}>
                          Actualizar
                        </Button>
                      ) : (
                        <Button
                          href=""
                          onClick={handleSave}
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
                          Guardar
                        </Button>
                      )}
                      <Link
                        className="btn btn-danger"
                        color="default"
                        to={"/admin/tickets"}
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
