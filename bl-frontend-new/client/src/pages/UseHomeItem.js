import React, { useEffect, useState } from "react";
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faCheckSquare,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";

import parse from 'html-react-parser';

import ReportDialog from './ReportDialog'
import { isEmpty, commaFormatted, ReadMore } from "../utils";

import Cards from "../components/Cards";

var _ = require('lodash');

const UseHomeItem = (props) => {
  const [item, setItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [followUp, setFollowUp] = useState(false);

  const [showModalReport, setShowModalReport] = useState(false);

  useEffect(() => {

    return () => {
      setItem({})
      setAnchorEl(null)
      setIsOpen(false)
      setPhotoIndex()
      setFollowUp()
      setShowModalReport()
    }
  }, []);

  useEffect(() => {
    setItem(props.item)

    return () => {
      setItem({})
    }
  }, [props.item]);

  useEffect(() => {
    if(!_.isEmpty(props.follows)){
      setFollowUp( _.isEmpty( (props.follows.find((el)=>el.nid === parseInt(item.nid) && el.status)) ) ? false : true )
    }
  }, [props.follows]);
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleClick = (event) => {
    console.log(typeof event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const itemView = () =>{
    // console.log('itemView :', item)

    if(Object.keys(item).length === 0 ){
        return <div />
    }

    
    if(isEmpty(item.images)){
        return <div />
    }
  
    
    let thumbnail = item.images[0]
    let medium    = item.images[1]

    // thumbnail = [{url:'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.6435-9/215541769_468809007538018_7514224006994884957_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_eui2=AeFpOyNqlQtdgtwQ8dNA_0sYjbI7gtXtJNaNsjuC1e0k1pVNF88_vEsFfEh6D5g2kkzCX0OZ2RUBIRsOcnB8BWWs&_nc_ohc=IAIr6v2N5woAX91kaO2&_nc_ht=scontent.fbkk5-1.fna&oh=f74a0901be43ddb1f0f66c6ab5307722&oe=60EDC748'}]
    // medium = [{url:'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.6435-9/215541769_468809007538018_7514224006994884957_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_eui2=AeFpOyNqlQtdgtwQ8dNA_0sYjbI7gtXtJNaNsjuC1e0k1pVNF88_vEsFfEh6D5g2kkzCX0OZ2RUBIRsOcnB8BWWs&_nc_ohc=IAIr6v2N5woAX91kaO2&_nc_ht=scontent.fbkk5-1.fna&oh=f74a0901be43ddb1f0f66c6ab5307722&oe=60EDC748'}]

    switch(thumbnail.length){
        case 0:{
          return(<div />)
        }
        case 1:{
          return(
              <div key={item.nid}> 
                  <div className="hi-container">
                      <div className="hi-sub-container1">
                          <div className="hi-item1" 
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
            return(<div key={item.nid}> 
                <div className="hi-container">
                <div className="hi-sub-container1">
                    <div className="hi-item1" 
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
                    <div className="hi-item2" onClick={()=>{ setIsOpen(true); setPhotoIndex(1); }} >
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
            return(<div key={item.nid}> 
                <div className="hi-container">
                <div className="hi-sub-container1">
                    <div className="hi-item1" 
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
                    <div className="hi-item2" onClick={()=>{ setIsOpen(true); setPhotoIndex(1); }} >
                        <LazyLoadImage
                            alt={'image.alt'}
                            width="100%"
                            height="100px"
                            effect="blur"
                            src={thumbnail[1].url} />
                    </div>
                </div>
                <div className="hi-sub-container2">
                    <div className="hi-item3" onClick={()=>{ setIsOpen(true); setPhotoIndex(2); }} >
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
            return(<div key={item.nid}> 
                        <div className="hi-container">
                        <div className="hi-sub-container1">
                            <div className="hi-item1" 
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
                            <div className="hi-item2" onClick={()=>{ setIsOpen(true); setPhotoIndex(1); }} >
                                <LazyLoadImage
                                    alt={'image.alt'}
                                    width="100%"
                                    height="100px"
                                    effect="blur"
                                    src={thumbnail[1].url} />
                            </div>
                        </div>
                        <div className="hi-sub-container2">
                            <div className="hi-item3" onClick={()=>{ setIsOpen(true); setPhotoIndex(2); }} >
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

  const menu = () =>{
    return  <Menu
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
                      props.updateState({showModalLogin: true})
                    }else{
                      // props.updateState({showModalReport: true})

                      setShowModalReport(true)
                    }

                    handleClose()
                  }}>Report</MenuItem>
            </Menu> 
  }

  const count_app_followers = () =>{
      // return (_.filter(item.app_followers, (o) => { return o.status; })).length

      if(_.has(item, 'app_followers')){
        // console.log ("item.app_followers.filter((o)=>o.status) " , ;

        return item.app_followers.filter((o)=>o.status).length
      }
      return 0;
  }

  const isFollows = () =>{
    if(!_.isEmpty(props.user)){
      // return (props.follows.find((el)=>el.nid === parseInt(item.nid) && el.status)) ? "gray" : "red"

      if(!_.isEmpty(props.follows)){
        let follow = props.follows.find((o)=>o.nid === item.nid)
        if(!_.isEmpty(follow)){
          return follow.status ? 'red' : 'gray'
        }
      }
      
    }

    return "gray"
  }

  const embedResponsive = () =>{
    if(_.isEmpty(item)){
      return <div />
    }
    
    let thumbnail = item.images[0]
    let medium    = item.images[1]

    if(_.isEmpty(thumbnail)){
      return <div />
    }

    // console.log("thumbnail :", thumbnail)
    return (
      <div>
          <div className="hi-item1" 
            onClick={()=>{ 
                setIsOpen(true); 
                setPhotoIndex(0);
            }} >
            <img
            className="embed-responsive-item"
            src={thumbnail[0].url}
            alt="thumbnail"/>
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

  return ( 
    <div className=" col-sm-6 col-lg-4 col-xl-3 ">
    <div className="card mb-3">
      <div className="embed-responsive embed-responsive-1by1">
        {/* <img
          className="embed-responsive-item"
          src="https://wallpapercave.com/wp/wp4587054.jpg"
          alt="thumbnail"
        /> */}
        {
          embedResponsive()
        }
      </div>
      <div className="card-body p-0">
        <div className="card-text px-2 py-2"
          onClick={()=>{
            props.history.push({pathname: `detail/${item.nid}`, key: item.nid, state: { item } })
          }}
          >
          <div className="d-flex subtexts ">
            <span className="title">ชื่อ-นามสกุล :</span>
            <span className="des-text">{_.isEmpty(item.name_surname) ? '' : item.name_surname.substring(0, 15)}</span>
          </div>
          <div className="d-flex subtexts">
            <span className="title">สินค้า/ประเภพ :</span>
            <span className="des-text">{_.isEmpty(item.title) ? '' : item.title.substring(0, 20)}</span>
          </div>
          <div className="d-flex subtexts">
            <span className="title">ยอดเงิน :</span>
            <span className="des-text">120,000 บาท</span>
          </div>
          <div className="d-flex subtexts">
            <span className="title">วันที่โอนเงิน :</span>
            <span className="des-text">{moment(item.transfer_date).format('MMM DD, YYYY')}</span>
          </div>

          <div className=" subtexts">
            <span className="title w-100 d-block">รายละเอียด :</span>
            <span className="des-text my-1 d-inline-block">
              {
                _.isEmpty(item.detail) ? '' : item.detail.substring(0, 100)
              }
            </span>
          </div>
        </div>
        <div className="hz-line"></div>
        <div className="card-text -foot d-flex align-items-center py-2 px-2 justify-content-between">
          <p className="m-0 tex-follow"
            onClick={()=>{
              props.history.push({pathname: `/follower/${item.nid}`, key: item.nid, state: { item } })
            }}
            >
            <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
            Followers
            <span> {count_app_followers()}</span>
          </p>
          <button className="btn bg-primary text-white">
            {/* isFollows() */}
            <FontAwesomeIcon icon={faCheckSquare} className="m-1"  color={isFollows()} />
            <FontAwesomeIcon icon={faEllipsisV} onClick={(e)=>handleClick(e)}  className="m-1" />
          </button>

          {menu()}  
        </div>
      </div>
    </div>
  </div>)
  
  // return (
  //   <div key={item.nid} style={{margin: 10}}>  
  //     {itemView()}
  //     <div style={{cursor: 'pointer'}} onClick={()=>{}}> 
  //         <div>
  //             <div style={{cursor: 'pointer'}} onClick={()=>{
  //               props.history.push({pathname: `detail/${item.nid}`, key: item.nid, state: { item } })
  //             }}> 
            
  //             <div>
  //               <div>ชื่อ-นามสกุล: {item.name_surname}</div>
  //             </div>

  //             <div>
  //               <div>สินค้า/ประเภท: {item.title} -- {item.nid}</div>
  //             </div>
  //             <div>
  //               <div>ยอดเงิน: {!isEmpty(item.transfer_amount) ? commaFormatted(item.transfer_amount) : item.transfer_amount}</div>
  //             </div>
  //             <div>
  //               <div>วันโอนเงิน: {moment(item.transfer_date).format('MMM DD, YYYY')}</div>
  //             </div>
  //           </div>
  //           <div>
  //             <div>รายละเอียด</div>
  //             <div style={{maxWidth:"300px"}}>
  //               {!isEmpty(item.detail) && <ReadMore>{parse(item.detail)}</ReadMore>}
  //             </div>
  //           </div> 
  //         </div>
  //         <div>
  //           <VerifiedUserOutlinedIcon 
  //             style={{fill:  isFollows() }}
  //             onClick={()=>{ 
  //               if(_.isEmpty(props.user)){
  //                 props.updateState({showModalLogin: true})
  //               }else{
                  
  //                 let follow = props.follows.find((o)=>o.nid === item.nid)

  //                 let status = true;
  //                 if(!_.isEmpty(follow)){
  //                   status = !follow.status;
  //                 }

  //                 props.myFollow({uid: props.user.uid, nid: item.nid, status})
  //               }
  //             }} />
  //           <MoreVertOutlinedIcon onClick={(e)=>handleClick(e)} />
  //           <div onClick={()=>{
  //             props.history.push({pathname: `/follower/${item.nid}`, key: item.nid, state: { item } })
  //           }}>
  //             { count_app_followers() } follower
  //           </div>
  //         </div>
  //     </div>
  //     {menu()}  

  //     { showModalReport && <ReportDialog {...props} showModal={showModalReport} onClose = {()=>{  setShowModalReport(false) }}  /> }
  //   </div>
  // );
};
  
export default UseHomeItem;