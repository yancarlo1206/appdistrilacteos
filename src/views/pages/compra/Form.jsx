import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, Table, UncontrolledTooltip, Alert } from "reactstrap";
  
import { Link, useParams } from "react-router-dom";
import CompraContext from "context/CompraContext";
import CompraFormValidate from "../../../services/CompraForm";
import { useForm } from "hooks/useForm";
import Header from "components/Headers/Header";

import ModalArticulo from "./Articulo";

import ReactBSAlert from "react-bootstrap-sweetalert";

const initialForm = {
    valor: "",
    proveedor: "",
};

const Formulario = ( ) => {

    const { 
        detail:data, updateData, saveData, setModule, module, setToDetail,setDetail, 
        setToUpdate, proveedores, articulosCompra, setArticulosCompra, setVerModalArticulo, 
        verModalArticulo, deleteArticuloCompra, addArticuloCompra
    } = useContext(CompraContext);

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
    } = useForm(initialForm, CompraFormValidate.validationsForm);

    const { id } = useParams();

      const[state, setState] = useState({});
      const[idDelete, setIdDelete] = useState();

    useEffect(() => {
        if(id){
            setToDetail(id);
            setToUpdate(id);
            setModule("actualizar");
        }else{
            setModule("agregar");
        }
    },[]);

    useEffect(() => {
        setForm(data);
        setErrors(initialForm);
    },[data]);

    const confirmAlert = (id) => {
        setState({
            alert: (
            <ReactBSAlert
                warning
                style={{ display: "block"}}
                title="Estas seguro?"
                onCancel={() => hideAlert()}
                onConfirm={() => {setIdDelete(id); hideAlert();}}
                showCancel
                confirmBtnBsStyle="primary"
                confirmBtnText="Si, eliminarlo!"
                cancelBtnBsStyle="danger"
                cancelBtnText="Cancelar"
                btnSize=""
            >
                No podrás revertir esto!
            </ReactBSAlert>
            )
        });
        };

    const hideAlert = () => {
        setState({
            alert: null
        });
    };

    useEffect(() => {
        if(idDelete){
            deleteArticuloCompra(idDelete);
        }
    },[idDelete]);

    const loadModalArticulo = (e) => {
        setVerModalArticulo(true);
    }
    
    const handleUpdate = (e) => {
        e.preventDefault();
        let valid = handleSubmit(e);
        if(valid){
            updateData(form);
        }
    }

    const handleSave = (e) => {
        e.preventDefault();
        let valid = handleSubmit(e);
        if(valid){
            saveData(form);
        }
    }

    return (
      <>
        {state.alert}
        <Header />
            <Container className="mt--7" fluid>
              <Row>
                <div className="col">
                  <Card className="shadow">
                    <CardHeader className="">
                      <div className="align-items-center row">
                        <div className="col-11">
                          <h3 className="mb-0">{module?.toUpperCase()} COMPRA</h3>
                          <p className="text-sm mb-0">
                            Formulario de gestion de compras
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
                                        htmlFor="input-proveedor"
                                        >
                                        Proveedor <span className="text-danger">*</span>
                                        </label>
                                        <Input 
                                            className="form-control"
                                            id="input-proveedor"
                                            type="select"
                                            name="proveedor"
                                            value={form.proveedor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={errors.proveedor !== ""}
                                            >
                                            <option value="" hidden></option>
                                            {proveedores.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.text}
                                                </option>
                                            ))};
                                        </Input>
                                        <div className="invalid-feedback">
                                            {errors.proveedor}
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col lg="12">
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
                                        invalid={errors.valor !== ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue={data.valor}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.valor}
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Card>
                                <CardHeader className="border-0">
                                    <Row>
                                        <Col xs="6">
                                            <h3 className="mb-0">Articulos</h3>
                                        </Col>
                                        <Col className="text-right" xs="6">
                                            <a 
                                                className="btn-round btn-icon btn btn-primary btn-sm"
                                                onClick={e => loadModalArticulo(e)} >
                                                <span className="btn-inner--icon mr-1">
                                                    <i className="ni ni-fat-add"></i>
                                                </span>
                                                <span className="">Agregar Articulo</span>
                                            </a>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <Table className="align-items-center table-flush table-invoices" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th>Articulo</th>
                                        <th>Cantidad</th>
                                        <th>Valor Unitario</th>
                                        <th>Valor</th>
                                        <th>Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {articulosCompra.length > 0 ? (
                                            articulosCompra.map((item,index) => (
                                                <tr key={index}>
                                                    <td>{item.articulo?.nombre || item.articulo_text}</td>
                                                    <td>{item.cantidad}</td>
                                                    <td>$ {item.valor_unitario}</td>
                                                    <td>$ {item.valor}</td>
                                                    <td className="table-actions">
                                                    {module == "actualizar" ? (
                                                    <>
                                                    <a 
                                                        className="btn-round btn-icon btn btn-danger btn-sm"
                                                        onClick={e => confirmAlert(item.articulo)} 
                                                        id="tooltip601065233"
                                                        >
                                                        <span className="">Borrar</span>
                                                    </a>
                                                    </>
                                                    ):(
                                                    <>
                                                    <a 
                                                        className="btn-round btn-icon btn btn-danger btn-sm"
                                                        onClick={e => confirmAlert(item.articulo.id)} 
                                                        id="tooltip601065233"
                                                        >
                                                        <span className="">Borrar</span>
                                                    </a>
                                                    </>
                                                    )}
                                                    <UncontrolledTooltip delay={0} target="tooltip601065233">
                                                        Borrar Articulo
                                                    </UncontrolledTooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        ):(
                                            <tr>
                                                <td>
                                            <Alert color="secondary" className="m-2">
                                                No hay informacion para mostrar en esta seccion de <strong>Articulos !</strong>
                                            </Alert>
                                            </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card>
                            <Row className="col justify-content-end mt-4">
                                {module == "actualizar" ? (
                                    <Button
                                        color="primary"
                                        href=""
                                        onClick={handleUpdate}
                                        >
                                        Actualizar
                                    </Button>
                                ) : (
                                    <Button
                                        color="primary"
                                        href=""
                                        onClick={handleSave}
                                        >
                                        Guardar 
                                    </Button>
                                )}
                                <Link
                                    className="btn btn-danger"
                                    color="default"
                                    to={"/admin/compra"}
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
        <ModalArticulo />
      </>
    );
  };
  
  export default Formulario;