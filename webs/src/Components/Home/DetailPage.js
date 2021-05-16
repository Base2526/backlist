import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "../../App.css";

const DetailPage = (props) => {
    const history = useHistory();

    useEffect(() => {
        console.log('DetailPage useEffect')
    });

    const handleClick = () => {
        history.push("/");
    }

    // detail2
  
    return (
        <div>
            <button type="button" onClick={handleClick}>Go home</button>

            <div style={{cursor: 'pointer'}} onClick={()=>{
                  
                  props.history.push({pathname: `/detail2/${2222}`, state: { indexedDB:'2222'} })
                }}> detail </div>
        </div>
    );
};
  
export default DetailPage;