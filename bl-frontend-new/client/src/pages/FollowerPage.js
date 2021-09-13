import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Markup } from 'interweave';
import { CircularProgress } from '@material-ui/core';
import {isEmpty} from '../utils'


const FollowerPage = (props) => {
    const history = useHistory();
    const [datas, setDatas]  = React.useState([]);

    useEffect(async() => {

        return () => {
            setDatas([])
        }
    }, [])

    useEffect(async() => {
        let response =  await axios.post(`/api/v1/get_followers`,  {nid: props.match.params.nid}, { headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} });
        if(response.status === 200){
            
            let data = response.data
            console.log("/api/v1/get_followers : ", data)
            if(data.result){
                setDatas(data.datas)
            }
        }
    }, [props.match.params.nid]);

    const items = () =>{
        return  datas.map((data, idx) => {
                            return  <div key={idx}  style={{borderStyle: "dashed"}}>
                                        <div>{data.uid}</div>
                                        <div>{data.display_name}</div>
                                        <div>{data.email}</div>
                                        <div>{data.image_url}</div>
                                    </div>
                         })
    }

    return (
        isEmpty(datas)
        ?   <div> <CircularProgress /> </div> 
        :   <div>
                {
                items()
                // console.log('datas : ', datas)
                }
            </div>)
}
  
export default FollowerPage;