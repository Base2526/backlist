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

import { isEmpty, commaFormatted, ReadMore } from "../utils";

const UseFollowsItem = (props) => {
  const [item, setItem] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  const [followUp, setFollowUp] = React.useState(false);

  useEffect(() => {
    setItem(props.item)

    // setFollowUp( isEmpty(props.follow_ups.find((el)=>el.id === item.id && el.status)) ? false : true )
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
  
  /*
  var timestamp = 1607110465663
var date = new Date(timestamp);

console.log("Date: "+date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds());
  */

  const date_view = (timestamp)=>{
    // var timestamp = 1607110465663
    var date = new Date(timestamp);

    return date.toDateString()
    
    // return ("Date: "+date.getDate()+
    //           "/"+(date.getMonth()+1)+
    //           "/"+date.getFullYear()+
    //           " "+date.getHours()+
    //           ":"+date.getMinutes()+
    //           ":"+date.getSeconds());
  }

  return(
    <div style={{borderStyle: "dashed"}}>
      <div>{item.title} -- {item.nid}</div>
      <div>{date_view(item.date)}</div>
      <MoreVertOutlinedIcon onClick={handleClick} />
      <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={handleClose}
          open={Boolean(anchorEl)}>
          <MenuItem onClick={()=>{console.log(item)}}>Unfollow</MenuItem>
          <MenuItem onClick={()=>{console.log(item)}}>Share</MenuItem>
          <MenuItem onClick={()=>{console.log(item)}}>Edit</MenuItem>
          <MenuItem onClick={()=>{}} >Delete</MenuItem>
      </Menu> 
    </div>
  )

  /*
  return (
    <div key={item.id} style={{margin: 10}}>  
    
                {itemView()}
   
                <div style={{cursor: 'pointer'}} onClick={()=>{
                }}> 
                    <div>
                        <div style={{cursor: 'pointer'}} onClick={()=>{
                          props.history.push({pathname: `/my-profile/my-followup/${item.id}`, state: { item } })
                        }}> 
                      
                        <div>
                          <div>ชื่อ-นามสกุล: {item.name_surname}</div>
                        </div>

                        <div>
                          <div>สินค้า/ประเภท: {item.title}</div>
                        </div>
                        <div>
                          <div>ยอดเงิน: {!isEmpty(item.transfer_amount) ? commaFormatted(item.transfer_amount) : item.transfer_amount}</div>
                        </div>
                        <div>
                          <div>วันโอนเงิน: {moment(item.transfer_date).format('MMM DD, YYYY')}</div>
                        </div>
                      </div>
                      <div>
                        <div>รายละเอียด</div>
                        <div style={{maxWidth:"300px"}}>
                         

                {
                  !isEmpty(item.detail) && <ReadMore>{parse(item.detail)}</ReadMore>
                }
                
                          
                        </div>
                      </div> 
                    </div>
                    <div>
                      <VerifiedUserOutlinedIcon 
                        style={{fill: followUp ? "red" : "gray"}}
                        onClick={()=>{ 
                          // toast.info("Wow so easy!", 
                          //           {
                          //             position: "bottom-right", 
                          //             hideProgressBar: true,
                          //             autoClose: 1000,
                          //           }) 

                          if(isEmpty(props.user)){
                            props.updateState({showModalLogin: true})
                          }else{
                            props.followUp(item)
                          }

                          
                        }} />
                      <MoreVertOutlinedIcon 
                        onClick={handleClick} />
                    </div>
                </div>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}>
                <CopyToClipboard text={"http://localhost:8099/detail/" + item.id}>
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
                    props.updateState({showModalLogin: true})
                  }else{
                    props.updateState({showModalReport: true})
                  }

                  handleClose()
                }}>Report</MenuItem>
            </Menu> 
            
    </div>
  );
  */
};
  
export default UseFollowsItem;