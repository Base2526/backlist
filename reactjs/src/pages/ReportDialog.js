import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ReportDialog = (props) => {
    const history = useHistory();

    const [showModal, setShowModal] = React.useState(false);
    const [message, setMessage]     = React.useState("");
    const [category, setCategory]   = React.useState(0);
    const [itemCategory, setItemCategory]   = React.useState([{"id":0, "label": "--เลือก--"}, {"id":1, "label": "แจ้งลบ"}, {"id":2, "label": "ข้อมูลไม่ครบถ้วน"}, {"id":3, "label": "อื่นๆ"}])
    useEffect(() => {
        console.log('ReportDialog >> ', props)

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
                            Select category
                        </div>
                        <div>
                        <select 
                            value={category}
                            name={`bank_wallet`}
                            id={`bank-wallet`}
                            onChange={(e)=>{
                                setCategory(e.target.value)
                                // const val = e.target.value;
                                // console.log('onChange', val, e.target.id)
                                // console.log('index : ', index, e.target.id, e.target.value, itemsMBA)

                                // let _itemsMBA = [...itemsMBA]

                                // let findi = _itemsMBA.findIndex((im)=>im.key === it.key)
                                // // console.log('itemsMBA-im : ', im)

                                // let data = _itemsMBA[findi];
                                // // console.log(itemsMerchantBankAccount, key)
                                // _itemsMBA[findi]  = {...data, bank_wallet: val}

                                // console.log('_itemsMBA : ', _itemsMBA)
                                
                                // setItemsMBA(_itemsMBA)

                            }} >
                            {
                            itemCategory.map((item)=>
                                <option value={item.id}>{item.label}</option>
                            )
                            }
                        </select>
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
                                console.log("Messasge : ", e.target.value)
                                // setEmail(e.target.value)
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
                <h2>Report</h2>
            </Modal.Header>
            <Modal.Body>
                {bodyContent()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Report</Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default ReportDialog;