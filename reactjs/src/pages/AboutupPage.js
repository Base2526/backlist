import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Markup } from 'interweave';
import { CircularProgress } from '@material-ui/core';
import {isEmpty} from '../utils/Utils'

const AboutupPage = (props) => {
    const history = useHistory();
    const [data, setData]  = React.useState("");

    useEffect(() => {
        axios.post(`/api/getHTML?_format=json`, {'nid':150}, {
            headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
        })
        .then(function (response) {
            let data = response.data
            if(data.result){
                setData(data.data)
            }
        })
        .catch(function (error) {
            console.log("TermsofServicePage > error :", error)
        });
    });

    return (
        isEmpty(data)
        ?   <div> <CircularProgress /> </div> 
        :   <div><Markup content={data} /></div>)
}
  
export default AboutupPage;