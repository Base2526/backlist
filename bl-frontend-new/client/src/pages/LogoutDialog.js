import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ls from 'local-storage';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

import { userLogout } from '../actions/user';

const LogoutDialog = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = React.useState();

    const [logoutLoading, setLogoutLoading] = React.useState();

    useEffect(() => {
        setShowModal(false)
        setLogoutLoading(false)

        return () => {
            setShowModal()
            setLogoutLoading()
        };
    }, []);


    useEffect(() => {
        setShowModal(props.showModalLogout)

    }, [props.showModalLogout]);

    const handleLogout = async(e) => {
        setLogoutLoading(true)


        let response =  await axios.post(`/api/v1/logout`);

        response = response.data

        console.log("/api/v1/logout : response = xx ", response)

        
        // if(response.result){

        props.onClose()

        ls.remove('basic_auth')
        ls.remove('session')

        props.userLogout()

        setLogoutLoading(false)

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
            // bsSize="large"
            backdrop="static">
            <Modal.Header closeButton={true}>
                <h2>Comfirm Logout</h2>
            </Modal.Header>
            <Modal.Body>
                {bodyContent()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Logout {logoutLoading && <CircularProgress size={15}/> }</Button>
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