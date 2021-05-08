import React, { useState, useEffect } from 'react';
import {
  Navbar,
  NavDropdown,
  MenuItem,
  NavItem,
  Nav,
  Popover,
  Tooltip,
  Button,
  Modal,
  OverlayTrigger
} from "react-bootstrap";

const AddBanlistForm = (props) => {
  // const [item, setItem] = React.useState({});
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  // const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  // const [photoIndex, setPhotoIndex] = React.useState(0);
  useEffect(() => {

    console.log('showModal >> ', props.showModal)
    setShowModal(props.showModal)
  });

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
  };

  const onSubmit  = () => {
    console.log('onSubmit')
  }

  const bodyContent = () =>{
    return <div>bodyContent</div>
  }
  
  return (
    <div>
      <Modal
        show={showModal}
        onHide={props.onClose}
        onSubmit={onSubmit()}
      //   bsSize="large"
      >
        <Modal.Header closeButton={true}>
          {/* <h2>{ this.state.mode === "login" ? "Login" : this.state.mode === "register" ? "Register" : "Forgot Password" }</h2> */}
          <h2>AddBanlistForm</h2>
        </Modal.Header>
        <Modal.Body>
          {/* {this.state.mode === "login" ? (this.renderLogin()) : this.state.mode === "register" ? (this.renderRegister()) : (this.renderForgot())} */}
          {bodyContent()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
}

export default AddBanlistForm;