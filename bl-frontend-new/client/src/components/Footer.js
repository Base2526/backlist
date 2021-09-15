// import React from "react";

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import ContactWebsiteDialog from '../pages/ContactWebsiteDialog'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import appStoreIcon from '../images/app-store-icon.png';
import googlePlayIcon from '../images/googleplay-icon.jpeg';

function Footer() {
  const history = useHistory();
  const [showModalContactWebsite, setShowModalContactWebsite]   = useState(false);

  useEffect(() => {
        
  }, [])

  return (
    <div className="bg-dark25 ">
       { showModalContactWebsite && <ContactWebsiteDialog showModal={showModalContactWebsite} onClose = {()=>{  setShowModalContactWebsite(false) }}  /> }
      <div className="w-100 box-hfoot"></div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <nav className="navbar navbar-expand-lg  px-0">
              <div className=" navbar-collapse" id="navbarNav">
                <ul className="navbar-nav font-prompt navbar-foot">
                  <li className="nav-item mr-md-2">
                    <a className="nav-link"  
                       onClick={()=> window.open("https://www.facebook.com/banlistinfo", "_blank")}>
                      Fanpage facebook{" "}
                    </a>
                  </li>
                  <li className="nav-item mr-md-2">
                    <a className="nav-link" 
                     onClick={()=> window.open("https://twitter.com/8QGI1niUcDpQPin", "_blank")}>
                      Twitter
                    </a>
                  </li>
                  <li className="nav-item mr-md-2">
                    <a className="nav-link" 
                      onClick={()=>{
                        history.push({pathname: `/terms-of-service`, state: {} }) 
                      }}>
                      เงื่อนใขการใช้บริการ
                    </a>
                    <a className="nav-link" onClick={()=>{
                        history.push({pathname: `/about-up`, state: {} }) 
                      }}>
                      เกี่ยวกับเรา
                    </a>
                    <a className="nav-link" onClick={()=>{
                         history.push({pathname: `/for-developer`, state: {} }) 
                      }}>
                      สำหรับนักพัฒนา
                    </a>
                    <a className="nav-link" onClick={()=>{
                        setShowModalContactWebsite(true)
                      }}>
                      ติดต่อเว็บไซต์
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="col-md-6">
            <div className="d-flex py-3">
              <a className="app-store w-50 pr-2 mt-lg-3"
                onClick={()=> window.open("https://apps.apple.com/", "_blank")}
                >
                <img
                  className="img-fluid"
                  src="https://www.seekpng.com/png/full/223-2231228_app-store-apple-transprent-download-on-apple-store.png"
                />

              </a>
              <a className="app-store w-50 pl-2 mt-lg-3"
                onClick={()=> window.open("https://play.google.com/store/apps/details?id=mrx.bl", "_blank")}>
                <img
                  className="img-fluid"
                  src="https://www.edsys.in/wp-content/uploads/Play-Store-Logo-2.png"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
