import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import ls from 'local-storage';

import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import { CircularProgress } from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast }    from "react-toastify";
import { isEmpty }  from "../utils";
import previewIcon  from "../images/preview-icon.png";

import { userLogin } from '../actions/user';

var _ = require('lodash');

const ProfilePage = (props) => {
    const history = useHistory();
    const [name, setName]           = useState("");
    const [email, setEmail]         = useState("");
    const [imageUrl, setImageUrl]   = useState("");

    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        update()
    }, []);

    useEffect(() => {
        update()
    }, [props.user])

    const update = () =>{
        let { display_name, email, image_url } = props.user
        setName(display_name)
        setEmail(email)
        setImageUrl(image_url)
    }

    // const fetchProfile = async () =>{
    //     let { uid } = props.user
    //     let response =  await axios.post(`/api/v1/profile`,  {uid}, { headers: {'Authorization': `Basic ${ls.get('basic_auth')}`} });
        
    //     console.log('/api/v1/profile :', response)
    //     if(response.status === 200){
    //         let data = response.data
    //         if(data.result){
    //             // props.userLogin(data.data)
    //         }
    //     }
    // }

    const changeFiles = (e) => {
        var fileArr = Array.prototype.slice.call(e.target.files);
        setFiles(fileArr)        
    }

    /*
    const onUpdate = () =>{
        setLoading(true)
        const data = new FormData();
        if(props.user.name !== name){
            data.append("type", 1);
            data.append("display_name", name)
        }

        if(!isEmpty(files)){
            data.append("type", 2);
            files.map((file) => { data.append('file', file) })
        }

        if(props.user.name !== name && !isEmpty(files)){
            data.append("type", 3);
        }

        axios.post(`/api/update_profile?_format=json`, 
            data, 
            {
                headers: { 
                    'Authorization': `Basic ${props.user.basic_auth}` ,
                    'content-type': 'multipart/form-data'
                }
            }
        )
        .then( (response) => {
            let results = response.data
            console.log(results) 

            setLoading(false)

            toast.info("Update success.", 
                    {
                        position: "bottom-right", 
                        hideProgressBar: true,
                        autoClose: 1000,
                    }) 
        })
        .catch((error) => {
            console.log(error) 

            toast.error("Error update.", 
                    {
                        position: "bottom-right", 
                        hideProgressBar: true,
                        autoClose: 1000,
                    }) 
        });
    }
    */
    
    return (
        <div>
           <div>
                <div>
                    {
                        !edit && <div 
                                    style={{cursor:'pointer'}}
                                    onClick={()=>{
                                        setEdit(true)
                                    }}><span className={"div-button"}>Edit profile</span></div>
                    }
                    <div>
                    {
                        _.isEmpty(files) ?  <LazyLoadImage
                                                className="lazy-load-image-border-radius"
                                                alt={'image.alt'}
                                                width="150px"
                                                height="150px"
                                                effect="blur"
                                                placeholderSrc={previewIcon}
                                                src={ imageUrl } />
                                        : files.map((file) => {
                                            return <LazyLoadImage
                                                    className="lazy-load-image-border-radius"
                                                    alt={'image.alt'}
                                                    width="150px"
                                                    height="150px"
                                                    effect="blur"
                                                //   onClick={handleClick}
                                                    src={  URL.createObjectURL(file) } />
                                          })                        
                    }
                    {
                        edit && <label style={{cursor:'pointer'}}>
                                    <input type="file" onChange={changeFiles} />
                                    <CameraAltOutlinedIcon />
                                </label>
                    }
                        
                    </div>
                    <div>Name : </div>
                    <div>
                    {
                        edit 
                        ? <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-control"
                            placeholder="name"
                            value={name}
                            onChange={(e)=>{
                                setName(e.target.value)
                            }}
                        />
                        : name
                    }
                    </div>
                    <div>Email : </div>
                    <div>{email}</div>
                    {
                        edit &&
                        <div>
                            <div 
                            style={{cursor:'pointer', padding: "5px", display: "inline"}}
                            onClick={()=>{
                                setEdit(false)
                            }}><span className={"div-button"}>Cancel</span></div>
                            {
                                loading 
                                ? <div style={{cursor:'pointer', padding: "5px", display: "inline", pointerEvents: "none", opacity: "0.4"}}> 
                                    <span className={"div-button"}>Update <CircularProgress style={{ fontSize: 15, width:15, height:15 }}/></span>
                                  </div>

                                : 
                                (props.user.name !== name || !isEmpty(files)) 
                                ? <div 
                                    style={{cursor:'pointer', padding: "5px", display: "inline"}}
                                    onClick={()=>{
                                        // onUpdate()
                                    }}> 
                                    <span className={"div-button"}>Update</span>
                                  </div>
                                : <div style={{cursor:'pointer', padding: "5px", display: "inline", pointerEvents: "none", opacity: "0.4"}}> 
                                    <span className={"div-button"}>Update</span>
                                  </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};
  
const mapStateToProps = (state, ownProps) => {
	return { user: state.user.data }
}

const mapDispatchToProps = {
    userLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)