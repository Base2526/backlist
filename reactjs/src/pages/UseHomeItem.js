import React, { useEffect } from "react";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import { toast } from 'react-toastify';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { isEmpty } from "../utils/Utils";
import ReactReadMoreReadLess from "react-read-more-read-less";

const UseHomeItem = (props) => {
  const [item, setItem] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  useEffect(() => {
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
            return(<div>1</div>)
        }

        case 2:{
            return(<div>2</div>)
        }
        case 3:{
            return(<div>3</div>)
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
    <div key={item.id} style={{margin: 10}}>  
      {/* <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Open Menu List
      </Button> */}
      
                {itemView()}
   
                <div style={{cursor: 'pointer'}} onClick={()=>{
                  // console.log('/detail/:id : ', props)
                  // /detail/:id
                  // props.history.push({pathname: `detail/${item.id}`, state: { item } })
                }}> 
                    <div>
                        <div style={{cursor: 'pointer'}} onClick={()=>{
                          props.history.push({pathname: `detail/${item.id}`, state: { item } })
                        }}> 
                      
                        <div>
                          <div>ชื่อ-นามสกุล: {item.name_surname}</div>
                        </div>

                        <div>
                          <div>สินค้า/ประเภท: {item.title}</div>
                        </div>
                        <div>
                          <div>ยอดเงิน: {item.transfer_amount}</div>
                        </div>
                        <div>
                          <div>วันโอนเงิน: {item.transfer_date}</div>
                        </div>
                      </div>
                      <div>
                        <div>รายละเอียด</div>
                        <div style={{maxWidth:"300px"}}>
                          {
                            !isEmpty(item.detail) && 
                            <ReactReadMoreReadLess
                              charLimit={50}
                              readMoreText={"Read more"}
                              readLessText={"Read less"}
                              readMoreClassName="read-more-less--more"
                              readLessClassName="read-more-less--less"
                              onClick={()=>console.log("ReactReadMoreReadLess")}
                            >
                              {item.detail}
                            </ReactReadMoreReadLess>
                          }
                          
                        </div>
                      </div> 
                    </div>
                    <div>
                      <VerifiedUserOutlinedIcon 
                        onClick={()=>{ 
                          // toast.info("Wow so easy!", 
                          //           {
                          //             position: "bottom-right", 
                          //             hideProgressBar: true,
                          //             autoClose: 1000,
                          //           }) 

                          if(isEmpty(props.user)){
                            props.updateState({showModalLogin: true})
                          }

                          /*
                          let cL = this.props.user
                          if(isEmpty(cL)){
                            _this.props.onUpdateState({showModalLogin: true})
                          }else{
                        
                            let follow_up = true;
                            if(!isEmpty(___follow_ups)){
                              let find_fup = ___follow_ups.find(value => String(value.id) === String(item.id) )
                              // console.log('fup : ', find_fup, item.id)
        
                              if(!isEmpty(find_fup)){
                                follow_up = !find_fup.follow_up
                              }
                            }

                            if(follow_up){
                              _this.props.toast.show("Follow up");
                            }else{
                              _this.props.toast.show("Unfollow up");
                            }

                            ___followUp({"id": item.id, 
                                        "local": true, 
                                        "follow_up": follow_up, 
                                        "unique_id": getUniqueId(), 
                                        "owner_id": item.owner_id, 
                                        "date": Date.now()}, 0);
                          }
                          */
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
};
  
export default UseHomeItem;