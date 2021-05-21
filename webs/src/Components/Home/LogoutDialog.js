import React, { useState, useEffect } from 'react';

import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

const LogoutDialog = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = React.useState(false);
    useEffect(() => {
        console.log('LogoutForm >> ', props)

        setShowModal(props.showModalLogout)
    });

    const handleLogout = (e) => {
        props.onClose()
        history.push({pathname: `/`, state: {} })
    }

    const handleClose = (e) => {
        props.onClose()
    }

    const bodyContent =()=>{
        return(<div>Comfirm Logout</div>)
    }

    return (
        <div>
        <Modal
            show={showModal}
            onHide={props.onClose}
            // onSubmit={handleSubmit}
            bsSize="large"
            backdrop="static">
            <Modal.Header closeButton={true}>
                <h2>Comfirm Logout</h2>
            </Modal.Header>
            <Modal.Body>
                {bodyContent()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Logout</Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default LogoutDialog;