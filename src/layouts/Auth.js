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
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container, Row, Col, CardBody, CardTitle } from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import { LoginProvider } from "context/LoginContext";
import { NotificationProvider } from "context/NotificationContext";
import { LoadingProvider } from "context/LoadingContext";

import { useAuth } from "../hooks/useAuth";

import routes from "routes.js";

const Auth = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const { isAuthenticated } = useAuth();

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div
        className="main-content"
        ref={mainContent}
        style={{ background: "#EBEBEB", top: 0 }}
      >
        {/* <AuthNavbar /> */}
        <div
          className="header py-7 py-lg-8"
          style={{
            background: "linear-gradient(90deg, #84c63b 0%, #58ab01 100%)",
          }}
        >
          <Container>
            <div className="header-body text-center mb-7">

               
                <h1
                  className="text-white fw-bold mb-4"
                  style={{
                    fontSize: "2rem",
                    letterSpacing: "1px",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Bienvenido
                </h1>
                <Row className="justify-content-center align-items-center">
                  <Col
                    lg="3"
                    md="4"
                    sm="6"
                    xs="6"
                    className="d-flex justify-content-center mb-4 mb-lg-0"
                    style={{ gap: "20px" }}
                  >
                    <img
                      alt="Logo empresa"
                      src={require("assets/img/icons/logo_sin_fondo.png")}
                      style={{
                        width: "100%",
                        maxWidth: "150px",
                        height: "150px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>

                  <Col
                    lg="3"
                    md="4"
                    sm="6"
                    xs="6"
                    className="d-flex justify-content-center"
                    style={{ gap: "20px" }}
                  >
                    <img
                      alt="Logo empresa"
                      src={require("assets/img/icons/logo_colanta.png")}
                      style={{
                        width: "100%",
                        maxWidth: "150px",
                        height: "150px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>

                </Row>
                <h2
                  className="text-light mb-5"
                  style={{
                    fontWeight: "500",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  Distribuidor Autorizado
                </h2>
            </div>
          </Container>
          
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
               style={{background: "#EBEBEB"}}
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
                style={{background: "#EBEBEB"}}
              />
            </svg> */}
          
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5" >
          <Row
            className="justify-content-center"
           
          >
            <LoadingProvider>
              <NotificationProvider>
                <LoginProvider>
                  <Routes>
                    {!isAuthenticated() ? getRoutes(routes):""}
                    <Route
                      path="*"
                      element={<Navigate to="/admin/index" replace />}
                    />
                  </Routes>

             


                </LoginProvider>
              </NotificationProvider>
            </LoadingProvider>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;
