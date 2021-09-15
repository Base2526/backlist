import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

function Pagination() {
  return (
    <div className="row">
      <div className="col-md-6">
        <nav className="mb-2 mt-4 mb-md-4">
          <ul className="pagination mb-0">
            <li className="page-item disabled">
              <span className="page-link">
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item active" aria-current="page">
              <span className="page-link">2</span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <span className="page-link">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="col-md-6">
        <div className="my-2 mb-4 mt-md-4 text-md-right">
          <div className="py-md-1">
            <span className="h4">60</span> <span className="h4">Items</span>
            <span className="d-inline-block ml-3 color-gray80">Page</span>
            <span className="d-inline-block ml-2 color-gray80">1/</span>
            <span className="color-gray80">3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
