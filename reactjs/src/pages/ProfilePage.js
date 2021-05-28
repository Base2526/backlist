import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import { CircularProgress } from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast }    from "react-toastify";
import { isEmpty }  from "../utils";
import previewIcon  from "../images/preview-icon.png";

const ProfilePage = (props) => {
    const history = useHistory();
    const [name, setName] = React.useState(props.user.name);
    const [edit, setEdit] = React.useState(false);
    const [updateLoading, setUpdateLoading] = React.useState(false);
    const [files, setFiles] = React.useState([]);

    useEffect(() => {
        console.log('ProfilePage')
    })

    const changeFiles = (e) => {
        var fileArr = Array.prototype.slice.call(e.target.files);
        setFiles(fileArr)        
    }

    const onUpdate = () =>{
        setUpdateLoading(true)
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

            setUpdateLoading(false)

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
                        isEmpty(files) ?  <LazyLoadImage
                                            className="lazy-load-image-border-radius"
                                            alt={'image.alt'}
                                            width="150px"
                                            height="150px"
                                            effect="blur"
                                            placeholderSrc={previewIcon}
                                            src={ props.user.image_url} />
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
                        : props.user.name
                    }
                    </div>
                    <div>Email : </div>
                    <div>{props.user.email}</div>
                    {
                        edit &&
                        <div>
                            <div 
                            style={{cursor:'pointer', padding: "5px", display: "inline"}}
                            onClick={()=>{
                                setEdit(false)
                            }}><span className={"div-button"}>Cancel</span></div>
                            {
                                updateLoading 
                                ? <div style={{cursor:'pointer', padding: "5px", display: "inline", pointerEvents: "none", opacity: "0.4"}}> 
                                    <span className={"div-button"}>Update <CircularProgress style={{ fontSize: 15, width:15, height:15 }}/></span>
                                  </div>

                                : 
                                (props.user.name !== name || !isEmpty(files)) 
                                ? <div 
                                    style={{cursor:'pointer', padding: "5px", display: "inline"}}
                                    onClick={()=>{
                                        onUpdate()
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
                {/* <div style={{paddingTop:10}}>
                    <div>
                        <span 
                            style={{cursor:'pointer'}}
                            className={"span-border-bottom"}
                            onClick={()=>{
                                history.push("/my-profile/my-post");
                            }}> <AddCircleOutlineOutlinedIcon />My post (10)
                        </span>
                    </div>
                    <div>
                        <span 
                            style={{cursor:'pointer'}}
                            className={"span-border-bottom"}
                            onClick={()=>{
                                history.push("/my-profile/my-followup");
                            }}> <VerifiedUserOutlinedIcon />My follow up (50)
                        </span>
                    </div>
                </div> */}
            </div>
        </div>
    );
};
  
const mapStateToProps = (state, ownProps) => {
	return { user: state.user.data }
}

const mapDispatchToProps = {
  // fetchData,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)