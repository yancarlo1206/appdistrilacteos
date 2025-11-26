// /*!

// =========================================================
// * Argon Dashboard React - v1.2.4
// =========================================================

// * Product Page: https://www.creative-tim.com/product/argon-dashboard-react
// * Copyright 2024 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */
// import { useState, useContext } from "react";
// // node.js library that concatenates classes (strings)
// import classnames from "classnames";
// // javascipt plugin for creating charts
// import Chart from "chart.js";
// // react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
// // reactstrap components
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   NavItem,
//   NavLink,
//   Nav,
//   Progress,
//   Table,
//   Container,
//   Row,
//   Col,
// } from "reactstrap";
// import { Link } from "react-router-dom";

// // core components
// import {
//   chartOptions,
//   parseOptions,
//   chartExample1,
//   chartExample2,
// } from "variables/charts.js";

// import Header from "components/Headers/Header.js";
// import ClienteContext, { ClienteProvider } from "context/ClienteContext";

// const Index = (props) => {
//   const DashboardContent = () => {
//     const [activeNav, setActiveNav] = useState(1);
//     const [chartExample1Data, setChartExample1Data] = useState("data1");

//     if (window.Chart) {
//       parseOptions(Chart, chartOptions());
//     }

//     const toggleNavs = (e, index) => {
//       e.preventDefault();
//       setActiveNav(index);
//       setChartExample1Data("data" + index);
//     };

//     const { db } = useContext(ClienteContext);

//     return (
//       <>
//         {/* <Header /> */}

//         {/* Page content */}
//         <Container className="mt--7" fluid>
//           <Row>
//             {/*
//             ============================
//             🔒 COMENTADO: SALES VALUE Y TOTAL ORDERS
//             ============================
//             <Col className="mb-5 mb-xl-0" xl="8">
//               <Card className="bg-gradient-default shadow">
//                 <CardHeader className="bg-transparent">
//                   <Row className="align-items-center">
//                     <div className="col">
//                       <h6 className="text-uppercase text-light ls-1 mb-1">
//                         Overview
//                       </h6>
//                       <h2 className="text-white mb-0">Sales value</h2>
//                     </div>
//                     <div className="col">
//                       <Nav className="justify-content-end" pills>
//                         <NavItem>
//                           <NavLink
//                             className={classnames("py-2 px-3", {
//                               active: activeNav === 1,
//                             })}
//                             href="#pablo"
//                             onClick={(e) => toggleNavs(e, 1)}
//                           >
//                             <span className="d-none d-md-block">Month</span>
//                             <span className="d-md-none">M</span>
//                           </NavLink>
//                         </NavItem>
//                         <NavItem>
//                           <NavLink
//                             className={classnames("py-2 px-3", {
//                               active: activeNav === 2,
//                             })}
//                             data-toggle="tab"
//                             href="#pablo"
//                             onClick={(e) => toggleNavs(e, 2)}
//                           >
//                             <span className="d-none d-md-block">Week</span>
//                             <span className="d-md-none">W</span>
//                           </NavLink>
//                         </NavItem>
//                       </Nav>
//                     </div>
//                   </Row>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="chart">
//                     <Line
//                       data={chartExample1[chartExample1Data]}
//                       options={chartExample1.options}
//                       getDatasetAtEvent={(e) => console.log(e)}
//                     />
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>

//             <Col xl="4">
//               <Card className="shadow">
//                 <CardHeader className="bg-transparent">
//                   <Row className="align-items-center">
//                     <div className="col">
//                       <h6 className="text-uppercase text-muted ls-1 mb-1">
//                         Performance
//                       </h6>
//                       <h2 className="mb-0">Total orders</h2>
//                     </div>
//                   </Row>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="chart">
//                     <Bar data={chartExample2.data} options={chartExample2.options} />
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//             */}
//           </Row>

//           <Row className="mt-5">
//             <Col className="mb-5 mb-xl-0" xl="8">
//               <Card className="shadow">
//                 <CardHeader className="border-0">
//                   <Row className="align-items-center">
//                     <div className="col">
//                       <h3 className="mb-0">Clientes Recientes</h3>
//                     </div>
//                     <div className="col text-right">
//                       <NavLink
//                         to="/admin/cliente"
//                         tag={Link}
//                         className="btn btn-sm"
//                         style={{ background:"linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
//                     border: "none",
//                     borderRadius: "20px",
//                     color: "#fff",
//                     fontWeight: "600",
//                     padding: "12px 20px",
//                     boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
//                     transition: "all 0.3s ease",}}
//                       >
//                         Ver todos
//                       </NavLink>
//                     </div>
//                   </Row>
//                 </CardHeader>
//                 <Table className="align-items-center table-flush" responsive>
//                   <thead className="thead-light">
//                     <tr>
//                       <th scope="col">Nombre</th>
//                       <th scope="col">Documento</th>
//                       <th scope="col">Teléfono</th>
//                       <th scope="col">Estado</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {db && db.length > 0 ? (
//                       db.slice(0, 5).map((cliente) => (
//                         <tr key={cliente.id}>
//                           <th scope="row">{cliente.nombre}</th>
//                           <td>
//                             {cliente["Tipo documento"].tipo_documento} -{" "}
//                             {cliente.numero_documento}
//                           </td>
//                           <td>{cliente.telefono}</td>
//                           <td>{cliente.estado.descripcion}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No hay clientes disponibles
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </>
//     );
//   };

//   return (
//     <ClienteProvider>
//       <DashboardContent />
//     </ClienteProvider>
//   );
// };

