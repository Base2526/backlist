import React, { useEffect, useRef } from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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
                <div>
                    <div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="login-password"
                            className="form-control"
                            placeholder={props.placeholder}
                            name={props.name}
                            value={props.value}
                            onChange={props.onChange}
                        /> 
                    </div>
                    <div style={{cursor: "pointer"}} onClick={()=>{ onToggleEye() }}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </div>                        
                </div>
            </div>
        </div>
    )
}

export default PasswordField
