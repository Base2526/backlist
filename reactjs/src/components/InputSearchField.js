import React, { useEffect, useRef } from "react";
import CloseIcon from '@material-ui/icons/Close';
import { isEmpty } from "../utils";

const InputSearchField = (props) => {
    useEffect(() => {})

    return (
        <div>
            <label htmlFor="search" className="col-sm-5">{props.label}</label>
            <div className="col-sm-12">
                <span className="form-control-feedback" aria-hidden="true"></span>
                <div>
                    <div>
                        <input
                            type={"text"}
                            id="search"
                            className="form-control"
                            placeholder={props.placeholder}
                            name={props.name}
                            value={props.value}
                            onChange={props.onChange}
                        />
                    </div>
                    {
                        !isEmpty(props.value) 
                        ?   <div style={{cursor: "pointer"}} onClick={(e)=>{ props.onClear(e) }}><CloseIcon /></div>  
                        :   <div /> 
                    }                    
                </div>
            </div>
        </div>
    )
};

export default InputSearchField;