// export default Index;
// src/views/Index.jsx
// src/views/Index.jsx
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  NavLink,
  CardBody
} from "reactstrap";
import { Link } from "react-router-dom";
import Header from "components/Headers/Header.js";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js";
import { chartOptions, parseOptions } from "variables/charts.js";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/";

const Index = () => {

  // 🔹 HABILITAR ESTILOS ORIGINALES ARGON
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================================
  //        DATOS PRUEBA TICKETS
  // ================================
  const datosPrueba = [
    {
      id: 101,
      usuario: "Juan Pérez",
      fecha: "2025-02-15",
      tipo: { descripcion: "Producto vencido" },
      prioridad: { descripcion: "Urgente" },
      tickets_estado: { descripcion: "En revisión" },
      asignado: { id: 3, nombre: "Laura Martínez" }
    },

    {
      id: 102,
      usuario: "Laura Martínez",
      fecha: "2025-02-16",
      tipo: { descripcion: "Refrigeración defectuosa" },
      prioridad: { descripcion: "Alta" },
      tickets_estado: { descripcion: "En proceso" },
      asignado: { id: 4, nombre: "Carlos Gómez" }
    },

    {
      id: 103,
      usuario: "Carlos Gómez",
      fecha: "2025-02-17",
      tipo: { descripcion: "Producto en mal estado" },
      prioridad: { descripcion: "Urgente" },
      tickets_estado: { descripcion: "En proceso" },
      asignado: { id: 5, nombre: "Sandra Ruiz" }
    },

    {
      id: 104,
      usuario: "Sandra Ruiz",
      fecha: "2025-02-17",
      tipo: { descripcion: "Falta de inventario" },
      prioridad: { descripcion: "Media" },
      tickets_estado: { descripcion: "Completado" },
      asignado: { id: 2, nombre: "Juan Pérez" }
    }
  ];

  // ================================
  //     CALCULAR ESTADISTICAS
  // ================================
  const calcularEstadisticas = () => {
    const estados = {
      "En proceso": 0,
      "En revisión": 0,
      Pendiente: 0,
      Completado: 0,
      Cancelado: 0,
      Activo: 0,
    };

    datosPrueba.forEach((t) => {
      const est = t.tickets_estado.descripcion;
      if (estados[est] !== undefined) {
        estados[est]++;
      }
    });

    return estados;
  };

  const estadisticas = calcularEstadisticas();

  // ================================
  //        GRAFICA ARGON
  // ================================
  const dataChart = {
    labels: [
      "En proceso",
      "En revisión",
      "Pendiente",
      "Completado",
      "Cancelado",
      "Activo",
    ],
    datasets: [
      {
        label: "Tickets por Estado",
        data: [
          estadisticas["En proceso"],
          estadisticas["En revisión"],
          estadisticas["Pendiente"],
          estadisticas["Completado"],
          estadisticas["Cancelado"],
          estadisticas["Activo"],
        ],
        backgroundColor: "#5e72e4",
        borderColor: "#5e72e4",
        pointBackgroundColor: "#5e72e4",
        fill: true,
      },
    ],
  };

  const optionsChart = {
    maintainAspectRatio: false,
    legend: { display: false },
    tooltips: {
      backgroundColor: "#f5f5f5",
      bodyFontColor: "#666",
      titleFontColor: "#333",
      displayColors: false,
      borderColor: "#ddd",
      borderWidth: 1,
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#8898aa",
            beginAtZero: true,
            padding: 10,
          },
          gridLines: {
            color: "rgba(136, 152, 170, 0.1)",
            zeroLineColor: "rgba(136, 152, 170, 0.1)",
          },
        },
      ],
      xAxes: [
        {
          ticks: { fontColor: "#8898aa", padding: 10 },
          gridLines: { display: false },
        },
      ],
    },
  };

  // ================================
  //   CLIENTES ACEPTADOS API
  // ================================
  const fetchClientesAceptados = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}cliente`);
      const data = await res.json();

      if (res.ok && data.data) {
        const aceptados = data.data
          .filter((c) => c.cliente_estado?.descripcion?.toLowerCase() === "aceptado")
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);

        setClientes(aceptados);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientesAceptados();
  }, []);

  // ================================
  //            UI
  // ================================
  return (
    <>
      <Container className="mt--7" fluid>

        {/* ===== GRAFICA ===== */}
        <Row>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Estadísticas de Tickets</h3>
                <p className="text-sm text-muted mb-0">Estados actuales del sistema</p>
              </CardHeader>

              <CardBody>
                <div className="chart">
                  <Bar data={dataChart} options={optionsChart} />
                </div>
              </CardBody>
            </Card>
          </Col>
        

        {/* ===== CLIENTES ===== */}
        
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Últimos Clientes Aceptados</h3>
                  </div>

                  <div className="col text-right">
                    <NavLink
                      to="/admin/cliente"
                      tag={Link}
                      className="btn btn-sm"
                      style={{
                        background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                        border: "none",
                        borderRadius: "20px",
                        color: "#fff",
                        fontWeight: "600",
                        padding: "12px 20px",
                      }}
                    >
                      Ver todos
                    </NavLink>
                  </div>
                </Row>
              </CardHeader>

              <Table responsive className="table-flush">
                <thead className="thead-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center">Cargando...</td></tr>
                  ) : clientes.length > 0 ? (
                    clientes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.nombre}</td>
                        <td>{c.tipo_documento?.descripcion} - {c.documento}</td>
                        <td>{c.telefono}</td>
                        <td>{c.cliente_estado?.descripcion}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center">No hay clientes aceptados</td></tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
