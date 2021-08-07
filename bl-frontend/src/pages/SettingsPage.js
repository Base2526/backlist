import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const SettingsPage = (props) => {
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
            {/* <button type="button" onClick={handleClick}>Go home</button> */}

            <div style={{cursor: 'pointer'}} onClick={()=>{
                  
                //   props.history.push({pathname: `/detail2/${2222}`, state: { indexedDB:'2222'} })
                }}> SettingsPage </div>
        </div>
    );
};
  
export default SettingsPage;