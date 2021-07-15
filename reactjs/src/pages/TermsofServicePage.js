import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Markup } from 'interweave';
import { CircularProgress } from '@material-ui/core';
import {isEmpty} from '../utils'
const TermsofServicePage = (props) => {
    const history = useHistory();
    const [data, setData]  = React.useState("");

    // YWRtaW46U29ta2lkMDU4ODQ4Mzkx  , bXI6MTIzNA==
    useEffect(() => {
        axios.post(`/api/getHTML?_format=json`, {'nid':3}, {
            headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`}
        })
        .then(function (response) {
            let data = response.data
            console.log('TermsofServicePage > then', data)
            if(data.result){
                setData(data.data)
            }
        })
        .catch(function (error) {
            console.log("TermsofServicePage > error :", error)

            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    });

    return (
            isEmpty(data)
            ?   <div> <CircularProgress /> </div> 
            :   <div><Markup content={data} /></div>)
}
  
export default TermsofServicePage;