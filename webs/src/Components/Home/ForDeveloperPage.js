import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

const ForDeveloperPage = (props) => {
    const history = useHistory();

    useEffect(() => {
        // let {item} = props.location.state
        // let {id} = props.match.params
        // console.log('DetailPage useEffect : props > ', props, item)
    });
  
    return (
        <div> ForDeveloperPage </div>
    )
}
  
export default ForDeveloperPage;