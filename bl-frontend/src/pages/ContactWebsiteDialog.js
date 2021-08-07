import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ContactWebsiteDialog = (props) => {
    const history = useHistory();

    const [showModal, setShowModal] = React.useState(false);
    
    const [name, setName]       = React.useState("");
    const [email, setEmail]     = React.useState("");
    const [title, setTitle]     = React.useState("");
    const [message, setMessage] = React.useState("");
    
    useEffect(() => {
        console.log('ContactWebsiteDialog >> ', props)

        setShowModal(props.showModal)
    });

    const handleLogout = (e) => {
        props.onClose()
        history.push({pathname: `/`, state: {} })
    }

    const handleClose = (e) => {
        props.onClose()
    }

    const bodyContent =()=>{
        return( <div>
                    <div>
                    <div>
                        <div>
                                Name :
                            </div>
                            <div>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                placeholder="enter name"
                                value={name}
                                onChange={(e)=>{
                                    setName(e.target.value)
                                }}
                            />    
                            </div>
                        </div>
                        <div>
                            <div>
                                Email :
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="enter email"
                                    value={email}
                                    onChange={(e)=>{
                                        setEmail(e.target.value)
                                    }}
                                />    
                            </div>
                        </div>
                        <div>
                            <div>
                                Title : 
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="form-control"
                                    placeholder="enter title"
                                    value={title}
                                    onChange={(e)=>{
                                        setTitle(e.target.value)
                                    }}
                                />    
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>Messasge</div>
                        <textarea 
                            id="message" 
                            name="message" 
                            placeholder="enter message"
                            style={{width: '100%'}} 
                            rows="4" cols="50" 
                            onChange={((e)=>{
                                setMessage(e.target.value)
                            })}/>
                    </div>
                </div>)
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
                <h2>Contact Website</h2>
            </Modal.Header>
            <Modal.Body>
                {bodyContent()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Send</Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default ContactWebsiteDialog;