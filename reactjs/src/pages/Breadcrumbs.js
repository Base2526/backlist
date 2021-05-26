import React from "react";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";

const Breadcrumbs = (props) => {
  return (
    <div className="mb-4 bg-gray-300">
      {
        props.maintenance 
        ? <div />
        : props.crumbs.map(({ name, path }, key) =>
            key + 1 === props.crumbs.length ? (
              <span key={key} className="bold">
                {name}
              </span>
            ) : (
              <Link key={key} className="underline text-blue-500 mr-4" to={path}>
                {name} > 
              </Link>
            )
          )
      }
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
	return {
    maintenance: state.setting.maintenance
  };
}

export default connect(mapStateToProps, null)(Breadcrumbs)