import React, { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import Notification from "../../services/notification";

import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";
import InternetConnectionContext from "context/InternetConnectionContext";

import Loading from "components/Loading/Loading.js";

function TimelineHeader({ name, parentName, toUrl="" }) {

  const notificationAlertRef = useRef(null);

  const { status, type, message, setStatus } = useContext(NotificationContext);
  const { loading } = useContext(LoadingContext);
  const { setIsOnline } = useContext(InternetConnectionContext);

  useEffect(() => {
    if(status){
        Notification.viewNotification(type, message, notificationAlertRef);
        setStatus(0);
    }
  },[status]);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      {loading ? <Loading />:""}
      <div className="header header-dark bg-gradient-hensall pb-6 content__title content__title--calendar">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6" xs="7">
                <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0">
                  {name}
                </h6>{" "}
                <Breadcrumb
                  className="d-none d-md-inline-block ml-lg-4"
                  listClassName="breadcrumb-links breadcrumb-dark"
                >
                  <BreadcrumbItem>
                  <Link
                      to={"/admin/home"} >
                      <i className="fas fa-home" />
                  </Link>
                    {/* <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <i className="fas fa-home" />
                    </a> */}
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                  <Link
                      to={"/admin/"+toUrl} >
                      {parentName}
                  </Link>
                    {/* <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      {parentName}
                    </a> */}
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    {name}
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

TimelineHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default TimelineHeader;