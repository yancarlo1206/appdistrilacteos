import React, { useContext, useEffect, useState } from 'react';
import { Modal } from "reactstrap";
import "./spinner.css";

function Loading() {

    const [load, setLoad] = useState(true);

    const closeModal = (e) => {
        e.preventDefault();
    }

    return(
        <>
        <Modal
            className="modal-dialog-centered modal-loading"
            size="sm"
            isOpen={load}
            toggle={closeModal}
        >
            <div className="modal-body">
                <div className="spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        </Modal>
        </>
    );

}

export default Loading;