import ls from 'local-storage';

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