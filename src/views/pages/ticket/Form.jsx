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
                                                    <Input
                                                        className="form-control"
                                                        id="input-prioridad"
                                                        type="select"
                                                        name="prioridad"
                                                        value={form.prioridad}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        invalid={errors.prioridad !== ""}
                                                    >
                                                        <option value="" hidden></option>
                                                        {prioridades.map(item => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.text}
                                                            </option>
                                                        ))};
                                                    </Input>
                                                    <div className="invalid-feedback">
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
                                                    <Input
                                                        className="form-control"
                                                        id="input-tipo"
                                                        type="select"
                                                        name="tipo"
                                                        value={form.tipo}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        invalid={errors.tipo !== ""}
                                                    >
                                                        <option value="" hidden></option>
                                                        {tipoTickets.map(item => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.text}
                                                            </option>
                                                        ))};
                                                    </Input>
                                                    <div className="invalid-feedback">
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
                                                    <Input
                                                        className="form-control"
                                                        id="input-estado"
                                                        type="select"
                                                        name="estado"
                                                        value={form.estado}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        invalid={errors.estado !== ""}
                                                    >
                                                        <option value="" hidden></option>
                                                        {estadoTickets.map(item => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.text}
                                                            </option>
                                                        ))};
                                                    </Input>
                                                    <div className="invalid-feedback">
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
