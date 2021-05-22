import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import axios from 'axios';

const TermsofServicePage = (props) => {
    const history = useHistory();
    const [data, setData]  = React.useState("");

    useEffect(() => {
        // let {item} = props.location.state
        // let {id} = props.match.params
        // console.log('DetailPage useEffect : props > ', props, item)
    
        axios.post(`/api/getHTML?_format=json`, {}, {
            headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
        })
        .then(function (response) {
            console.log('TermsofServicePage > response : ', response)

            let data = response.data
            if(data.result){
                console.log('TermsofServicePage > data : ', data.data)
                setData(data.data)
            }
        })
        .catch(function (error) {
            console.log("TermsofServicePage > error :", error)
        });
    });
  
    return (
        <div>{data}</div>
    )
}
  
export default TermsofServicePage;