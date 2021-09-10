import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios';
import ls from 'local-storage';
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import UseMyPostItem from "./UseMyPostItem";

import MyPostConfirmDeleteDialog from './MyPostConfirmDeleteDialog'
import MyPostConfirmUpdateStatusDialog from './MyPostConfirmUpdateStatusDialog'


import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import {isEmpty, onToast} from '../utils'

import { initMyApp,  addMyAppALL } from '../actions/my_apps';
import { attributesToProps } from "html-react-parser";

import { addContentsData } from '../actions/app';

import Tabs from "../components/Tabs";

var _ = require('lodash');

const MyPostPage = (props) => {
    const history = useHistory();
    const [myApps, setMyApps] = useState(props.my_apps);
    const [anchorEl, setAnchorEl] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [showModalConfirmUpdateStatus, setShowModalConfirmUpdateStatus] = useState(false);

    const [datas, setDatas] = useState(props.data);
    const [drafts, setDrafts] = useState([]);
    const [published, setPublished] = useState([]);

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        props.datas.sort(function(a,b){ return b.changed - a.changed; });
        setDatas(props.datas)

        setDrafts(props.datas.filter((o)=>!o.status)) 
        setPublished(props.datas.filter((o)=>o.status)) 

        console.log('props.data >>> ', props.datas.filter((o)=>!o.status), props.datas.filter((o)=>o.status) )

    }, [props.datas]);

    const fetchData = async() =>{
        let response =  await axios.post(`/api/v1/search`, 
                                        {   type: 1,
                                            key_word: props.user.uid,
                                            offset: 0,
                                           //  page_limit: pageLimit
                                        }, 
                                        { headers: {'Authorization': `Basic ${ls.get('basic_auth')}` } });

        response = response.data
        console.log("response : ", response, props.user.uid)
        if(response.result){
            let {execution_time, datas, count } = response;
            props.addContentsData(datas);
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const menu = () =>{
        return  <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    onClose={()=> handleClose() }
                    open={Boolean(anchorEl)}>
                    <MenuItem 
                    onClick={()=>{
                        handleClose()
                    }}>Edit</MenuItem>
                    <MenuItem 
                    onClick={()=>{
                        handleClose()
                    }}>Delete</MenuItem>
                </Menu> 
    }

    const updateState = data => {
        switch(Object.keys(data)[0]){
          case "showModalLogin":{
            // setShowModalLogin(Object.values(data)[0])
            break;
          }
          case "showModalReport":{
            // setShowModalReport(Object.values(data)[0])
            break;
          }
        }
    }

    const onModalConfirmDelete = data => {
        setShowModalConfirmDelete(data)
    }

    const onModalConfirmUpdateStatus = data =>{
        setShowModalConfirmUpdateStatus(data)
    }
    
    const itemView = (item) =>{
        console.log('itemView :', item)
    
        if(Object.keys(item).length === 0 ){
            return <div />
        }
    
        if(item.images.length === 0 ){
            return <div />
        }
      
        
        let thumbnail = item.images.thumbnail
        let medium    = item.images.medium
        switch(thumbnail.length){
            case 0:{
              return(<div />)
            }
            case 1:{
                return(
                    <div key={item.id}> 
                        <div class="hi-container">
                            <div class="hi-sub-container1">
                                <div class="hi-item1" 
                                    onClick={()=>{ 
                                        setIsOpen(true); 
                                        setPhotoIndex(0);
                                    }} >
                                    <LazyLoadImage
                                        alt={'image.alt'}
                                        width="100%"
                                        height="100px"
                                        effect="blur"
                                        src={thumbnail[0].url} />
                                </div>
                            </div>
                        </div>
                        {
                        isOpen && <Lightbox
                                mainSrc={medium[photoIndex].url}
                                nextSrc={medium[(photoIndex + 1) % medium.length].url}
                                prevSrc={medium[(photoIndex + medium.length - 1) % medium.length].url}
    
                                imageTitle= { (photoIndex + 1) + "/" + medium.length }
                                // mainSrcThumbnail={images[photoIndex]}
                                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}
    
                                onCloseRequest={() => setIsOpen(false) }
    
                                onMovePrevRequest={() =>
                                // this.setState({
                                //     photoIndex: (photoIndex + images.length - 1) % images.length
                                // })
                                    setPhotoIndex((photoIndex + medium.length - 1) % medium.length)
                                }
                                onMoveNextRequest={() =>
                                // this.setState({
                                //     photoIndex: (photoIndex + 1) % images.length
                                // })
                                    setPhotoIndex((photoIndex + 1) % medium.length)
                                }
                            />
                        } 
                    </div>
                )
            }
    
            case 2:{
                return(<div key={item.id}> 
                    <div class="hi-container">
                    <div class="hi-sub-container1">
                        <div class="hi-item1" 
                            onClick={()=>{ 
                                setIsOpen(true); 
                                setPhotoIndex(0);
                            }} >
                            <LazyLoadImage
                                alt={'image.alt'}
                                width="100%"
                                height="100px"
                                effect="blur"
                                src={thumbnail[0].url} />
                        </div>
                        <div class="hi-item2" onClick={()=>{ setIsOpen(true); setPhotoIndex(1); }} >
                            <LazyLoadImage
                                alt={'image.alt'}
                                width="100%"
                                height="100px"
                                effect="blur"
                                src={thumbnail[1].url} />
                        </div>
                    </div>
                </div>
                
                {
            isOpen && <Lightbox
                        mainSrc={medium[photoIndex].url}
                        nextSrc={medium[(photoIndex + 1) % medium.length].url}
                        prevSrc={medium[(photoIndex + medium.length - 1) % medium.length].url}

                        imageTitle= { (photoIndex + 1) + "/" + medium.length }
                        // mainSrcThumbnail={images[photoIndex]}
                        // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                        // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                        onCloseRequest={() => setIsOpen(false) }

                        onMovePrevRequest={() =>
                        // this.setState({
                        //     photoIndex: (photoIndex + images.length - 1) % images.length
                        // })
                            setPhotoIndex((photoIndex + medium.length - 1) % medium.length)
                        }
                        onMoveNextRequest={() =>
                        // this.setState({
                        //     photoIndex: (photoIndex + 1) % images.length
                        // })
                            setPhotoIndex((photoIndex + 1) % medium.length)
                        }
                    />
                } 
                </div>)
 
            }
            case 3:{
                return(<div key={item.id}> 
                    <div class="hi-container">
                    <div class="hi-sub-container1">
                        <div class="hi-item1" 
                            onClick={()=>{ 
                                setIsOpen(true); 
                                setPhotoIndex(0);
                            }} >
                            <LazyLoadImage
                                alt={'image.alt'}
                                width="100%"
                                height="100px"
                                effect="blur"
                                src={thumbnail[0].url} />
                        </div>
                        <div class="hi-item2" onClick={()=>{ setIsOpen(true); setPhotoIndex(1); }} >
                            <LazyLoadImage
                                alt={'image.alt'}
                                width="100%"
                                height="100px"
                                effect="blur"
                                src={thumbnail[1].url} />
                        </div>
                    </div>
                    <div class="hi-sub-container2">
                        <div class="hi-item3" onClick={()=>{ setIsOpen(true); setPhotoIndex(2); }} >
                            <LazyLoadImage
                                alt={'image.alt'}
                                width="100%"
                                height="100px"
                                effect="blur"
                                src={thumbnail[2].url} />
                        </div>
                    </div>
                </div>
                
                {
            isOpen && <Lightbox
                        mainSrc={medium[photoIndex].url}
                        nextSrc={medium[(photoIndex + 1) % medium.length].url}
                        prevSrc={medium[(photoIndex + medium.length - 1) % medium.length].url}

                        imageTitle= { (photoIndex + 1) + "/" + medium.length }
                        // mainSrcThumbnail={images[photoIndex]}
                        // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                        // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                        onCloseRequest={() => setIsOpen(false) }

                        onMovePrevRequest={() =>
                        // this.setState({
                        //     photoIndex: (photoIndex + images.length - 1) % images.length
                        // })
                            setPhotoIndex((photoIndex + medium.length - 1) % medium.length)
                        }
                        onMoveNextRequest={() =>
                        // this.setState({
                        //     photoIndex: (photoIndex + 1) % images.length
                        // })
                            setPhotoIndex((photoIndex + 1) % medium.length)
                        }
                    />
                } 
                </div>)
   
            }
    
            default:{
                return(<div key={item.id}> 
                            <div class="hi-container">
                            <div class="hi-sub-container1">
                                <div class="hi-item1" 
                                    onClick={()=>{ 
                                        setIsOpen(true); 
                                        setPhotoIndex(0);
                                    }} >
                                    <LazyLoadImage
                                        alt={'image.alt'}
                                        width="100%"
                                        height="100px"
                                        effect="blur"
                                        src={thumbnail[0].url} />
                                </div>
                                <div class="hi-item2" onClick={()=>{ setIsOpen(true); setPhotoIndex(1); }} >
                                    <LazyLoadImage
                                        alt={'image.alt'}
                                        width="100%"
                                        height="100px"
                                        effect="blur"
                                        src={thumbnail[1].url} />
                                </div>
                            </div>
                            <div class="hi-sub-container2">
                                <div class="hi-item3" onClick={()=>{ setIsOpen(true); setPhotoIndex(2); }} >
                                    <LazyLoadImage
                                        alt={'image.alt'}
                                        width="100%"
                                        height="100px"
                                        effect="blur"
                                        src={thumbnail[2].url} />
                                </div>
                            </div>
                        </div>
                        
                        {
                    isOpen && <Lightbox
                                mainSrc={medium[photoIndex].url}
                                nextSrc={medium[(photoIndex + 1) % medium.length].url}
                                prevSrc={medium[(photoIndex + medium.length - 1) % medium.length].url}
    
                                imageTitle= { (photoIndex + 1) + "/" + medium.length }
                                // mainSrcThumbnail={images[photoIndex]}
                                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}
    
                                onCloseRequest={() => setIsOpen(false) }
    
                                onMovePrevRequest={() =>
                                // this.setState({
                                //     photoIndex: (photoIndex + images.length - 1) % images.length
                                // })
                                    setPhotoIndex((photoIndex + medium.length - 1) % medium.length)
                                }
                                onMoveNextRequest={() =>
                                // this.setState({
                                //     photoIndex: (photoIndex + 1) % images.length
                                // })
                                    setPhotoIndex((photoIndex + 1) % medium.length)
                                }
                            />
                        } 
                        </div>)
            }
        }
      }

    // const items = () =>{
    //     return  datas.map((data, idx) => {
    //                         return  <div key={idx}  style={{borderStyle: "dashed"}}>
    //                                     <div>{data.uid}</div>
    //                                     <div>{data.name}</div>
    //                                     <div>{data.email}</div>
    //                                     <div>{data.image_url}</div>
    //                                 </div>
    //                      })
    // }

    const drafts_view = () =>{
        return  drafts.map((item, idx) => {
            return  <UseMyPostItem 
                        {...props} 
                        type={'drafts'}
                        item={item}
                        updateState={updateState}
                        onModalConfirmDelete={onModalConfirmDelete}
                        onModalConfirmUpdateStatus={onModalConfirmUpdateStatus}
                    />
         })
    }

    const published_view = () =>{
        return  published.map((item, idx) => {
            return  <UseMyPostItem 
                        {...props} 
                        type={'published'}
                        item={item}
                        updateState={updateState}
                        onModalConfirmDelete={onModalConfirmDelete}
                        onModalConfirmUpdateStatus={onModalConfirmUpdateStatus}
                    />
         })
    }

    const responses_view = () =>{
        return  [].map((data, idx) => {
            return  <div key={idx}  style={{borderStyle: "dashed"}}>
                        <div>data.uid</div>
                       
                    </div>
         })
    }

    return (
        <div>
            <h1>Your posts</h1>
            <Tabs activeTab={'published'}>
                <div label= {`Drafts ${ _.isEmpty(drafts) ? '' : drafts.length }`} id="drafts" >
                 {drafts_view()}
                </div>
                <div label= {`Published ${ _.isEmpty(published)  ? '' : published.length }`} id="published">
                 {published_view()}
                </div>
                <div label="Responses"  id="responses">
                  {responses_view()}
                </div>
            </Tabs>
        </div>
    )
  
    /*
    return2 (
            <div className="container mb-5">
                <div > 
                {
                myApps.map(item => (
                    <UseMyPostItem 
                        {...props} 
                        item={item}
                        updateState={updateState}
                        onModalConfirmDelete={onModalConfirmDelete}
                        onModalConfirmUpdateStatus={onModalConfirmUpdateStatus}
                        />
                ))
                }

                {showModalConfirmDelete && <MyPostConfirmDeleteDialog showModalConfirmDelete={showModalConfirmDelete} onClose = {()=>{setShowModalConfirmDelete(false)}} />}
                {showModalConfirmUpdateStatus && <MyPostConfirmUpdateStatusDialog showModalConfirmUpdateStatus={showModalConfirmUpdateStatus} onClose = {()=>{setShowModalConfirmUpdateStatus(false)}} /> }
                </div>
            </div>
            )
            */
}
  
const mapStateToProps = (state, ownProps) => {
    console.log('MyPostPage> mapStateToProps : ', state)
	return { 
            user: state.user.data, 
            my_apps: state.my_apps.data,

            datas: state.app.data.filter((o)=>o.owner_id === state.user.data.uid),
           }
}

const mapDispatchToProps = {
    initMyApp,
    addMyAppALL,


    addContentsData
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPostPage)