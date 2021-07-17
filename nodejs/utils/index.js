const empty = (str) => {
    if(isInt(str))
        str = str.toString()

    if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === "")
        return true;
    else
        return false;
}

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

const uid = (unique_id) =>{
    if( empty(unique_id) ){
        return 0
    }

    let base64_unique_id = Buffer.from(unique_id, 'base64').toString('ascii')
    let split_unique_id = base64_unique_id.split("&")
    if(split_unique_id.length == 2){
      return Buffer.from(split_unique_id[1], 'base64').toString('ascii')
    }

    return 0
}

module.exports = {
    empty, 
    uid,
    // otherMethod,
    // anotherMethod
};