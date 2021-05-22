import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { CircularProgress } from '@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import axios from 'axios';

import LoginForm from '../Setting/LoginForm'
import { isEmpty } from "../Utils/Utils";

import ReportDialog from './ReportDialog'

import previewIcon from '../../images/preview-icon.png';

const DetailPage = (props) => {
    const history = useHistory();

    const [item, setItem]               = React.useState(null);
    const [nid, setNid]                 = React.useState(0);
    const [isOpen, setIsOpen]           = React.useState(false);
    const [showModalLogin, setShowModalLogin]   = React.useState(false);
    const [showModalReport, setShowModalReport] = React.useState(false);
    const [photoIndex, setPhotoIndex]   = React.useState(0);
    const [anchorEl, setAnchorEl]       = React.useState(null);

    useEffect(() => {
        let {match, data}  = props
        setNid(match.params.nid)
        let _data = data.find((item)=> item.id == match.params.nid)

        if(!isEmpty(_data)){
            setItem(_data)
        }else{
            axios.post(`/api/search?_format=json`, {
                type: 8,
                key_word: JSON.stringify([nid]),
                offset: 0
            }, {
                headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
            })
            .then(function (response) {
                let results = response.data
                if(results.result && results.count){
                    setItem(results.datas[0])
                }
            })
            .catch(function (error) {
                console.log("error :", error)
            });
        }
    });

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            { showModalReport && <ReportDialog showModal={showModalReport} onClose = {()=>{  setShowModalReport(false) }}  /> }
            {
                isEmpty(item)
                ?   <div> <CircularProgress /> </div> 
                :   <div>
                        <div>
                            <div>ชื่อ-นามสกุล :</div>
                            <div>{item.name_surname}</div>
                        </div>
                        <div>
                            <div>สินค้า/ประเภท :</div>
                            <div>{item.title}</div>
                        </div>
                        <div>
                            <div>ยอดเงิน :</div>
                            <div>{item.transfer_amount}</div>
                        </div>

                        <div>
                            <div>รายละเอียดเพิ่มเติม :</div>
                            <div>{item.detail}</div>
                        </div>
                        <div>
                            <VerifiedUserOutlinedIcon 
                                style={{cursor:'pointer'}}
                                onClick={()=>{ 
                                    if(isEmpty(props.user)){
                                        setShowModalLogin(true)
                                    }else{
                                        toast.info("Follow up or Unfollow up", 
                                            {
                                                position: "bottom-right", 
                                                hideProgressBar: true,
                                                autoClose: 1000,
                                            }) 
                                    }
                                }} />
                            <MoreVertOutlinedIcon 
                                style={{cursor:'pointer'}}
                                onClick={(e)=>{
                                    setAnchorEl(e.currentTarget);
                                }} />
                        </div>
                        <div className="row d-flex flex-row py-5"> 
                            {
                                !isEmpty(item.images) &&  item.images.medium.map((item, index)=>{
                                                                                    return <div style={{margin: 10, cursor:'pointer'}} onClick={()=>{ setIsOpen(true); setPhotoIndex(index); }}>  
                                                                                                <LazyLoadImage
                                                                                                    className="lazy-load-image"
                                                                                                    alt={'image.alt'}
                                                                                                    width="250px"
                                                                                                    height="250px"
                                                                                                    effect="blur"
                                                                                                    // placeholderSrc={'<div className="abc">' + previewIcon + '<div>'}
                                                                                                    placeholder={<div style={{textAlign:'center'}}><p>loading...</p></div>}
                                                                                                    src={item.url} />
                                                                                            </div>
                                                                                })
                            }
                            
                        </div>
                        {
                            isOpen &&  !isEmpty(item.images) &&   <Lightbox
                                        mainSrc={item.images.medium[photoIndex].url}
                                        nextSrc={item.images.medium[(photoIndex + 1) % item.images.medium.length].url}
                                        prevSrc={item.images.medium[(photoIndex + item.images.medium.length - 1) % item.images.medium.length].url}

                                        imageTitle= { (photoIndex + 1) + "/" + item.images.medium.length }
                                        // mainSrcThumbnail={images[photoIndex]}
                                        // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                                        // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                                        onCloseRequest={() => setIsOpen(false) }

                                        onMovePrevRequest={() =>
                                        // this.setState({
                                        //     photoIndex: (photoIndex + images.length - 1) % images.length
                                        // })
                                            setPhotoIndex((photoIndex + item.images.medium.length - 1) % item.images.medium.length)
                                        }
                                        onMoveNextRequest={() =>
                                        // this.setState({
                                        //     photoIndex: (photoIndex + 1) % images.length
                                        // })
                                            setPhotoIndex((photoIndex + 1) % item.images.medium.length)
                                        }
                                    />
                        }
                        <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            open={Boolean(anchorEl)}>
                            <CopyToClipboard text={"http://localhost:8099/detail/"}>
                            <MenuItem onClick={()=>{
                                toast.info("Link to post copied to clipboard.", 
                                        {
                                            position: "bottom-right", 
                                            hideProgressBar: true,
                                            autoClose: 1000,
                                        }) 

                                handleClose()
                            }}>Copy link</MenuItem>
                            </CopyToClipboard>
                            <MenuItem onClick={()=>{

                                if(isEmpty(props.user)){
                                    setShowModalLogin(true)
                                }else{
                                    setShowModalReport(true)
                                }

                                handleClose()
                            }}>Report</MenuItem>
                        </Menu> 

                        { showModalLogin &&  <LoginForm showModal={showModalLogin} onClose = {()=>{ setShowModalLogin(false) }} />}

                    </div> 
            }
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
      user: state.user.data,
      data: state.app.data,
    };
}
  
const mapDispatchToProps = {
    // fetchData,
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DetailPage)