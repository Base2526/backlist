
// export function TestFunc1() {
//     return 'TestFunc1';
// }

export function NumberFormat(number) {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function ValidateEmail(email){
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email || reg.test(email) === false){
        // this.setState({emailError:"Email Field is Invalid"});
        return false;
    }
    return true;
}

export function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

export function toTimestamp(strDate){ var datum = Date.parse(strDate); return datum/1000;}