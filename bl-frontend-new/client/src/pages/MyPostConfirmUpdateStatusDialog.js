import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ls from 'local-storage';
import { CircularProgress } from '@material-ui/core';

import { userLogout } from '../actions/user';

const MyPostConfirmUpdateStatusDialog = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = React.useState(false);

    const [logoutLoading, setLogoutLoading] = React.useState(false);

    useEffect(() => {
        setShowModal(props.showModalConfirmUpdateStatus)
    });

    const handleLogout = (e) => {

        history.push({pathname: `/`, state: {} })
    }

    const handleClose = (e) => {
        props.onClose()
    }

    const bodyContent =()=>{
        return(<div>Comfirm Delete</div>)
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
                <h2>Comfirm Published/Unpublished</h2>
            </Modal.Header>
            <Modal.Body>
                {bodyContent()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancle</Button>
                <Button variant="primary" onClick={handleLogout}>Delete {logoutLoading && <CircularProgress size={15}/> }</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPostConfirmUpdateStatusDialog)