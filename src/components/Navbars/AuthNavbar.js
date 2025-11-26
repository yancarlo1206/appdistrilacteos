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
import { Link, useLocation } from "react-router-dom";
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AdminNavbar = () => {
  const location = useLocation(); // 👈 Saber en qué ruta estamos
  const isLoginPage = location.pathname === "/auth/login"; // 👈 Verifica si estás en Login

  return (
    <>
      {/* <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4"> */}
          {/* <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/argon-react-white.png")}
            />
          </NavbarBrand> */}

          {/* <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>

          <UncontrolledCollapse navbar toggler="#navbar-collapse-main" */}
{/* style={{ position: "fixed", 
    // top: 0,
    // right: 0,
    // width: "50vw", // 50% del ancho de la pantalla
    // height: "100vh", // 100% del alto de la pantalla
    // background: "rgba(128, 128, 128, 0.7)", // gris translúcido 70%
    // borderBottomRightRadius: "50px", // borde inferior derecho redondeado
    // zIndex: 1050,
    // padding: "1rem",
    // overflowY: "auto",
    // transition: "all 0.4s ease"}}>
    >
            {/* <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                  <h3>MENU</h3> */}
                    {/* <img
                      alt="..."
                      src={require("../../assets/img/brand/argon-react.png")}
                    /> */}
                  {/* </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div> */}

            {/* Boton que cambia dependiendo de donde este. */}
            {/* <Nav className="ml-auto d-flex align-items-center" navbar>
              <NavItem>
                {isLoginPage ? (
                  <NavLink
                    to="/auth/registro-cliente"
                    tag={Link}
                    className="btn btn-success btn-sm"
                    style={{
                    background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                    border: "none",
                    borderRadius: "20px",
                    color: "#fff",
                    fontWeight: "600",
                    padding: "12px 20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  >
                    Registrarse
                  </NavLink>
                ) : (
                  <NavLink
                    to="/auth/login"
                    tag={Link}
                    className="btn btn-success btn-sm"
                    style={{
                    background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
                    border: "none",
                    borderRadius: "20px",
                    color: "#fff",
                    fontWeight: "600",
                    padding: "12px 20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  >
                    Iniciar sesión
                  </NavLink>
                )}
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar> */}
    </>
  );
};

export default AdminNavbar;
