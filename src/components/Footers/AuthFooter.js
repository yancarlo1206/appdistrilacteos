/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/

// reactstrap components
/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

*/

import React from "react";
import { Container, Row, Col } from "reactstrap";

const AuthFooter = () => {
  const puntosDeVenta = [
    {
      nombre: "Punto Caobos",
      ubicacion: "Calle 16 # 1E - 64, Cúcuta",
      barrio: "Caobos",
      celular: "3208360832",
    },
    {
      nombre: "Punto Zulia",
      ubicacion: "Lote 3 EDS Plazoleta Vereda Las Piedras, El Zulia",
      barrio: "El Zulia",
      celular: "3184189775",
    },
    {
      nombre: "Punto Cenabastos",
      ubicacion: "Cenabastos Local 4 EDS Petromil, Cúcuta",
      barrio: "Cenabastos",
      celular: "3016497817",
    },
  ];

  return (
    <footer className="py-5" style={{ backgroundColor: "#EBEBEB" }}>
      <Container>
        <Row className="align-items-center justify-content-center text-center mb-4">
          <Col lg="6" md="6">
            <h3 style={{ color: "#58AB01", fontWeight: "bold" , fontSize: "20px"}}>Nuestros Puntos de Venta</h3>
          </Col>
        </Row>
        {/* Fila de puntos de venta */}
        <Row className="justify-content-center text-center mb-4">
         
          {puntosDeVenta.map((punto, index) => (
            <Col md="4" sm="12" key={index} className="mb-3">
              <h5 style={{ color: "#58AB01", fontWeight: "bold", fontSize: "17px"}}>{punto.nombre}</h5>
              <p className="text-muted mb-1">
                <strong style={{fontWeight: "800"}}>Ubicación:</strong> {punto.ubicacion}
              </p>
              <p className="text-muted mb-1">
                <strong style={{fontWeight: "800"}}>Barrio:</strong> {punto.barrio}
              </p>
              <p className="text-muted mb-0">
                <strong style={{fontWeight: "800"}}>Celular:</strong> {punto.celular}
              </p>
            </Col>
          ))}
        </Row>

        {/* Fila inferior (copyright) */}
        <Row className="align-items-center justify-content-center text-center">
          <Col>
            <div className="text-muted small">
              © {new Date().getFullYear()} Distribuidor Autorizado Colanta.  
              Todos los derechos reservados.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AuthFooter;
