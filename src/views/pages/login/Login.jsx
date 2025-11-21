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
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const { login } = useContext(LoginContext);

  useEffect(() => {
    setErrors(initialForm);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    let valid = handleSubmit(e);
    if (valid) {
      login(form);
    }
  };
  const [ocultarConstrasenia, setOcultarContrasenia] = useState(false);
  // const [recordarme, setRecordarme] = useState(false);

  const togglePasswordVisibility = () => {
    setOcultarContrasenia(!ocultarConstrasenia);
  };

  // 🔹 estados para mover el label inmediatamente
  const [usuarioFocus, setUsuarioFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const groupStyle = {
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

  const barStyle = {
    position: "relative",
    display: "block",
    width: "100%",
    height: "2px",
    background: "transparent",
  };

  const highlightStyle = {
    position: "absolute",
    height: "60%",
    width: "100px",
    top: "25%",
    left: 0,
    pointerEvents: "none",
    opacity: 0.5,
  };

  return (
    <>
      <style>
        {`
          .input-group,
          .input-group-alternative,
          .input-group-alternative .form-control,
          .input-group-alternative .input-group-text {
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
          }
          input {
            background: transparent !important;
          }
          input:focus {
            outline: none !important;
          }
        `}
      </style>

      <Col lg="5" md="7">
        <Card
          className=" shadow border-0"
          style={{
            backgroundColor: "rgba(235, 235, 235, 0.7)",
            borderRadius: "2rem",
            boxShadow: "0 8px 18px rgba(0, 0, 0, 0.25)",
            padding: "20px",
            backdropFilter: "blur(6px)",
            transform: "translateY(-10px)",
            border: "none",
          }}
        >
          <CardBody className="px-lg-10 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h2
                className="text-black"
                style={{
                  fontWeight: "800",
                  marginBottom: "30px",
                  fontSize: "1.5rem",
                }}
              >
                Iniciar Sesión
              </h2>
            </div>
            <Form role="form">
              {/* USUARIO */}
              <FormGroup className="mb-6 mt-4">
                <InputGroup
                  className="input-group-alternative"
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <div style={{ width: "100%", position: "relative" }}>
                    <input
                      id="input-username"
                      style={inputStyle}
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      onBlur={(e) => {
                        handleBlur(e);
                        setUsuarioFocus(false);
                      }}
                      onFocus={() => setUsuarioFocus(true)}
                      required
                    />
                    <label
                      htmlFor="input-username"
                      style={{
                        ...labelStyle,
                        top:
                          form.username !== "" || usuarioFocus
                            ? "-20px"
                            : "10px",
                        fontSize:
                          form.username !== "" || usuarioFocus ? "13px" : "16px",
                        color:
                          form.username !== "" || usuarioFocus
                            ? "gray"
                            : "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Usuario
                    </label>

                    <span style={highlightStyle}></span>
                    <span style={barStyle}></span>
                    <div
                      className="invalid-feedback"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {errors.username}
                    </div>
                  </div>
                </InputGroup>
              </FormGroup>

              {/* CONTRASEÑA */}
              <FormGroup style={groupStyle}>
                <InputGroup
                  className="input-group-alternative"
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <div style={{ width: "100%", position: "relative" }}>
                    <input
                      id="input-password"
                      style={inputStyle}
                      type={ocultarConstrasenia ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={(e) => {
                        handleBlur(e);
                        setPasswordFocus(false);
                      }}
                      onFocus={() => setPasswordFocus(true)}
                      required
                    />
                    <label
                      htmlFor="input-password"
                      style={{
                        ...labelStyle,
                        top:
                          form.password !== "" || passwordFocus
                            ? "-20px"
                            : "10px",
                        fontSize:
                          form.password !== "" || passwordFocus
                            ? "13px"
                            : "16px",
                        color:
                          form.password !== "" || passwordFocus
                            ? "gray"
                            : "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Contraseña
                    </label>

                    <span style={highlightStyle}></span>
                    <span style={barStyle}></span>

                    <InputGroupText
                      style={{
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "none",
                        position: "absolute",
                        right: "10px",
                        top: "5px",
                      }}
                      onClick={togglePasswordVisibility}
                    >
                      {ocultarConstrasenia ? (
                        <FaEye color="gray" />
                      ) : (
                        <FaEyeSlash color="gray" />
                      )}
                    </InputGroupText>

                    <div
                      className="invalid-feedback"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {errors.password}
                    </div>
                  </div>
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button
                  className="btn btn-primary my-4"
                  color="primary"
                  href=""
                  onClick={handleLogin}
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
                  Iniciar Sesión
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-3">
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
        </Row> */}
      </Col>
      
    </>
  );
};

export default Login;
