import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { connect } from 'react-redux'

import {isEmpty, onToast} from '../utils'

const ReportDialog = (props) => {
    const history = useHistory();

    const [nid, setNid] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory]   = useState("");
    const [message, setMessage]     = useState("");
    const [reportLoading, setReportLoading] = useState(false);
    
    const [itemCategory, setItemCategory]   = React.useState([{"id":0, "label": "--เลือก--"}, {"id":1, "label": "แจ้งลบ"}, {"id":2, "label": "ข้อมูลไม่ครบถ้วน"}, {"id":3, "label": "อื่นๆ"}])

    // Attach file
    const [attachFiles, setAttachFiles] = useState([]);

    useEffect(() => {
        console.log('ReportDialog >> ', props)

        setShowModal(props.showModal)
        setNid(props.item.id)
    });

    const handleReport = (e) => {
        if( isEmpty(category) && isEmpty(message) ){
            onToast('error', "Category, message is empty")
        }else if(isEmpty(category)){
            onToast('error', "Category is empty")
        }else if(isEmpty(message)){
            onToast('error', "Message is empty")
        }else{
            const data = new FormData();

            data.append('nid', nid);
            data.append('category', category );
            data.append('message', message);
            attachFiles.map((file) => { data.append('files[]', file) })

            setReportLoading(true)
            axios.post(`/api/report?_format=json`, data, {
                headers: { 
                    'Authorization': `Basic ${props.user.basic_auth}`,
                    'content-type': 'multipart/form-data'
                }
            })
            .then((response) => {
                let results = response.data
                console.log("/api/report response :", results)
                
                if(results.result){
                    handleClose()
                    onToast('info', "Report success")
                }else{
                    onToast('error', results.message)
                }
                setReportLoading(false)
            })
            .catch((error) => {
                console.log("/api/report error :", error)

                onToast('error', error)
                setReportLoading(false)
            });
        }        
    }

    const handleClose = () => {
        props.onClose()
    }

    const changeFiles = (e) => {
        var filesArr = Array.prototype.slice.call(e.target.files);
        setAttachFiles([...attachFiles, ...filesArr])
    }

    const removeFile = (f) => {
        setAttachFiles(attachFiles.filter((x) => x !== f))
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
                            onChange={(e)=>{ setCategory(e.target.value) }} >
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
                                setMessage(e.target.value)
                            })}/>
                    </div>
                    <div>
                        <div>Attach file</div>
                        <label className="custom-file-upload">
                            <input type="file" multiple onChange={changeFiles} />
                            <i className="fa fa-cloud-upload" /> Attach
                        </label>
                        <div className="file-preview">
                            {
                                attachFiles.map((file) => {
                                    return (
                                        <div style={{ display: "inline-block", padding: "5px" }}>
                                        <div>
                                            <img width="50" height="60" src={URL.createObjectURL(file)} />
                                            <div style={{cursor: "pointer"}} onClick={()=>removeFile(file)}>X</div>
                                        </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
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
                <Button variant="secondary" onClick={handleClose}>Close </Button>
                <Button variant="primary" onClick={handleReport}>Report {reportLoading && <CircularProgress size={15}/>}</Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
	return { user: state.user.data }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReportDialog)