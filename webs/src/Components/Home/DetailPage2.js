import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "../../App.css";

const DetailPages2 = (props) => {
    const history = useHistory();

    useEffect(() => {
        console.log('DetailPages2 useEffect')
    });

    const handleClick = () => {
        history.push("/detail/2222");
    }
  
    return (
        <div>
            <button type="button" onClick={handleClick}>Go home detail2</button>
        </div>
    );
};
  
export default DetailPages2;