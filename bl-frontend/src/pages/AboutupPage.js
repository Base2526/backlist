import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Markup } from 'interweave';
import { CircularProgress } from '@material-ui/core';
import {isEmpty} from '../utils'


const AboutupPage = (props) => {
    const history = useHistory();
    const [data, setData]  = React.useState("");

    useEffect(async() => {
        let response =  await axios.post(`/api/v1/get_html`,  {'nid':2}, { headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} });
        if(response.status === 200){
            
            let data = response.data
            console.log("/api/v1/get_html", data)
            if(data.result){
                setData(data.data)
            }
        }
    });

    return (
        isEmpty(data)
        ?   <div> <CircularProgress /> </div> 
        :   <div><Markup content={data} /></div>)
}
  
export default AboutupPage;