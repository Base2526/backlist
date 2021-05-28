import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import { userLogout } from '../actions/user';

const LogoutDialog = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = React.useState(false);
    useEffect(() => {
        setShowModal(props.showModalLogout)
    });

    const handleLogout = (e) => {
        props.onClose()

        props.userLogout()
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

const mapStateToProps = (state, ownProps) => {
	return {
        user: state.user.data,
        maintenance: state.setting.maintenance
    }
}

const mapDispatchToProps = {
  userLogout
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutDialog)