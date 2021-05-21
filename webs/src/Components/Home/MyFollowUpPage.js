import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';

const MyFollowUpPage = (props) => {
    const history = useHistory();

    useEffect(() => {
        // let {item} = props.location.state
        // let {id} = props.match.params
        // console.log('DetailPage useEffect : props > ', props, item)
    });

    const handleClick = () => {
        history.push("/");
    }
  
    return (
        <div>
            {
            ['1', '2', '3', '4', '5'].map(item => (
                <div key={item} className="notifications-item">
                    <div>40+ items were just added to your buy and sell groups.</div>
                    <div> 11 hours ago </div>
                    <MoreVertOutlinedIcon onClick={()=>{console.log('*')}} />
                </div>
            ))
            }
        </div>
    )
}
  
export default MyFollowUpPage;