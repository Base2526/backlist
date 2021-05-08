import React, { Component } from 'react';

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

function Footer({ children }) {
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
                    <a href='/node/149'>เงื่อนไขการใช้บริการ</a>
                </div>
                <div>
                    <a href='/node/150'>เกี่ยวกับเรา</a>
                </div>
                <div>
                    <a href='/node/151'>สำหรับนักพัฒนา</a>
                </div>
                <div>
                    <a href='/contact/feedback'>ติดต่อเว็บไซต์</a>
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