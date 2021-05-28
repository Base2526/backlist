import { toast } from 'react-toastify';
// const helpers = {
//     fetchApi: function(){

//     }
// }

// export const userLogin = (user) => ({
//     type: types.AUTH_LOGIN,
//     user
// });
export const assets = 'yuuu';

export function headers() {
    return { 'Content-Type': 'application/json', 'authorization': 'aHVheQ==' };
}

/*
การเรียกใช้งาน
1.import { authHeader, assets } from '../Config'; 

2.สามารถเรียกใช้ authHeader() < function, assets < ตัวแปล
*/
export function showToast(type, title, autoClose=1500) {
    switch(type){
        case 'success':{
            toast.success(title , {containerId: 'toast_container_id', autoClose});
        break;
        }

        case 'error':{
            toast.error(title , {containerId: 'toast_container_id', autoClose});
        break;
        }

        case 'warn':{
            toast.warn(title , {containerId: 'toast_container_id', autoClose});
        break;
        }

        case 'info':{
            toast.info(title , {containerId: 'toast_container_id', autoClose});
        break;
        }
    }   
}

export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export function getCurrentDate(separator=''){
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${date<10?`0${date}`:`${date}`}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
}

export function getCurrentTime(){
    let newDate = new Date()
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();

    return `${hours<10?`0${hours}`:`${hours}`}:${minutes<10?`0${minutes}`:`${minutes}`}`
}

 /*
  0 : 06.00   15 *0 
  1 : 06.15   15 *1
  2 : 06.30   15 *2
  3 : 06.45   15 *3
  4 : 07.00   15 *4
  5 : 07.15   15 *5 = 75
  6 : 07.30   15 *6 = 90
  7 : 07.45   15 *7 = 105
  8 : 08.00   15 *8 = 120
  9 : 08.15
  10: 08.30
  11: 08.45
  12: 09.00
  13: 09.15   15 *13 = 195
  14: 09.30
  15: 09.45
  16: 10.00
  17: 10.15
  18: 10.30
  19: 10.45
  20: 11.00
  21: 11.15
  22: 11.30
  23: 11.45
  24: 12.00
  25: 12.15
  26: 12.30
  27: 12.45


  80: 01.45      15 *80 = 1200
  */
