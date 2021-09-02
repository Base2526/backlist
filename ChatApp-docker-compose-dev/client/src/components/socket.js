// import io from "socket.io-client"
const io = require('socket.io-client');

console.log("My Server URL :"+window.location.href)


const socket = io(window.location.href, {
                                            query: {
                                                "platform" : "process.env.REACT_APP_PLATFORM", 
                                            },
                                        });
export default socket