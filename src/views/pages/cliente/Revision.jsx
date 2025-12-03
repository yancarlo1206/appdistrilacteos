import React, { useContext, useEffect, useState } from "react";
import ClienteContext from "../../../context/ClienteContext";
import Header from "components/Headers/Header.js";
import ListGeneric from "../../../components/List/Index.js"
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FormGroup, Label, Input } from "reactstrap";

function List({ tab }) {

    const {
        db: data, setDetail, setToDetail, setToUpdate, setViewModal, setModule
    } = useContext(ClienteContext);

    const [filter, setFilter] = useState("");

    const filteredData = data.filter(item =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(filter.toLowerCase())
    );

    const columns = [
        { name: "ID", selector: row => row.id, sortable: true, width: "100px" },
        { name: "Nombre", selector: row => row.nombre, sortable: true },
        { name: "Documento", selector: row => row.documento, sortable: true },
        { name: "Telefono", selector: row => row.telefono, sortable: true },
        { name: "Estado", selector: row => row.clienteEstado.descripcion, sortable: true },
        {
            name: "Acciones", width: "200px", cell: row => (
                <>
                    <Link className='btn btn-success btn-sm'
                        color="success"
                        to={"/admin/cliente/detail/" + row.id}
                    >
                        Detallar
                    </Link>
                </>
            )
        }
    ];

    useEffect(() => {
        setDetail({});
        setToUpdate(0);
    }, []);

    return (
        <>
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="">
                                <div className="align-items-center row">
                                    <div className="col-11">
                                        <h3 className="mb-0">Clientes en Revision</h3>
                                        <p className="text-sm mb-0">
                                            Listado de clientes registrados en el sistema
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
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default List;