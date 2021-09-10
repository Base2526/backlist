import React, { useEffect } from "react";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import { toast } from 'react-toastify';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// import ReactReadMoreReadLess from "react-read-more-read-less";
import moment from "moment";
import parse from 'html-react-parser';

import { isEmpty, commaFormatted, ReadMore} from "../utils";

const UseMyPostItem = (props) => {
  const [item, setItem] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  useEffect(() => {

    console.log('MyPostPage >  UseMyPostItem')
    setItem(props.item)
  });
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleClick = (event) => {

    console.log('setAnchorEl : ', event.currentTarget)
    console.log(typeof event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const itemView = () =>{
    // console.log('itemView :', item)

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

  const content_view = () =>{
    switch(props.type){
      case 'drafts':{
        return (
          <div style={{borderStyle: "dotted"}}>
            <div>{item.title}--{item.nid}</div>
            <MoreVertOutlinedIcon onClick={handleClick} />
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}>
                <MenuItem onClick={()=>{
                    console.log(item)
                }}>Edit draft</MenuItem>
                <MenuItem onClick={()=>{

                }} >Delete draft</MenuItem>
            </Menu> 
          </div>
        )
        break;
      }

      case 'published':{
        return (
          <div style={{borderStyle: "dashed"}}>
            <div>{item.title}--{item.nid}</div>
            <MoreVertOutlinedIcon onClick={handleClick} />
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}>
                <MenuItem onClick={()=>{console.log(item)}}>Share</MenuItem>
                <MenuItem onClick={()=>{console.log(item)}}>Edit</MenuItem>
                <MenuItem onClick={()=>{}} >Delete</MenuItem>
            </Menu> 
          </div>
        )
      }

      default:{
        return (
          <div style={{borderStyle: "dashed"}}></div>
        )
      }
    }
  }

  return ( <div>{content_view()}</div>)
  
  /*
  return2 (
    <div key={item.id} className="mypost-item">  
   
                <div style={{cursor: 'pointer'}} onClick={()=>{
                  // console.log('/detail/:id : ', props)
                  // /detail/:id
                  // props.history.push({pathname: `detail/${item.id}`, state: { item } })
                }}> 
                    <div>
                        <div style={{cursor: 'pointer'}} onClick={()=>{
                          props.history.push({pathname: `/my-profile/my-post/${item.id}`, state: { item } })
                        }}> 
                      
                        <div>
                          <div><h5>ชื่อ-นามสกุล:</h5> {item.name_surname} - {item.id}</div>
                        </div>

                        <div>
                          <div><h5>สินค้า/ประเภท:</h5> {item.title}</div>
                        </div>
                        <div>
                          <div><h5>ยอดเงิน:</h5> {!isEmpty(item.transfer_amount) ? commaFormatted(item.transfer_amount) : item.transfer_amount}</div>
                        </div>
                        <div>
                          <div><h5>วันโอนเงิน:</h5> {moment(item.transfer_date).format('MMM DD, YYYY')}</div>
                        </div>

                        <div>
                          <div><h5>Status:</h5> {item.status ? 'Published' : 'Unpublished'}</div>
                        </div>
                      </div>
                      <div>
                        <div><h5>รายละเอียด: </h5></div>
                        <div style={{maxWidth:"300px"}}>
                         

                        {
                          !isEmpty(item.detail) && <ReadMore>{parse(item.detail)}</ReadMore>
                        }
                          
                        </div>
                      </div> 
                    </div>
                    <div>
                     
                      <MoreVertOutlinedIcon 
                        onClick={handleClick} />
                    </div>
                </div>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}>
                <MenuItem onClick={()=>{
                   props.onModalConfirmUpdateStatus(true)
                   setAnchorEl(null);
                }}>{item.status ? 'Unpublished' : 'Published'}</MenuItem>
                <MenuItem onClick={()=>{}}>Edit</MenuItem>
                <MenuItem onClick={()=>{

                  props.onModalConfirmDelete(true)
                  setAnchorEl(null);

                }} >Delete</MenuItem>
            </Menu> 
            
    </div>
  );
  */
};
  
export default UseMyPostItem;