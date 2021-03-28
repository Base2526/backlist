export { default as Colors } from './Colors'

export const API_URL="https://banlist.info"
export const API_TOKEN="YWRtaW46U29ta2lkMDU4ODQ4Mzkx"
export const WEB_CLIENT_ID="693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com"
export const IOS_CLIENT_ID="693724870615-sctm232nea5uoce5us2l5le0mj7bi77p.apps.googleusercontent.com"
// export const API_URL_SOCKET_IO="http://143.198.223.146:3000"

export const API_URL_SOCKET_IO = () => {
    // if (process.env.NODE_ENV === 'development') {
    //     return "http://localhost:3000"
    // }else{
        return "http://143.198.223.146:3000"
    // }
}
