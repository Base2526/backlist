import React, { Component, Fragment } from "react";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";

import "../../App.css";

const images = [
    "https://i.guim.co.uk/img/media/c8b1d78883dfbe7cd3f112495941ebc0b25d2265/256_0_3840_2304/master/3840.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=0ebb076ef0230a62f8c1a7f9127a487a",
    "https://banlist.info/sites/default/files/blacklist_seller/73930_screenshot_2021-04-04-15-58-10-75.jpg",
    "https://i.guim.co.uk/img/media/c8b1d78883dfbe7cd3f112495941ebc0b25d2265/256_0_3840_2304/master/3840.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=0ebb076ef0230a62f8c1a7f9127a487a",
    "https://i.guim.co.uk/img/media/c8b1d78883dfbe7cd3f112495941ebc0b25d2265/256_0_3840_2304/master/3840.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=0ebb076ef0230a62f8c1a7f9127a487a"
  ];


class HomeItem extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            isOpen: false,
            isOpenMenu: false,
            photoIndex: 0
        }
    }

    componentDidMount(){    
    }

    handleClick = () =>{
        console.log('handleClick')

        this.setState({isOpenMenu:true})
    }

    handleClose = () =>{
        console.log('handleClose')

        this.setState({isOpenMenu:false})
    }

    render() {

        let {isOpen, isOpenMenu, photoIndex} = this.state
        return (
            <div style={{margin: 10}}>  
                <button 
                    tyle={{outline: 'none !important'}}  
                    onClick={()=>{
                        // this.setState({isOpen:true})
                        this.handleClick()
                    }}>
                    Open Lightbox
                </button>

                <Menu
                    keepMounted
                    // anchorEl={anchorEl}
                    onClose={()=>{this.handleClose()}}
                    open={isOpenMenu}
                >
                    <MenuItem onClick={()=>{this.handleClose()}}>My Account</MenuItem>
                    <MenuItem onClick={()=>{this.handleClose()}}>Settings</MenuItem>
                    <MenuItem onClick={()=>{this.handleClose()}}>Profile</MenuItem>
                    <MenuItem onClick={()=>{this.handleClose()}}>Logout</MenuItem>
                </Menu>

                <div class="hi-container">
                    <div class="hi-sub-container1">
                        <div class="hi-item1"></div>
                        <div class="hi-item2"></div>
                    </div>
                    <div class="hi-sub-container2">
                        <div class="hi-item3"></div>
                    </div>

                </div>
                <div> Content </div>
                {
                    isOpen && <Lightbox
                                mainSrc={images[photoIndex]}
                                nextSrc={images[(photoIndex + 1) % images.length]}
                                prevSrc={images[(photoIndex + images.length - 1) % images.length]}

                                // mainSrcThumbnail={images[photoIndex]}
                                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                                onCloseRequest={() => this.setState({ isOpen: false })}

                                onMovePrevRequest={() =>
                                this.setState({
                                    photoIndex: (photoIndex + images.length - 1) % images.length
                                })
                                }
                                onMoveNextRequest={() =>
                                this.setState({
                                    photoIndex: (photoIndex + 1) % images.length
                                })
                                }
                            />
                }        
            </div>
        );
    }
}

export default HomeItem;
