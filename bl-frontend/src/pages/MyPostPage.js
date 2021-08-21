import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios';
import ls from 'local-storage';
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import UseMyPostItem from "./UseMyPostItem";

import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import {isEmpty, onToast} from '../utils'

import { initMyApp,  addMyApp } from '../actions/my_apps';
import { attributesToProps } from "html-react-parser";

const MyPostPage = (props) => {
    const history = useHistory();
    const [myApps, setMyApps] = useState(props.my_apps);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [isOpen, setIsOpen] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        props.my_apps.sort(function(a,b){ return b.changed - a.changed; });
        setMyApps(props.my_apps)
    }, [props.my_apps]);

    const fetchData = async() =>{

        props.initMyApp()

        // setLoginLoading(true)
        let response =  await axios.post(`/api/v1/search`, 
                                        { type: 1,  key_word: props.user.uid, offset: 0 }, 
                                        { headers: {'Authorization': `Basic ${ls.get('basic_auth')}` } });

        response = response.data
        console.log("response", response)

        if(response.result){
            console.log("response.datas", response.datas)
            response.datas.map((data)=>{
                props.addMyApp( {nid:data.id, data} )
            })
        }

    }

    const handleClose = () => {
        setAnchorEl(null)
    }

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
  
    return (
            <div className="container mb-5">
                <div > 
                {
                myApps.map(item => (
                    <UseMyPostItem 
                        {...props} 
                        item={item}
                        updateState={updateState}/>
                ))
                }
                </div>
            </div>
            )
}
  
const mapStateToProps = (state, ownProps) => {
    console.log('MyPostPage> mapStateToProps : ', state)
	return { 
            user: state.user.data, 
            my_apps: state.my_apps.data 
           }
}

const mapDispatchToProps = {
    initMyApp,
    addMyApp
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPostPage)