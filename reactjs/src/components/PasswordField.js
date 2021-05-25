import React, { useEffect, useRef } from "react";
const PasswordField = (props) => {
    const [showPassword, setShowPassword] = React.useState(false);
    useEffect(() => {

    })

    const onToggleEye = () =>{
        setShowPassword(!showPassword)
    } 
    
    return (
        <div>
            <label htmlFor="login-password" className="col-sm-5">{props.label}</label>
            <div className="col-sm-12">
                <span className="form-control-feedback" aria-hidden="true"></span>
                <div className="login-password-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    className="form-control"
                    placeholder={props.placeholder}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                /> 
                <div style={{cursor: "pointer"}} onClick={()=>{ onToggleEye() }}>Show / Hide</div>                        
                </div>
            </div>
        </div>
    )
}

export default PasswordField
