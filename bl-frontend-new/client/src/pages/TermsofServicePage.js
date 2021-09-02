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
    useEffect(async() => {
        try {
            let response =  await axios.post(`/api/v1/get_html`,  {'nid':3}, { headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} });
            if(response.status === 200){
                let data = response.data
                console.log("/v1/get_html", data)
                if(data.result){
                    setData(data.data)
                }
            }
        } catch (error) {
        }
    });

    return (
            isEmpty(data)
            ?   <div> <CircularProgress /> </div> 
            :   <div><Markup content={data} /></div>)
}
  
export default TermsofServicePage;