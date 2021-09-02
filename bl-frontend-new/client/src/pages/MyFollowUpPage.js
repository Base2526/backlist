import React, { useEffect, useState, useRef } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import UseMyFollowUpItem from "./UseMyFollowUpItem";
import { followUp } from '../actions/user';

const useHasChanged= (val) => {
    const prevVal = usePrevious(val)
    return prevVal !== val
}

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

const MyFollowUpPage = (props) => {
    const history = useHistory();

    const [followUp, setFollowUp]     = useState([]);
    const hasVal1Changed = useHasChanged(props.follow_ups)

    useEffect(() => {
        // if(prevFollowUp !== props.follow_ups){
        //     console.log('MyFollowUpPage useEffect : props > ', props.follow_ups)

        //     let follow_ups = props.follow_ups.filter((el)=>el.status);
        //     setFollowUp(follow_ups)
        // }

        // console.log('MyFollowUpPage useEffect : props > ', prevFollowUp)

        // let follow_ups = props.follow_ups.filter((el)=>el.status);
        // setFollowUp(follow_ups)
        
        if(hasVal1Changed){
            console.log("hasVal1Changed #1")
            let follow_ups = props.follow_ups.filter((el)=>el.status);
            


            // res = arr.filter(f => !brr.includes(f));

            // data

            // var arr = [1,2,3,4],
            //     brr = [2,4],
            //     res = arr.filter(f => brr.includes(f));
            // console.log("res : ", res);
// 
            follow_ups = props.data.filter(el => follow_ups.some(ell => ell.id === el.id) );
            setFollowUp(follow_ups)
        }else{
            console.log("hasVal1Changed #2")
        }
    });

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
  
    return (<div className="container mb-5">
                <div className="row d-flex flex-row py-5"> 
                {
                followUp.map(item => (
                    <UseMyFollowUpItem 
                        {...props} 
                        item={item}
                        updateState={updateState}
                        followUp={(data)=>{
                            props.followUp(data)
                        }}/>
                ))
                }
                </div>
            </div>)
}

const mapStateToProps = (state, ownProps) => {
	return {
        user: state.user.data,
        follow_ups: state.user.follow_ups,
        data: state.app.data,

        maintenance: state.setting.maintenance
    };
}

const mapDispatchToProps = {
    followUp,
}
  
export default connect(mapStateToProps, mapDispatchToProps)(MyFollowUpPage)