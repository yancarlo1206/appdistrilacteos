import React, { useContext, useEffect, useState, useRef } from "react";
import Select from "react-select";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from "reactstrap";

import { Link, useParams } from "react-router-dom";
import RegistroContext from "context/RegistroContext";
import RegistroFormValidate from "../../../services/RegistroForm";
import { useForm } from "hooks/useForm";

const initialForm = {
    tipoDocumento: "",
    documento: "",
    nombre: "",
    telefono: "",
    direccion: "",
    correo: "",
    ciudad: "",
    observacion: "",
};

const Formulario = () => {

    const {
        detail: data, saveData, tipoDocumentos, ciudades,
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
    } = useForm(initialForm, RegistroFormValidate.validationsForm);

    useEffect(() => {
        setForm(data);
        setErrors(initialForm);
    }, [data]);

    const handleSave = (e) => {
        e.preventDefault();
        let valid = handleSubmit(e);
        if (valid) {
            saveData(form);
        }
    }

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
            borderColor: state.isFocused ? "#5e72e4" : "#cad1d7",
            boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(94, 114, 228, 0.25)" : null,
            "&:hover": {
                borderColor: "#5e72e4"
            }
        })
    };

    // Helper to find the current selected option object
    const getSelectedOption = (options, value) => {
        return options.find(option => option.value === value) || null;
    };

    const optionsTipoDocumentos = tipoDocumentos.map(i => ({ value: i.id, label: i.text }));
    const optionsCiudades = ciudades.map(i => ({ value: i.id, label: i.text }));

    return (
        <>
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="">
                                <div className="align-items-center row">
                                    <div className="col-11">
                                        <h3 className="mb-0">Registro de Cliente</h3>
                                        <p className="text-sm mb-0">
                                            Formulario de registro de nuevos clientes en el sistema
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
                                                        type="text"
                                                        name="telefono"
                                                        required="required"
                                                        invalid={errors.telefono !== ""}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={data.telefono}
                                                        autoComplete="off"
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
                                            <Button
                                                color="success"
                                                href=""
                                                onClick={handleSave}
                                            >
                                                Guardar
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
            </Container>
        </>
    );
};

export default Formulario;