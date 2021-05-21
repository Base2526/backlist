import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import LoginForm from '../Setting/LoginForm'
import { isEmpty } from "../Utils/Utils";

const DetailPage = (props) => {
    const history = useHistory();

    const [item, setItem] = React.useState({});
    const [nid, setNid] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(false);
    // 
    const [showModalLogin, setShowModalLogin] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        let {match, data}  = props
        setNid(match.params.nid)
        let _data = data.find((item)=> item.id == match.params.nid)

        if(!isEmpty(_data)){
            setItem(_data)
            console.log("DetailPage _data : ", _data)

            
            /*
            images:
medium
            */ 
        }
    });

    // const handleClick = () => {
    //     history.push("/");
    // }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /*
    book_banks: ["0988174090"]
detail: "ตอนนั้นโดนมาว่าแจกมือถือฟรี ทั้งที่มันเป็นไปไม่ได้ก็จริง แต่ลองเพราะคิดว่าหลายคนก็น่าจะโดนมาก่อนแล้ว เลยมาเป็นบทเรียนให้ว่า เห็นของฟรีต้องดูให้ดี"
id: 70212
id_card_number: 0
images: {medium: Array(9), thumbnail: Array(9)}
name: "อริย์ธัช"
name_surname: "อริย์ธัช แซ่จ๊ะ"
owner_id: 1
surname: "แซ่จ๊ะ"
title: "มือถือ"
transfer_amount: 99
transfer_date: "2021-04-01"
    */
  
    return (
        <div>
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
                onClick={()=>{ 
                    // toast.info("Wow so easy!", 
                    //         {
                    //             position: "bottom-right", 
                    //             hideProgressBar: true,
                    //             autoClose: 1000,
                    //         }) 

                    if(isEmpty(props.user)){
                        setShowModalLogin(true)
                    }
                }} />
                <MoreVertOutlinedIcon 
                onClick={handleClick} />
            </div>

            <div className="row d-flex flex-row py-5"> 
                {
                    // item.images.medium
                    !isEmpty(item.images) &&  item.images.medium.map((item, index)=>{
                                                console.log(item, index)
                                                return <div style={{margin: 10, cursor:'pointer'}} onClick={()=>{ setIsOpen(true); setPhotoIndex(index); }}>  
                                                            <LazyLoadImage
                                                                className="lazy-load-image"
                                                                alt={'image.alt'}
                                                                width="250px"
                                                                height="250px"
                                                                effect="blur"
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
                    }

                    handleClose()
                }}>Report</MenuItem>
            </Menu> 

            { showModalLogin &&  <LoginForm showModal={showModalLogin} onClose = {()=>{ setShowModalLogin(false) }} />}

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