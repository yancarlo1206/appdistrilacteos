import React, { useContext, useEffect, useState, useRef } from "react";
import { 
    Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, 
    Row, Col, Table, Alert 
} from "reactstrap";
  
import { Link, useParams } from "react-router-dom";
import ArticuloContext from "context/ArticuloContext";
import ArticuloFormValidate from "../../../services/ArticuloForm";
import { useForm } from "hooks/useForm";
import Header from "components/Headers/Header";

import ReactBSAlert from "react-bootstrap-sweetalert";
import ModalCaracteristica from "./Caracteristica";

const initialForm = {
    nombre: "",
    descripcion: "",
    cantidad: "",
    categoria: "",
    estado: "",
};

const Formulario = ( ) => {

    const { 
        detail:data, updateData, saveData, setModule, module, setToDetail,setDetail, 
        setToUpdate, categorias, verModalCaracteristica, setVerModalCaracteristica,
        deleteCaracteristica, addCaracteristica, articuloCaracteristicas,
        caracteristicas
    } = useContext(ArticuloContext);

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
    } = useForm(initialForm, ArticuloFormValidate.validationsForm);

    const { id } = useParams();
    const[state, setState] = useState({});
    const[idDelete, setIdDelete] = useState();

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

    useEffect(() => {
        if(idDelete){
            deleteCaracteristica(idDelete);
        }
    },[idDelete]);
    
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

    const loadModalCaracteristica = (e) => {
        setVerModalCaracteristica(true);
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
                          <h3 className="mb-0">{module?.toUpperCase()} ARTICULO</h3>
                          <p className="text-sm mb-0">
                            Formulario de gestion de articulos
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
                                <Col lg="12">
                                    <FormGroup>
                                        <label
                                        className="form-control-label"
                                        htmlFor="input-descripcion"
                                        >
                                        Descripcion <span className="text-danger">*</span>
                                        </label>
                                        <Input
                                        className="form-control"
                                        id="input-descripcion"
                                        placeholder=""
                                        type="text"
                                        name="descripcion"
                                        required="required"
                                        invalid={errors.descripcion !== ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue={data.descripcion}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.descripcion}
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col lg="12">
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
                                        invalid={errors.cantidad !== ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue={data.cantidad}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.cantidad}
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col lg="12">
                                    <FormGroup>
                                        <label
                                        className="form-control-label"
                                        htmlFor="input-categoria"
                                        >
                                        Categoria <span className="text-danger">*</span>
                                        </label>
                                        <Input 
                                            className="form-control"
                                            id="input-categoria"
                                            type="select"
                                            name="categoria"
                                            value={form.categoria}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={errors.categoria !== ""}
                                            >
                                            <option value="" hidden></option>
                                            {categorias.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.text}
                                                </option>
                                            ))};
                                        </Input>
                                        <div className="invalid-feedback">
                                            {errors.categoria}
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col lg="12">
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
                                        placeholder=""
                                        type="text"
                                        name="estado"
                                        required="required"
                                        invalid={errors.estado !== ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue={data.estado}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.estado}
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {module == "actualizar" ? (
                                <Card>
                                    <CardHeader className="border-0">
                                        <Row>
                                            <Col xs="6">
                                                <h3 className="mb-0">Caracteristicas</h3>
                                            </Col>
                                            <Col className="text-right" xs="6">
                                                <a 
                                                    className="btn-round btn-icon btn btn-primary btn-sm"
                                                    onClick={e => loadModalCaracteristica(e)} >
                                                    <span className="btn-inner--icon mr-1">
                                                        <i className="ni ni-fat-add"></i>
                                                        </span>
                                                        <span className="">Agregar Caracteristica</span>
                                                    </a>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <Table className="align-items-center table-flush table-equipment" responsive>
                                        <thead className="thead-light">
                                        <tr>
                                            <th>Caracteristica</th>
                                            <th>Valor</th>
                                            <th>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {articuloCaracteristicas.length > 0 ? 
                                            articuloCaracteristicas.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.caracteristica.descripcion}</td>
                                                <td>{item.valor}</td>
                                                <td className="table-actions" style={{width: "20px"}}>
                                                    <Button
                                                        className='btn btn-danger btn-sm'
                                                        onClick={e => confirmAlert(item.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                            )):
                                            (
                                                <tr>
                                                    <td>
                                                <Alert color="secondary" className="m-2">
                                                    There is no information to display in this section of <strong>Caracteristicas !</strong>
                                                </Alert>
                                                </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </Table>
                                </Card>
                            ):("")}
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
                                    to={"/admin/articulo"}
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
        <ModalCaracteristica />
      </>
    );
  };
  
  export default Formulario;