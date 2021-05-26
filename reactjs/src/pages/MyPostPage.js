import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios';

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import UseMyPostItem from "./UseMyPostItem";

import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import {isEmpty, onToast} from '../utils'

const MyPostPage = (props) => {
    const history = useHistory();

    const [isFetch, setIsFetch] = useState(false);
    const [myApps, setMyApps] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [isOpen, setIsOpen] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);

    useEffect(() => {
        if(!isFetch){
            fetchData()
        }
    });

    const fetchData = () =>{
        axios.post(`/api/fetch_mypost?_format=json`, 
            {}, 
            {
                headers: { 'Authorization': `Basic ${props.user.basic_auth}` }
            })
        .then(function (response) {
            let results = response.data
            if(results.result){
                setMyApps(results.datas)

                console.log("results.datas", results.datas)
            }

            setIsFetch(true)
        })
        .catch(function (error) {
            onToast('error', error)
        });
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
                <div className="row d-flex flex-row py-5"> 
                {
                myApps.map(item => (
                    // <div key={item} className="notifications-item">
                    //     {itemView(item)}
                    //     <div>{item.detail}</div>
                    //     <div> 11 hours ago </div>

                    //     <MoreVertOutlinedIcon 
                    //         style={{ cursor: "pointer" }}
                    //         onClick={(event)=>{
                    //             setAnchorEl(event.currentTarget);  
                    //         }} />
                    //     {menu()}
                    // </div>
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
	return { user: state.user.data }
}

const mapDispatchToProps = {
  // fetchData,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPostPage)