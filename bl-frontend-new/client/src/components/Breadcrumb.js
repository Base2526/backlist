import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/fontawesome-free-regular";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { connect } from 'react-redux'
import { Link } from "react-router-dom";

// const Bread = (props) => (
//   <ol className="breadcrumb bg-transparent my-0 py-2">
//     <li className="breadcrumb-item" aria-current="page">
//       <a key={key} href="#" title="home">
//         <FontAwesomeIcon icon={faHome} /> หน้าหลัก
//       </a>
//     </li>
//   </ol>
// );

function Breadcrumb(props) {
  return (
    <div className="w-100 mt-3 mb-2">
      {/* <Bread {...props}/> */}

      <ol className="breadcrumb bg-transparent my-0 py-2">
      {
        props.crumbs.map(({ name, path }, key) =>
          {
            if(props.crumbs.length == 1){
              return (<li key={key} className="breadcrumb-item" aria-current="page">
                        <a href={path} title={name}>
                          <FontAwesomeIcon icon={faHome} /> {name}
                        </a>
                      </li>
                    )
            }

            if(key + 1 === props.crumbs.length){
              return (
                      <li key={key} className="breadcrumb-item" aria-current="page">
                        {name}
                      </li>
                    )
            }else{
              if(key == 0 ){
                return (<li  key={key} className="breadcrumb-item" aria-current="page">
                          <a href={path} title={name}>
                            <FontAwesomeIcon icon={faHome} /> {name}
                          </a>
                        </li>)
              }else{
                return (<li  key={key} className="breadcrumb-item" aria-current="page">
                          <a href={path} title={name}> {name} </a>
                        </li>)
              }
            }
          }
        )
      }
      </ol>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
	return {
    maintenance: state.setting.maintenance
  };
}

export default connect(mapStateToProps, null)(Breadcrumb)