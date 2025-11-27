import React, { useContext, useEffect, useState } from "react";
import TicketContext from "../../../context/TicketContext";
import Header from "components/Headers/Header.js";
import ListGeneric from "../../../components/List/Index.js"
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FormGroup, Label, Input, Button } from "reactstrap";
import ReactBSAlert from "react-bootstrap-sweetalert";

function List({ tab }) {

    const {
        db: data, setDetail, setToDetail, setToUpdate, setViewModal, setModule, deleteData, prioridades, tipoTickets, estadoTickets
    } = useContext(TicketContext);

    const [filter, setFilter] = useState("");

    const [state, setState] = useState({});
    const [idDelete, setIdDelete] = useState();

    const filteredData = data.filter(item =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(filter.toLowerCase())
    );

    const columns = [
        { name: "ID", selector: row => row.id, sortable: true, width: "100px" },
        { name: "Observacion", selector: row => row.observacion, sortable: true },
        { name: "Prioridad", selector: row => row.prioridad.descripcion, sortable: true },
        { name: "Tipo", selector: row => row.tipo.descripcion, sortable: true },
        { name: "Estado", selector: row => row.estado.descripcion, sortable: true },
        {
            name: "Acciones", width: "200px", cell: row => (
                <>
                    <Link className='btn btn-success btn-sm'
                        color="success"
                        to={"/admin/ticket/detail/" + row.id}
                    >
                        Detallar
                    </Link>
                    <Button
                        className='btn btn-danger btn-sm'
                        onClick={e => handleDelete(e, row.id)}
                    >
                        Eliminar
                    </Button>
                </>
            )
        }
    ];

    const confirmAlert = (id) => {
        setState({
            alert: (
                <ReactBSAlert
                    warning
                    style={{ display: "block" }}
                    title="¿Estás seguro?"
                    onCancel={() => hideAlert()}
                    onConfirm={() => { setIdDelete(id); hideAlert(); }}
                    showCancel
                    confirmBtnBsStyle="primary"
                    confirmBtnText="Si, Eliminarlo!"
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
        setDetail({});
        setToUpdate(0);
    }, []);

    useEffect(() => {
        if (idDelete) {
            deleteData(idDelete);
        }
    }, [idDelete]);

    const handleDelete = (e, id) => {
        e.preventDefault();
        confirmAlert(id);
    }

    return (
        <>
            {state.alert}
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="">
                                <div className="align-items-center row">
                                    <div className="col-11">
                                        <h3 className="mb-0">Tickets</h3>
                                        <p className="text-sm mb-0">
                                            Listado de tickets registrados en el sistema
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label for="buscar">Buscar</Label>
                                    <Input
                                        id="buscar"
                                        type="text"
                                        placeholder="Buscar..."
                                        value={filter}
                                        onChange={e => setFilter(e.target.value)}
                                    />
                                </FormGroup>
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    pagination
                                    highlightOnHover
                                />
                                <div className="m-3">
                                    <Link
                                        className='btn btn-success'
                                        color="success"
                                        to={"add"}
                                    >
                                        Agregar Ticket
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default List;