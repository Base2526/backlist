import React, { useEffect } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "../../App.css";

const UseHomeItem = (props) => {
  const [item, setItem] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    // console.log('props.item : ', props.item)
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
                  props.history.push({pathname: `detail/${2222}`, state: { indexedDB:'444'} })
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
                    <div>
                      <div>รายละเอียด</div>
                      <textarea value={item.detail}/>
                    </div> 
                    <button style={{ color: 'red' }}> Follow up </button>
                    <button 
                        style={{outline: 'none !important', }}  
                        onClick={handleClick}>
                        Menu
                    </button>
                </div>
                
            
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}>
                <MenuItem onClick={handleClose}>Copy link</MenuItem>
                <MenuItem onClick={handleClose}>Report</MenuItem>
            </Menu> 
            
    </div>
  );
};
  
export default UseHomeItem;