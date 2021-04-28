/** 
   * key-value storage
   * All storage key names used by the App are listed here and noted. For example: userInfo User Information
   * searchHistory search history arr
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// set item
export async function setItem(key, value) {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
}

// query item
export function getItem(key) {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key).then(data => {
            resolve(JSON.parse(data))
        });
    })
}

// delete item
export async function removeItem(key) {
    return await AsyncStorage.removeItem(key)
}

// Modify item: can only modify json data, can not directly modify the array data
export async function mergeItem(key, value) {
    return await AsyncStorage.mergeItem(key, JSON.stringify(value))
}

// Array delete one or more index: from the first few length: delete a few, the default is 1, can not pass
export function arrDelete(arr, index, length = 1) {
    let tempArr = arr;
    arr.splice(index, length);
    return tempArr;
}
