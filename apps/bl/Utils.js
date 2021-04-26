
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

// https://snack.expo.io/BktW0xdje
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
  btoa: (input)  => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

      charCode = str.charCodeAt(i += 3/4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      
      block = block << 8 | charCode;
    }
    
    return output;
  },

  atob: (input) => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
}

export const checkLogin = async () => {
  try {
    // const user = await AsyncStorage.getItem('user')
    // if(user){
    //   return JSON.parse(user)
    // }
    return ''
  } catch (e) {
    console.log('Failed to fetch the data from storage')
  }
}

export const login = async (user) => {
  try {
    // await AsyncStorage.setItem('user', JSON.stringify(user))
    console.log(user)
    console.log('Data successfully saved : login')
  } catch (e) {
    console.log('Failed to save the data to the storage')
  }
}

export const logout = async () => {
  try {
    // await AsyncStorage.setItem('user', '')
    console.log('Data successfully saved : logout')
    return {}
  } catch (e) {
    console.log('Failed to save the data to the storage')
  }
}

// this.mergeArrays([{"id":1},{"id":2},{"id":3},{"id":3},{"id":3}], [{"id":1},{"id":4},{"id":5},{"id":2}])
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

export const compare2Arrays = (a, b) =>{
  return a.length === b.length && b.length > 0 && b.every(item => a.indexOf(item) > -1)
}
// 

// https://dev.to/riversun/introducing-a-handy-javascript-date-formatting-function-5cd7
export const onFormatDate = (formatStr, date, opts) => {

  if (!date) {
      date = new Date();
  }

  opts = opts || {};

  let _days = opts.days;

  if (!_days) {
      _days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  let _months = opts.months;

  if (!_months) {
      _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  const pad = (number, strDigits, isUnpad) => {
      const strNum = Math.abs(number).toString();
      if (!isUnpad && strNum.length > strDigits.length) {
          return strNum;
      } else {
          return ('0000' + strNum).slice(-strDigits.length);
      }
  };

  const timezone = (date, letter) => {
      const chunk = [];
      const offset = -date.getTimezoneOffset();
      chunk.push(offset === 0 ? 'Z' : offset > 0 ? '+' : '-');//add Z or +,-
      if (offset === 0) return chunk;
      chunk.push(pad(Math.floor(offset / 60), '00'));//hour
      if (letter === 'X') return chunk.join('');
      if (letter === 'XXX') chunk.push(':');
      chunk.push(pad((offset % 60), '00'));//min
      return chunk.join('');
  };

  const DELIM = '\0\0';
  const escapeStack = [];

  const escapedFmtStr = formatStr.replace(/'.*?'/g, m => {
      escapeStack.push(m.replace(/'/g, ''));
      return `${DELIM}${escapeStack.length - 1}${DELIM}`;
  });

  const formattedStr = escapedFmtStr
      .replace(/y{4}|y{2}/g, m => pad(date.getFullYear(), m, true))
      .replace(/M{3}/g, m => _months[date.getMonth()])
      .replace(/M{1,2}/g, m => pad(date.getMonth() + 1, m))
      .replace(/M{1,2}/g, m => pad(date.getMonth() + 1, m))
      .replace(/d{1,2}/g, m => pad(date.getDate(), m))
      .replace(/H{1,2}/g, m => pad(date.getHours(), m))
      .replace(/h{1,2}/g, m => {
          const hours = date.getHours();
          return pad(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours, m);
      })
      .replace(/a{1,2}/g, m => date.getHours() >= 12 ? 'PM' : 'AM')
      .replace(/m{1,2}/g, m => pad(date.getMinutes(), m))
      .replace(/s{1,2}/g, m => pad(date.getSeconds(), m))
      .replace(/S{3}/g, m => pad(date.getMilliseconds(), m))
      .replace(/[E]+/g, m => _days[date.getDay()])
      .replace(/[Z]+/g, m => timezone(date, m))
      .replace(/X{1,3}/g, m => timezone(date, m));

  const unescapedStr = formattedStr.replace(new RegExp(`${DELIM}\\d+${DELIM}`, 'g'),
      m => {
          const unescaped = escapeStack.shift();
          return unescaped.length > 0 ? unescaped : '\'';
      });

  return unescapedStr;
}
