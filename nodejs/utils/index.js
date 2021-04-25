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

module.exports = {
    empty, 
    // otherMethod,
    // anotherMethod
};