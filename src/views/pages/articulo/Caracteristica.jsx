import React, { useContext, useEffect, useState } from 'react';
import ArticuloContext from 'context/ArticuloContext';
import { useForm } from "../../../hooks/useForm";
import ArticuloCaracteristicaFormValidate from "../../../services/ArticuloCaracteristicaForm";
import { Button, Col, Form, FormGroup, Input, Modal, Row, InputGroup, InputGroupAddon, InputGroupText  } from "reactstrap";

const initialForm = {
    caracteristica: "",
    valor: "",
};
  
function Detail() {

    const { 
        module, addCaracteristica, verModalCaracteristica, setVerModalCaracteristica, 
        caracteristicas } = useContext(ArticuloContext);

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
        handleChangeCombo,
        handleChecked,
        handleBlur,
        handleBlurCombo,
        handleSubmit,
    } = useForm(initialForm, ArticuloCaracteristicaFormValidate.validationsForm);

    useEffect(() => {
        setForm(initialForm);
        setErrors(initialForm);
    },[]);

    const handleSave = (e) => {
        e.preventDefault();
        let valid = handleSubmit(e);
        if(valid){
            addCaracteristica(form);
            setVerModalCaracteristica(false);
            reset();
        }
    }

    const closeModal = (e) => {
        e.preventDefault();
        setVerModalCaracteristica(false);
        reset();
    }

    const reset = () => {
        setTimeout(function(){ 
            setErrors(initialForm);
            setForm({});
            setValidateInit(false);
        }, 500);
    }
    
    return(
        <>
        <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={verModalCaracteristica}
            toggle={closeModal}
        >
            <div className="modal-header bg-gradient-hensall">
                <h6 className="modal-title text-white" id="modal-title-default">
                    Add Detail
                </h6>
            </div>
            <div className="modal-body">
                <Form>
                    <div className="pl-lg-4">
                        <Row>
                            <Col lg="6">
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-caracteristica"
                                    >
                                    Caracteristica <span className="text-danger">*</span>
                                    </label>
                                    <Input 
                                        className="form-control"
                                        id="input-caracteristica"
                                        type="select"
                                        name="caracteristica"
                                        value={form.caracteristica}
                                        onChange={handleChangeCombo}
                                        onBlur={handleBlurCombo}
                                        invalid={errors.caracteristica !== ""}
                                        >
                                        <option value="" hidden></option>
                                        {caracteristicas.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.text}
                                            </option>
                                        ))};
                                    </Input>
                                    <div className="invalid-feedback">
                                        {errors.caracteristica}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-valor"
                                    >
                                    Valor <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                    className="form-control"
                                    id="input-valor"
                                    placeholder=""
                                    type="text"
                                    name="valor"
                                    required="required"
                                    maxLength="10"
                                    invalid={errors.valor !== ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue=""
                                    />
                                    <div className="invalid-feedback">
                                        {errors.valor}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
            <div className="modal-footer">
                <Row className="col justify-content-end">
                    <Button
                        color="primary"
                        href=""
                        onClick={handleSave}
                    >
                        Agregar
                    </Button>
                    <Button
                        className="btn btn-danger"
                        color="danger"
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                </Row>
            </div>
        </Modal>
        </>
    );

}

export default Detail;