import React, { Component } from 'react';
import { useHistory } from "react-router-dom";

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    // position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}


const Footer = (props) => {
    const history = useHistory();

    return (
        <div>
            <div style={phantom} />
            <div style={style}>
            <div>
                <div>
                    <a href='https://www.facebook.com/banlistinfo' target="_blank" >Fanpage facebook</a>
                </div>
                <div>
                    <a href='https://twitter.com/8QGI1niUcDpQPin' target="_blank">Twitter</a>
                </div>
                <div>
                    <div style={{cursor:'pointer'}} onClick={()=>{
                         history.push({pathname: `/terms-of-service`, state: {} }) 
                    }}>
                    เงื่อนไขการใช้บริการ
                    </div>
                </div>
                <div>
                    <div style={{cursor:'pointer'}} onClick={()=>{
                         history.push({pathname: `/about-up`, state: {} }) 
                    }}>
                    เกี่ยวกับเรา
                    </div>
                </div>
                <div>
                    <div style={{cursor:'pointer'}} onClick={()=>{
                         history.push({pathname: `/for-developer`, state: {} }) 
                    }}>
                    สำหรับนักพัฒนา
                    </div>
                </div>
                <div>
                    <div style={{cursor:'pointer'}} onClick={()=>{
                         history.push({pathname: `/contact-website`, state: {} }) 
                    }}>
                    ติดต่อเว็บไซต์
                    </div>
                </div>   
                {/* <div>
                    <a href="#"><img style="border-radius: 10px;" src="/{{ params['module_path'] }}/images/app-store-icon.png" alt="apple store" width="200" height="60"></a>
                </div> 
                
                <div>
                    <a href="https://play.google.com/store/apps/details?id=mrx.bl" target="_blank"><img style="border-radius: 10px;" src="/{{ params['module_path'] }}/images/googleplay-icon.jpeg" alt="google play" width="200" height="60"></a>
                </div>  */}
            </div>
            </div>
        </div>
    )
}

export default Footer