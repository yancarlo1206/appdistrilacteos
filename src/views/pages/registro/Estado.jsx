import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from "reactstrap";

import { Link, useParams } from "react-router-dom";
import RegistroContext from "context/RegistroContext";
import EstadoFormValidate from "../../../services/EstadoForm";
import { useForm } from "hooks/useForm";

import { Progress } from "reactstrap";

const initialForm = {
    tipoDocumento: "",
    documento: "",
};

const Formulario = () => {

    const {
        detail: data, saveData, tipoDocumentos, consultarData, detailState
    } = useContext(RegistroContext);

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
    } = useForm(initialForm, EstadoFormValidate.validationsForm);

    useEffect(() => {
        setForm(data);
        setErrors(initialForm);
    }, [data]);

    const handleConsultar = (e) => {
        e.preventDefault();
        let valid = handleSubmit(e);
        if (valid) {
            consultarData(form);
        }
    }

    return (
        <>
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="">
                                <div className="align-items-center row">
                                    <div className="col-11">
                                        <h3 className="mb-0">Estado del Cliente</h3>
                                        <p className="text-sm mb-0">
                                            Formulario de estado del cliente
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
                                        </Row>
                                        <Row>
                                            <Col lg="12" className="mb-4">
                                                <div className="progress-wrapper">
                                                    <div className="progress-info">
                                                        <div className="progress-label">
                                                            <span>{detailState.estado}</span>
                                                        </div>
                                                        <div className="progress-percentage">
                                                            <span>{detailState.porcentaje}%</span>
                                                        </div>
                                                    </div>
                                                    <Progress max="100" value={detailState.porcentaje} color="success" />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="col justify-content-end">
                                            <Button
                                                color="success"
                                                href=""
                                                onClick={handleConsultar}
                                            >
                                                Consultar
                                            </Button>
                                            <Link
                                                className="btn btn-danger"
                                                color="default"
                                                to={"/auth/login"}
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
            </Container >
        </>
    );
};

export default Formulario;