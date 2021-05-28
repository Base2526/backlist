import ls from 'local-storage';
import { toast } from 'react-toastify';

export function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

export function isEmailValid(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

export const uniqueId =() => {
    let uniqueId = ls.get('uniqueId')
    if(!uniqueId){
        const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
        uniqueId = uint32.toString(16)
        ls.set('uniqueId', uniqueId)
    }
    return uniqueId;
}

export const mergeArrays = (...arrays) => {
    let jointArray = []
      
    arrays.forEach(array => {
        jointArray = [...jointArray, ...array]
    })
    const uniqueArray = jointArray.reduce((newArray, item) =>{
        let found = newArray.find(({ id }) => id === item.id);
        if (found){
            return newArray
        } else {
            return [...newArray, item]
        }
    }, [])
    return uniqueArray
}

export const isFile = (input) => {
    if ('File' in window && input instanceof File)
       return true;
    else return false;
}

export const onToast = (type, message) =>{
    switch(type){
      case 'info':{
        toast.info(message, 
        {
          position: "bottom-right", 
          hideProgressBar: true,
          autoClose: 3000,
        }) 
        break;
      }
      case 'error':{
        toast.error(message, 
          {
            position: "bottom-right", 
            hideProgressBar: true,
            autoClose: 3000,
        }) 
        break;
      }
    }
  }

export const  commaFormatted = (amount) => {
	return Number(parseFloat(amount).toFixed(2)).toLocaleString("en", {
        minimumFractionDigits: 2
    });
}