export function getTime(round, is_yeekee = true){
    /*
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    let seconds = newDate.getSeconds();
    
    console.log(hours, minutes, seconds)

    var dt = new Date();
    // dt.setMinutes( dt.getMinutes() + 1320 );
    console.log(dt)

    // var t = new Date( 1588719600000 );
    // var formatted = t.format("dd.mm.yyyy hh:MM:ss");
    // console.log(formatted) 1588782391000
    var dateTime = new Date();
    // dateTime.toISOString(); 
    // dateTime.setMinutes( dateTime.getMinutes() + 195 );
    console.log(dateTime)
    */
    //  let newDate = new Date()
    //  let hours = newDate.getHours();
    //  let minutes = newDate.getMinutes();
    //  let seconds = newDate.getSeconds();
    //  var now = new Date().getTime();
    //  console.log(hours, minutes, seconds, new Date().getTime(), now)

    // let newDate = (new Date()) + 1;
    // newDate.setHours(parseInt('06'));
    // newDate.setMinutes(0);
    // newDate.setSeconds(0);
    // console.log(newDate)

    /*
    var date = new Date();
    // add a day
    date.setDate(date.getDate() + 1);

    console.log(date);
    */
 

    /*
    let fixDate = new Date(); // for 3:00:00 pm
    fixDate.setHours(parseInt('2'));
    fixDate.setMinutes(0);
    fixDate.setSeconds(0);

    let currDate = new Date();
    let diff = fixDate-currDate ;

    const hours = Math.floor(diff/(60*60*1000));
    const mins = Math.floor((diff-(hours*60*60*1000))/(60*1000));
    const secs = Math.floor((diff-(hours*60*60*1000)-(mins*60*1000))/1000);

    console.log(hours, mins, secs);
    */

    
    return -1;
    

    if(is_yeekee){
        let arr_end_time =round.end_time.split(".");
        // console.log(round);
       
        let hours =0;
        let mins =0;
        let secs =0;
    
        let currDate = new Date();
    
        // กรณีรอบ 73 จะเป็นรอบหลังเที่ยงคืนเรา + 1 date ค่อยคำนวณเวลาถึงจะถูกต้อง
        if(parseInt(round.name) > 72 ){
            
    
            let fixDate = new Date();
            if( currDate.getHours() >= 5 && currDate.getHours() <= 23 ){
                fixDate.setDate(fixDate.getDate() + 1);
            }
        
            fixDate.setHours(parseInt(arr_end_time[0]));
            fixDate.setMinutes(parseInt(arr_end_time[1]));
            fixDate.setSeconds(0);
    
            let diff = fixDate-currDate ;
    
            hours = Math.floor(diff/(60*60*1000));
            mins = Math.floor((diff-(hours*60*60*1000))/(60*1000));
            secs = Math.floor((diff-(hours*60*60*1000)-(mins*60*1000))/1000);
            // console.log(hours, mins, secs);  
        }else{
            let fixDate = new Date(); // for 3:00:00 pm
            if(currDate.getHours() >= 0 && currDate.getHours() <= 5){
                fixDate.setDate(fixDate.getDate() - 1);
            }
    
            fixDate.setHours(parseInt(arr_end_time[0]));
            fixDate.setMinutes(parseInt(arr_end_time[1]));
            fixDate.setSeconds(0);
    
            let diff = fixDate-currDate ;
    
            hours = Math.floor(diff/(60*60*1000));
            mins = Math.floor((diff-(hours*60*60*1000))/(60*1000));
            secs = Math.floor((diff-(hours*60*60*1000)-(mins*60*1000))/1000);
            // console.log(hours, mins, secs);
        }
    
        // console.log(hours);
        if(hours < 0){
            return -1;
        }
    
        return `${hours<10?`0${hours}`:`${hours}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`
    }else{
        
        let arr_end_time =round.end_time.split(".");
   
        let hours =0;
        let mins =0;
        let secs =0;
    
        let currDate = new Date();
    
        let fixDate = new Date(); 
        fixDate.setHours(parseInt(arr_end_time[0]));
        fixDate.setMinutes(parseInt(arr_end_time[1]));
        fixDate.setSeconds(0);
    
        let diff = fixDate-currDate ;
    
        hours = Math.floor(diff/(60*60*1000));
        mins = Math.floor((diff-(hours*60*60*1000))/(60*1000));
        secs = Math.floor((diff-(hours*60*60*1000)-(mins*60*1000))/1000);
    
        if(hours < 0){
            return -1;
        }
    
        return `${hours<10?`0${hours}`:`${hours}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`
    }

}

// https://jsfiddle.net/user2314737/jr5jkv1p/
export function getTimeWithDate(round){

    return -1;

    let date =round.date.split("-");
    let arr_end_time =round.end_time.split(".");

    let currDate = new Date();

    let fixDate = new Date();
    fixDate.setDate(date[2]);
    fixDate.setHours(parseInt(arr_end_time[0]));
    fixDate.setMinutes(parseInt(arr_end_time[1]));
    fixDate.setSeconds(0);
    
    var date1_ms = currDate.getTime()
    var date2_ms = fixDate.getTime()
    
    var msec = date2_ms - date1_ms;
    let secs = Math.floor( msec / 1000 ) % 60;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
 
    // "In days: ", days + " days, " + hrs + " hours, " + mins + " minutes"
    //  console.log("In days : " + days + ", hrs : " + (hrs % 24) + ", mins : " + (mins % 60))

    hrs = hrs % 24;
    mins = mins % 60;

    if(hrs < 0){
        return -1;
    }
   
    if(days > 0){
        return `${`${days} วัน`} ${hrs<10?`0${hrs}`:`${hrs}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`
    }

    return `${hrs<10?`0${hrs}`:`${hrs}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`
}

// https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
export function convertTimestamp2Date(unixtimestamp){

    // Months array
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Convert timestamp to milliseconds
    var date = new Date(unixtimestamp*1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Hours
    var hours = date.getHours();

    // Minutes
    var minutes = "0" + date.getMinutes();

    // Seconds
    var seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    return month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

/*

  let currDate = new Date();

  let fixDate = new Date();
  fixDate.setDate(16);
  fixDate.setHours(15);
  fixDate.setMinutes(20);
  fixDate.setSeconds(0);

  var date1_ms = currDate.getTime()
  var date2_ms = fixDate.getTime()

  var msec = date2_ms - date1_ms;
  let secs = Math.floor( msec / 1000 ) % 60;
  var mins = Math.floor(msec / 60000);
  var hrs = Math.floor(mins / 60);
  var days = Math.floor(hrs / 24);
  var yrs = Math.floor(days / 365);

  // "In days: ", days + " days, " + hrs + " hours, " + mins + " minutes"
  console.log("In days : " + days + ", hrs : " + (hrs % 24) + ", mins : " + (mins % 60) + ", secs : " + secs)
*/

// https://www.tutorialspoint.com/How-to-get-time-difference-between-two-timestamps-in-seconds
export function difference_between_two_timestamps(date){
    let date1    = new Date();
    let date2    = new Date(date);

    var res = Math.abs(date1 - date2) / 1000;

    //console.log(date1);
    //console.log(date2);

    // get hours        
    var hours = Math.floor(res / 3600) % 24;    
    // get minutes
    var minutes = Math.floor(res / 60) % 60;
    // get seconds
    var seconds = Math.floor(res % 60);

    return ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) +':'+ ("0" + seconds).slice(-2);
}