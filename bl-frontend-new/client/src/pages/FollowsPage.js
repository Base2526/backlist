import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import ls from 'local-storage';
import UseFollowsItem from "./UseFollowsItem";
import { followUp } from '../actions/user';

import { addContentsData, addFollowsData } from '../actions/app'
var _ = require('lodash');

const FollowsPage = (props) => {
    const history = useHistory();

    const [follows, setFollows]    = useState([]);

    useEffect(() => {
        fetch()

        return () => {
            setFollows([])
        }
    }, []);

    useEffect( async() => {
        try{
            if(!_.isEmpty(props.follows)){
                let follows_filter = props.follows.filter((o)=>{
                                                            return _.isEmpty(props.datas.find((d)=>d.nid === o.nid)) 
                                                        }).map((i)=>i.nid)

                let follows_map =   props.follows.map((o)=>{
                                        return props.datas.find((d)=>d.nid === o.nid) 
                                    }).filter((f)=>!_.isEmpty(f))

                if(!_.isEmpty(follows_filter)){
        
                    let response =  await axios.post(`/api/v1/search`, 
                                            {   type: 3,
                                                key_word: follows_filter,
                                            }, 
                                            { headers: {'Authorization': `Basic ${ls.get('basic_auth')}` } });

                    response = response.data
                    if(response.result){
                        let {execution_time, datas, count } = response;
                        props.addContentsData(datas);

                        setFollows([...follows_map, ...follows_filter.map((o)=>{ return datas.find((d)=>d.nid === o.nid) }).filter((f)=>!_.isEmpty(f)) ])
                    }
                }else{

                    setFollows(follows_map)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }, [props.follows]);

    const fetch = async() =>{
        try{
            let response =  await axios.post(`/api/v1/follows`, 
                                            { uid: props.user.uid }, 
                                            { headers: {'Authorization': `Basic ${ls.get('basic_auth')}` } });

            response = response.data
            console.log("response : ", response )
            if(response.result){
                props.addFollowsData(response.datas);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const updateState = data => {
        switch(Object.keys(data)[0]){
          case "showModalLogin":{
            // setShowModalLogin(Object.values(data)[0])
            break;
          }
          case "showModalReport":{
            // setShowModalReport(Object.values(data)[0])
            break;
          }
        }
    }

    return (
        <div>
            <h1>Your follows</h1>
            {                
                follows.map((item)=>{
                    return <UseFollowsItem 
                        {...props} 
                        item={item}
                        updateState={updateState}
                        // onModalConfirmDelete={onModalConfirmDelete}
                        // onModalConfirmUpdateStatus={onModalConfirmUpdateStatus}
                    />
                })
            }
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
	return {
        user: state.user.data,
        datas: state.app.data,
        follows: state.app.follows,
        maintenance: state.setting.maintenance
    };
}

const mapDispatchToProps = {
    followUp,

    addContentsData,
    addFollowsData,
}
  
export default connect(mapStateToProps, mapDispatchToProps)(FollowsPage)