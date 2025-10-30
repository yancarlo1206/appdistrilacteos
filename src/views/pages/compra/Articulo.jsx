import React, { useContext, useEffect, useState } from 'react';
import CompraContext from 'context/CompraContext';
import { useForm } from "../../../hooks/useForm";
import ArticuloCompraFormValidate from "../../../services/ArticuloCompraForm";
import { Button, Col, Form, FormGroup, Input, Modal, Row, InputGroup, InputGroupAddon, InputGroupText  } from "reactstrap";

const initialForm = {
    articulo: "",
    cantidad: "",
    valor_unitario: "",
    valor: "",
};
  
function Detail() {

    const { 
        module, addAsset, addAssetSingle, verModalArticulo, setVerModalArticulo, 
        articulos, articulosCompra, addArticuloCompra } = useContext(CompraContext);

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
    } = useForm(initialForm, ArticuloCompraFormValidate.validationsForm);

    useEffect(() => {
        setForm(initialForm);
        setErrors(initialForm);
    },[]);

    const handleSave = (e) => {
        e.preventDefault();
        let valid = handleSubmit(e);
        if(valid){
            addArticuloCompra(form);
            setVerModalArticulo(false);
            reset();
        }
    }

    const closeModal = (e) => {
        e.preventDefault();
        setVerModalArticulo(false);
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
            isOpen={verModalArticulo}
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
                            <Col lg="12">
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-articulo"
                                    >
                                    Articulo <span className="text-danger">*</span>
                                    </label>
                                    <Input 
                                        className="form-control"
                                        id="input-articulo"
                                        type="select"
                                        name="articulo"
                                        value={form.articulo}
                                        onChange={handleChangeCombo}
                                        onBlur={handleBlurCombo}
                                        invalid={errors.articulo !== ""}
                                        >
                                        <option value="" hidden></option>
                                        {articulos.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.text}
                                            </option>
                                        ))};
                                    </Input>
                                    <div className="invalid-feedback">
                                        {errors.articulo}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="4">
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-cantidad"
                                    >
                                    Cantidad <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                    className="form-control"
                                    id="input-cantidad"
                                    placeholder=""
                                    type="text"
                                    name="cantidad"
                                    required="required"
                                    maxLength="10"
                                    invalid={errors.cantidad !== ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue=""
                                    />
                                    <div className="invalid-feedback">
                                        {errors.cantidad}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col lg="4">
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-valor_unitario"
                                    >
                                    Valor Unitario <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                    className="form-control"
                                    id="input-valor_unitario"
                                    placeholder=""
                                    type="text"
                                    name="valor_unitario"
                                    required="required"
                                    maxLength="10"
                                    invalid={errors.valor_unitario !== ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue=""
                                    />
                                    <div className="invalid-feedback">
                                        {errors.valor_unitario}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col lg="4">
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