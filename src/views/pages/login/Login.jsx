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
    usuario: "",
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
  },[]);

  const handleLogin = (e) => {
    e.preventDefault();
    let valid = handleSubmit(e);
    if(valid){
        login(form);
    }
}

    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
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
                      name="usuario"
                      required="required"
                      invalid={errors.usuario !== ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={form.usuario}
                      />
                      <div className="invalid-feedback">
                          {errors.usuario}
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
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button
                  className='btn btn-primary my-4'
                  color="primary"
                  href=""
                  onClick={handleLogin}
                  >
                    Iniciar Sesión 
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Olvidaste tu contraseña?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>¿No tienes una cuenta?</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    );
  };
  
  export default Login;
  