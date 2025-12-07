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
import TicketContext from "context/TicketContext";
import TicketFormValidate from "../../../services/TicketForm";
import { useForm } from "hooks/useForm";
import Header from "components/Headers/Header";

const initialForm = {
    tipo: "",
    estado: "",
    prioridad: "",
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
        prioridades,
        tipoTickets,
        estadoTickets,
    } = useContext(TicketContext);

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
    } = useForm(initialForm, TicketFormValidate.validationsForm);

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

    const optionsPrioridades = prioridades.map(i => ({ value: i.id, label: i.text }));
    const optionsTipoTickets = tipoTickets.map(i => ({ value: i.id, label: i.text }));
    const optionsEstadoTickets = estadoTickets.map(i => ({ value: i.id, label: i.text }));

    return (
        <>
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="">
                                <div className="align-items-center row">
                                    <div className="col-11">
                                        <h3 className="mb-0">{module?.toUpperCase()} TICKET</h3>
                                        <p className="text-sm mb-0">
                                            Formulario de gestion de tickets
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Form autoComplete="off">
                                    <div className="pl-lg-4">
                                        <Row>
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
                                                        type="textarea"
                                                        rows="3"
                                                        name="observacion"
                                                        required="required"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        invalid={errors.observacion !== ""}
                                                        defaultValue={data.observacion}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {errors.observacion}
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-prioridad"
                                                    >
                                                        Prioridad <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        id="input-prioridad"
                                                        name="prioridad"
                                                        options={optionsPrioridades}
                                                        value={getSelectedOption(optionsPrioridades, form.prioridad)}
                                                        onChange={handleSelectChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Seleccione..."
                                                        styles={customStyles}
                                                        className={errors.prioridad ? "is-invalid" : ""}
                                                    />
                                                    <div className="invalid-feedback" style={{ display: errors.prioridad ? "block" : "none" }}>
                                                        {errors.prioridad}
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-tipo"
                                                    >
                                                        Tipo <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        id="input-tipo"
                                                        name="tipo"
                                                        options={optionsTipoTickets}
                                                        value={getSelectedOption(optionsTipoTickets, form.tipo)}
                                                        onChange={handleSelectChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Seleccione..."
                                                        styles={customStyles}
                                                        className={errors.tipo ? "is-invalid" : ""}
                                                    />
                                                    <div className="invalid-feedback" style={{ display: errors.tipo ? "block" : "none" }}>
                                                        {errors.tipo}
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-estado"
                                                    >
                                                        Estado <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        id="input-estado"
                                                        name="estado"
                                                        options={optionsEstadoTickets}
                                                        value={getSelectedOption(optionsEstadoTickets, form.estado)}
                                                        onChange={handleSelectChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Seleccione..."
                                                        styles={customStyles}
                                                        className={errors.estado ? "is-invalid" : ""}
                                                    />
                                                    <div className="invalid-feedback" style={{ display: errors.estado ? "block" : "none" }}>
                                                        {errors.estado}
                                                    </div>
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
