import React, { useEffect, useLayoutEffect, useRef } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import moment from "moment";
import { CircularProgress } from '@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import axios from 'axios';

import LoginDialog from './LoginDialog'
import { isEmpty, commaFormatted } from "../utils";
import ReportDialog from './ReportDialog'

import { onMyFollow } from '../actions/my_follows';

var _ = require('lodash');

// Hook
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}

const DetailPage = (props) => {
    const history = useHistory();

    const [item, setItem]               = React.useState(null);
    const [nid, setNid]                 = React.useState(0);
    const [isOpen, setIsOpen]           = React.useState(false);
    const [showModalLogin, setShowModalLogin]   = React.useState(false);
    const [showModalReport, setShowModalReport] = React.useState(false);
    const [photoIndex, setPhotoIndex]   = React.useState(0);
    const [anchorEl, setAnchorEl]       = React.useState(null);

    const prevNid = usePrevious(props.match.params.nid);

    useEffect( async() => {
        let {state} = props.location
        let {match}  = props

        setNid(match.params.nid)

        // _.isEmpty( (props.my_follows.find((el)=>el.nid === nid && el.status)) )
        // let __x = _.isEmpty( (props.my_follows.find((el)=>el.nid === parseInt(match.params.nid) && el.status)) );
        // let __y = props.my_follows;
        // let __z = props.my_follows.find((el)=>el.nid === parseInt(match.params.nid) && el.status )
        // console.log("__x , __y, __z =", __x, __y, __z, match.params.nid)

        if(state === undefined){

            let response =  await axios.post(`/api/v1/search`, { 
                type: 2,
                key_word: props.match.params.nid,
                offset: 0,
             }, { headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} });

            response = response.data
  
            if(response.result){
                console.log("/api/v1/search : response =", response)

                let {datas} = response
                if(!isEmpty(datas)){
                    if(_.isEmpty(datas[0])){
                        props.history.goBack();
                        return;
                    }

                    setItem(datas[0])
                }
            }
        }else{

            if(_.isEmpty(state.item)){
                props.history.goBack();
                return;
            }

            setItem(state.item)
        }

        resetScroll()
    }, [props.location]);

    const resetScroll = () =>{
        if(nid !== prevNid){
            window.scrollTo(0, 0)
        } 
    }

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
                            <div>{!isEmpty(item.transfer_amount) ? commaFormatted(item.transfer_amount) : item.transfer_amount}</div>
                        </div>
                        <div>
                          <div>วันโอนเงิน: {moment(item.transfer_date).format('MMM DD, YYYY')}</div>
                        </div>

                        <div>
                            <div>รายละเอียดเพิ่มเติม :</div>
                            <div>{item.detail}</div>
                        </div>
                        <div>
                            <VerifiedUserOutlinedIcon 
                                style={{cursor:'pointer', fill: _.isEmpty( (props.my_follows.find((el)=>el.nid === parseInt(nid) && el.status)) ) ? "gray" : "red"}}
                                onClick={()=>{ 
                                    if(_.isEmpty(props.user)){
                                        setShowModalLogin(true)
                                    }else{
                                        props.onMyFollow(item.nid)
                                    }
                                }} />
                            <MoreVertOutlinedIcon 
                                style={{cursor:'pointer'}}
                                onClick={(e)=>{
                                    setAnchorEl(e.currentTarget);
                                }} />

                            <div style={{cursor:'pointer',}} onClick={()=>{
                                props.history.push({pathname: `/my-follower/${item.nid}`, key: item.nid, state: { item } })
                                }}>
                                 { _.isEmpty(item.app_followers) ? 0 : item.app_followers.length } follower
                            </div>
                        </div>
                        <div className="row d-flex flex-row py-5"> 
                            {
                                !isEmpty(item.images) &&  item.images[0].map((item, index)=>{
                                                                                    return <div key={index} style={{margin: 10, cursor:'pointer'}} onClick={()=>{ setIsOpen(true); setPhotoIndex(index); }}>  
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
                                        mainSrc={item.images[0][photoIndex].url}
                                        nextSrc={item.images[0][(photoIndex + 1) % item.images[0].length].url}
                                        prevSrc={item.images[0][(photoIndex + item.images[0].length - 1) % item.images[0].length].url}

                                        imageTitle= { (photoIndex + 1) + "/" + item.images[0].length }
                                        // mainSrcThumbnail={images[photoIndex]}
                                        // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                                        // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                                        onCloseRequest={() => setIsOpen(false) }

                                        onMovePrevRequest={() =>
                                        // this.setState({
                                        //     photoIndex: (photoIndex + images.length - 1) % images.length
                                        // })
                                            setPhotoIndex((photoIndex + item.images[0].length - 1) % item.images[0].length)
                                        }
                                        onMoveNextRequest={() =>
                                        // this.setState({
                                        //     photoIndex: (photoIndex + 1) % images.length
                                        // })
                                            setPhotoIndex((photoIndex + 1) % item.images[0].length)
                                        }
                                    />
                        }
                        <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            open={Boolean(anchorEl)}>
                            <CopyToClipboard text={"http://localhost:8099/detail/" + item.nid}>
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

                        

                        { showModalLogin &&  <LoginDialog showModal={showModalLogin} onClose = {()=>{ setShowModalLogin(false) }} />}

                    </div> 
            }
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
      user: state.user.data,
      data: state.app.data,
      my_follows: state.my_follows.data,
    };
}
  
const mapDispatchToProps = {
    // fetchData,
    onMyFollow
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DetailPage)