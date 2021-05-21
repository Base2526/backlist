import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { isEmpty } from "../Utils/Utils";

import previewIcon from '../../images/preview-icon.png';

const ProfilePage = (props) => {
    const history = useHistory();

    const [edit, setEdit] = React.useState(false);
    const [files, setFiles] = React.useState([]);

    useEffect(() => {
        console.log('ProfilePage')
    });

    const changeFiles = (e) => {
        var fileArr = Array.prototype.slice.call(e.target.files);
        setFiles(fileArr)        
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
                                    }}>Edit profile</div>
                    }
                    <div>
                    {
                        isEmpty(files) ?  <LazyLoadImage
                                            className="lazy-load-image-border-radius"
                                            alt={'image.alt'}
                                            width="150px"
                                            height="150px"
                                            effect="blur"
                                        //   onClick={handleClick}
                                            placeholderSrc={previewIcon}
                                            src={ props.user.image_url} />
                                        : files.map((file) => {
                                            console.log("fileArr >> : ", URL.createObjectURL(file));

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

                       
                        
                        {/*
                        
    */}


                        <label style={{cursor:'pointer'}}>
                            <input type="file" onChange={changeFiles} />
                            <CameraAltOutlinedIcon />
                        </label>
                    </div>
                    <div>Name : </div>
                    <div>{props.user.name}</div>
                    <div>Email : </div>
                    <div>{props.user.email}</div>
                    {
                        edit &&
                        <div>
                            <div 
                            style={{cursor:'pointer'}}
                            onClick={()=>{
                                setEdit(false)
                            }}>Cancel</div>
                            <div 
                            style={{cursor:'pointer'}}
                            onClick={()=>{
                                console.log('Update')
                            }}>Update</div>
                        </div>
                    }
                    
                </div>

                <div style={{paddingTop:10}}>
                    <div style={{cursor:'pointer'}}
                        onClick={()=>{
                            history.push("/my-profile/my-post");
                        }}> <AddCircleOutlineOutlinedIcon />My post (10)</div>
                    <div style={{cursor:'pointer'}}
                        onClick={()=>{
                            history.push("/my-profile/my-followup");
                        }}> <VerifiedUserOutlinedIcon />My follow up (50)</div>
                </div>
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