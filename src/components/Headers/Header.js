/*!
=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Licensed under MIT
=========================================================
*/

import { useRef, useContext, useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";

import NotificationAlert from "react-notification-alert";
import Notification from "../../services/notification";

import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";

import Loading from "components/Loading/Loading.js";

const Header = () => {
  const notificationAlertRef = useRef(null);
  const navigate = useNavigate();

  const { status, type, message, setStatus, notificaciones = [], total } =
    useContext(NotificationContext);
  const { loading } = useContext(LoadingContext);

  // 🔹 Filtrar pendientes (En proceso o En revisión)
  const notificacionesPendientes = notificaciones.filter((n) => {
    const estado = n.estado?.toLowerCase() || "";
    return estado.includes("proceso") || estado.includes("revision");
  });

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [animar, setAnimar] = useState(false);

  // Notificación visual tipo toast
  useEffect(() => {
    if (status) {
      Notification.viewNotification(type, message, notificationAlertRef);
      setStatus(0);
    }
  }, [status]);

  // Animación cuando hay notificaciones pendientes
  /*useEffect(() => {
    let interval;
    if (notificacionesPendientes.length > 0) {
      setAnimar(true);
      interval = setInterval(() => {
        setAnimar((prev) => !prev);
      }, 3000);
    } else {
      setAnimar(false);
    }
    return () => clearInterval(interval);
  }, [notificacionesPendientes.length]);*/

  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      {loading ? <Loading /> : ""}

      <div
        className="header pb-8 pt-5 pt-md-8"
        style={{
          background: "linear-gradient(90deg, #84C63B 0%, #58AB01 100%)",
        }}
      >
        <Container fluid>
          <div className="header-body">
            <Row>
              {/* CLIENTES REGISTRADO */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Clientes registrados
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">207</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Desde el mes anterior</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              {/* NUEVOS CLIENTES */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Clientes nuevos
                          <br />
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">194</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap size-10">
                        Desde el mes anterior
                      </span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              {/*CLIENTES RECHAZADOS*/}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Clientes rechazados
                          <br />
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">13</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-thumbs-down" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Desde el mes anterior</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              {/* === NOTIFICACIONES === */}
              <Col lg="6" xl="3">
                <Card
                  className={`card-stats mb-4 mb-xl-0 $
                    
                  `}
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() => navigate("/admin/aceptar")}
                >
                  <CardBody className="text-center">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-2"
                    >
                      Notificaciones
                    </CardTitle>

                    {/* ICONO CAMPANA */}
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <div
                        className={`icon icon-shape bg-info text-white rounded-circle shadow ${animar ? "bell-animate" : ""}`}
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMostrarPopup(!mostrarPopup);
                        }}
                      >
                        <i className={`fas fa-bell `} />
                      </div>

                      {/* 🔴 CONTADOR */}
                      {notificacionesPendientes.length > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            padding: "5px 7px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {notificacionesPendientes.length}
                        </span>
                      )}

                      {/* 📋 POPUP DETALLE */}
                      {mostrarPopup && notificacionesPendientes.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "70px",
                            right: "-20px",
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
                            padding: "10px 15px",
                            width: "260px",
                            zIndex: "1000",
                          }}
                        >
                          <p
                            className="fw-bold text-center mb-2"
                            style={{ color: "#58AB01" }}
                          >
                            Clientes pendientes
                          </p>
                          {notificacionesPendientes.map((notif) => (
                            <div
                              key={notif.id}
                              style={{
                                marginBottom: "6px",
                                padding: "6px",
                                borderRadius: "8px",
                                background:
                                  notif.estado === "En revisión"
                                    ? "#fff3cd"
                                    : "#f0f0f0",
                                borderLeft:
                                  notif.estado === "En revisión"
                                    ? "4px solid #ffc107"
                                    : "4px solid #999",
                                cursor: "pointer",
                              }}
                              onClick={() => navigate("/admin/aceptar")}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "0.9rem",
                                  fontWeight: "500",
                                }}
                              >
                                {notif.mensaje}
                              </p>
                              <small
                                style={{
                                  color:
                                    notif.estado === "En revisión"
                                      ? "#b18500"
                                      : "#555",
                                }}
                              >
                                {notif.estado}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Animación CSS */}
      <style>
        {`
        .card-stats{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        }
          .bell-animate {
  animation: bellShake 0.2s ease-in-out;
}

@keyframes bellShake {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}

          }
        `}
      </style>
    </>
  );
};

export default Header;