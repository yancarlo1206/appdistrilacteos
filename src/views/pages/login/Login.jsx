import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

import LoginContext from "context/LoginContext";
import LoginFormValidate from "../../../services/LoginForm";
import { useForm } from "hooks/useForm";
import { Link } from "react-router-dom";

const initialForm = {
  username: "",
  password: "",
};

const Login = () => {

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
  } = useForm(initialForm, LoginFormValidate.validationsForm);

  const {
    login
  } = useContext(LoginContext);

  useEffect(() => {
    setErrors(initialForm);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    let valid = handleSubmit(e);
    if (valid) {
      login(form);
    }
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Iniciar Sesión</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-control"
                    id="input-usuario"
                    placeholder="Usuario"
                    type="text"
                    name="username"
                    required="required"
                    invalid={errors.username !== ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={form.username}
                  />
                  <div className="invalid-feedback">
                    {errors.username}
                  </div>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-control"
                    id="input-password"
                    placeholder="Contraseña"
                    type="password"
                    name="password"
                    required="required"
                    invalid={errors.password !== ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={form.password}
                  />
                  <div className="invalid-feedback">
                    {errors.password}
                  </div>
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  className='btn btn-success my-4'
                  color="success"
                  href=""
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </Button>
                <div
                >
                  <a
                    href="/auth/registro-cliente"
                    style={{ color: "black" }}
                  >
                    Registrarse
                  </a>
                </div>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-dark"
              href="/auth/registro-cliente"
            >
              <small>Registrarse</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-dark"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Ver Estado Registro</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
