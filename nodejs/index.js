const mongoose = require("mongoose");
var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongojs = require('mongojs');

const config    = require('./config')

var ObjectID = mongojs.ObjectID;
// mongodb://admin:password@localhost:27017/db
// var db = mongojs("mongodb://mongo:27017/bl");
var app = express();
var server = http.Server(app);
var io = socketio(server);

const socketsModel       = require('./models/sockets');
const usersModel         = require('./models/users');
const followerPostModel  = require('./models/follower_post');
const notificationsModel = require('./models/notifications')

const connection = require("./connection")

const {empty} = require("./utils")

require('./log-interceptor')(server);

connection().then((db) => {
  console.log("MongoDb connected");
});

server.listen(3000, () => console.log('listening on *:3000'));

// For POST-Support
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpPostSearch = () => {
  return new Promise((resolve, reject) => {
    // http.get(url, res => {
    //   res.setEncoding('utf8');
    //   let body = ''; 
    //   res.on('data', chunk => body += chunk);
    //   res.on('end', () => resolve(body));
    // }).on('error', reject);

    const data = JSON.stringify({ type: 0, key_word: '*', offset: 0 })
    var options = {
      host: 'banlist.info',
      port: 80,
      path: '/api/search?_format=json',
      method: 'POST',
      json: true,
      headers: {'Authorization': 'Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx', 
      'Content-Type': 'application/json',
      'Content-Length': data.length,}
    };
    const reqx = http.request(options, (res) =>{
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      let body = ''; 
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk
      });

      res.on('end', () => {
        resolve(body)
      }
      );
    }).on('error', reject);

    reqx.write(data)
    reqx.end();
  });
};

app.post('/api/hello', async(req, res) => {
  // db.collection('sockets').insert(res, (err, message) => {
  //   console.log(err)
  //   console.log(message)
  // })
  
  // const body = await httpPostSearch();
  // console.log('body >>> ', body)

  // console.log("empty :", empty(1))

  // console.log(req)

  console.log(req.body)

  let {uid, item} = req.body

  await notification_center(1, uid, item);

  res.send({ express: config.mongo.url });
});

// case login will add uid to socketsModel and logout will clear uid for socketsModel
app.post('/api/login', async(req, res) => {
  try {
    console.log(req.body)
    
    let {unique_id, uid} = req.body
    if( empty(unique_id) || empty(uid) ){    
      res.status(404).send({'message': 'ERROR'});
    }else{

      socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { uid }, {
        new: true,
        upsert: true 
      },function( error, result){
        // In this moment, you recive a result object or error
        console.log(result)
      });

      let user = await usersModel.findOne({ uid });
      var followUps = user.follow_ups.toObject();
      // let fs = await socketsModel.findOne({ uniqueId: unique_id });
      // if ( fs !== null ){
      //   if(fs.socketId){
      //     console.log(fs.socketId)
      //     io.to(fs.socketId).emit('follow_up', JSON.stringify(followUps));
      //   }
      // }

      res.status(200).send({'result': true, 'message': 'OK', 'followUps': JSON.stringify(followUps)});
    }
  } catch (err) {
    res.status(500).send({errors: err});
  }
});

app.post('/api/logout', (req, res) => {
  try {
    console.log(req.body)
    
    let {unique_id, uid} = req.body
    if( empty(unique_id) || empty(uid)){    
      res.status(404).send({'message': 'ERROR'});
    }else{

      socketsModel.findOneAndUpdate({ uniqueId: unique_id, uid }, { uid: '' }, {
        new: true,
        upsert: true 
      },function( error, result){
        // In this moment, you recive a result object or error
        console.log(result)
      });

      res.status(200).send({'message': 'OK'});
    }
  } catch (err) {
    res.status(500).send({errors: err});
  }
});

app.post('/api/update_profile', async(req, res) => {
  try {
    console.log(req.body)
    
    let { uid } = req.body
    if( empty(uid) ){    
      res.status(404).send({ 'result': false });
    }else{
      let fs = await socketsModel.findOne({ uid });
      if ( fs !== null ){
        if(fs.socketId){
          // console.log(fs.socketId)
          io.to(fs.socketId).emit('update_profile', {});
        }
      }

      res.status(200).send({ 'result': true });
    }
  } catch (err) {
    res.status(500).send({ 'result': false, 'message': err});
  }
});

app.post('/api/follow_up', async (req, res) => {
  try {
    console.log(req.body)
    
    let { uid, id_follow_up, unique_id, owner_id } = req.body
    if( empty(uid) || empty(id_follow_up) || empty(unique_id) || empty(owner_id)){    
      res.status(404).send({'message': 'ERROR'});
    }else{
      let user = await usersModel.findOne({ uid });
      
      if ( user === null ){
        await new usersModel({ uid, followUps: [id_follow_up]}).save()
      }else{
        var followUps = user.followUps.toObject();
        
        var message = 'Follow up'
        if(followUps.includes(id_follow_up)){
          followUps = followUps.filter((v) => {return v != id_follow_up})

          var message = 'Upfollow up'
        }else{
          followUps = [...followUps, id_follow_up]
        }

        let um = await  usersModel.findOneAndUpdate({ uid }, { uid, followUps }, {
          new: true,
          upsert: true 
        });

        if ( um !== null ){
          let fss = await socketsModel.find({ uid });
          if ( fss !== null ){
            fss.map((obj, i) => {
              if(obj.socketId){
                io.to(obj.socketId).emit('follow_up', JSON.stringify(followUps));
              }
            })
          }
        }

        // let fp = await onFollowerPost(uid, id_follow_up, unique_id, owner_id);
        console.log('fp : ', fp);

        res.status(200).send({'result': true, 'message': message});
      }
    }
    
    res.status(200).send({'result': true, 'message': 'OK'});
  } catch (err) {
    res.status(500).send({'result': false, errors: err});
  }
});

app.post('/api/fetch____follow_up', async (req, res) => {
  try {
    console.log("/api/fetch____follow_up > req.body : ", req.body)
    
    let {uid} = req.body

    if(empty(uid)){
      res.status(300).send({'result': false, message: 'empty uid'});
    }else{
      let user = await usersModel.findOne({ uid });
      res.status(200).send({'result': true, 'message': 'OK', 'followUps': JSON.stringify(user.follow_ups.toObject())});
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({'result': false, errors: err});
  }
});

app.post('/api/follower_post', async (req, res) => {
  try {
    console.log(req.body)
    
    let { posts } = req.body
    if( !posts ){    
      return res.status(404).send({'result': false});
    }
    let follower_post =  await Promise.all( posts.map(async(post_id)=>{ return await followerPostModel.findOne({ post_id }); }))
    // console.log('follower_post : ', follower_post)

    let fp = []
    follower_post.map((itm)=>{ 
      if ( itm !== null ){
        fp = [...fp, {"post_id": itm.post_id, 'follower': itm.follower.toObject()} ]
      }
    })
    
    return res.status(200).send({'result': true, 'follower_post': JSON.stringify(fp)});
  } catch (err) {
    console.log(err)
    return res.status(500).send({'result': false, errors: err});
  }
});

app.post('/api/my_apps', async (req, res) => {
  try {
    console.log(req.body)
    
    let { uid } = req.body
    if(empty(uid)){    
      res.status(404).send({'message': 'ERROR'});
    }else{
      let fs = await socketsModel.findOne({ uid });
      if ( fs !== null ){
        if(fs.socketId){
          io.to(fs.socketId).emit('my_apps', 'for your eyes only');
        }
      }
    }
    
    res.status(200).send({'message': 'OK'});
  } catch (error) {
    res.status(500).send({error: error});
  }
});

app.post('/api/___follow_up', async(req, res) => {
  try {
    let {uid, follow_ups} = req.body
    if( empty(uid) || empty(follow_ups) ){    
      res.status(500).send({errors: "params"});
    }else{
      let user = await usersModel.findOne({ uid });
      follow_ups.map( async item=>{
        // return {...item, local:false}
  
        let { unique_id, owner_id } = item
        if( empty(unique_id) || empty(owner_id)){    
          // return res.status(404).send({'message': 'ERROR'});
          console.log("___follow_up > !unique_id || !owner_id")
        }else{
          item.local = false // update all local = false
          if ( user === null ){
            await new usersModel({ uid, follow_ups: [item]}).save()
          }else{
            let find_user = await usersModel.findOne({ "follow_ups.id": item.id })
            // console.log('find_user : ', find_user)
            let noti = false
            if ( find_user === undefined || find_user === null ) {
              console.log("insert new")
  
              noti = true
              
              await usersModel.findOneAndUpdate(
                          { uid },
                          { $push: { follow_ups: item } },
                          { new: true, upsert: true }
                        );
  
            }else{
              find_user = find_user.toObject();
              // console.log("update : ", find_user.follow_ups)
  
              let fi = find_user.follow_ups.find(e => String(e.id) === String(item.id) );
              if(fi !== undefined){
                if(fi.date < item.date){
                  await usersModel.updateOne({ uid, "follow_ups.id": item.id }, 
                                  {'$set': 
                                    {
                                      'follow_ups.$.date': item.date,
                                      'follow_ups.$.local': false,
                                      'follow_ups.$.follow_up': item.follow_up
                                    }
                                  }
                              )
  
                  console.log("update new : ", item)
  
                  noti = true
  
                  
                }
              }
            }
  
            if(noti){
              let fss = await socketsModel.find({ uid });
              if ( fss !== null ){
  
                user = await usersModel.findOne({ uid });
                user = user.toObject()
                fss.map((obj, i) => {
                  console.log('obj.socketId : >>> ', obj, user.follow_ups)
                  if(obj.socketId){
                    io.to(obj.socketId).emit('___follow_up', JSON.stringify(user.follow_ups));
                  }
                })
              }
  
              await onFollowerPost(uid, item);
              await notification_center(1, uid, item);

              console.log('noti : >>> if :  ', noti)
            }else{
              console.log('noti : >>> else :  ', noti)
            }
          }
        }
      })
      res.status(200).send({ 'result': true });
    }
  } catch (error) {

    console.log('/api/___follow_up err : >>> ', error)
    res.status(500).send({errors});
  }
});

app.post('/api/fetch_notification', async (req, res) => {
  try {
    console.log(req.body)
    
    let { uid } = req.body

    if(empty(uid)){    
      res.status(404).send({'message': 'ERROR'});
    }else{
      let notifications_model = await notificationsModel.findOne({ uid });      
      res.status(200).send({'result': true, 'message': 'OK', 'notification': JSON.stringify( notifications_model.notification.toObject() )});
    }
  } catch (err) {
    res.status(500).send({errors: err});
  }
});

// follower_post
async function noti_follower_post(uid, post_id, follower ) {

  let fss = await socketsModel.find({ uid });
  if ( fss !== null ){
    // case uid have muli devices
    fss.map((obj, i) => {
      if(obj.socketId){
        io.to(obj.socketId).emit('follower_post', JSON.stringify({'post_id': post_id, 'follower':follower}) );
      }
    })
  }
}

async function onFollowerPost(uid, item  /*, id_follow_up, unique_id, owner_id*/) {
  try {

    /*
    date: 1619190378575
follow_up: false
id: 69677
local: false
owner_id: 1
uid: "59"
unique_id: "BF540C0D-FCB3-4D44-B779-AEC52EF68F91"
    */

    // console.log("onFollowerPost  >>>>", item)

    let { id, unique_id, owner_id, follow_up } = item
    if( empty(unique_id) ||  empty(owner_id)){    
      // return res.status(404).send({'message': 'ERROR'});
      console.log("onFollowerPost : !unique_id || !owner_id")
    }else{

      
      // followerPostModel.updateOne( // select your doc in moongo
      //   { post_id: id }, // your query, usually match by _id
      //   { $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } }, // item(s) to match from array you want to pull/remove
      //   { multi: true } // set this to true if you want to remove multiple elements.
      // )
      // { $push: { follow_ups: item } },

      if(!follow_up){
        await followerPostModel.findOneAndUpdate( { post_id: id }, {$pull: {follower: uid}} );
      }else{

        let followerPost = await followerPostModel.findOne({ post_id: id });
        if ( followerPost === null ){
          await new followerPostModel({ post_id: id, follower: [uid]}).save()

          await noti_follower_post(uid, id, [uid])
        }else{
          /*
            find_user = find_user.toObject();
            // console.log("update : ", find_user.follow_ups)

            let fi = find_user.follow_ups.find(e => String(e.id) === String(item.id) );
            if(fi !== undefined){
          */

            followerPost = followerPost.toObject();
            let fi = followerPost.follower.find(e => String(e) === String(uid) );
            if(fi === undefined){
              await followerPostModel.findOneAndUpdate(
                { post_id: id },
                { $push: { follower: uid } },
                { new: true, upsert: true }
              );

              let followerPost = await followerPostModel.findOne({ post_id });
              followerPost = followerPost.toObject();

              await noti_follower_post(uid, id, followerPost.follower)
            }
        }
      }
      

      /*
      // followerPostModel
      let followerPost = await followerPostModel.findOne({ post_id: id });

      var follower =[]
      if ( followerPost === null ){
        await new followerPostModel({ post_id: id, follower: [uid]}).save()
      
        follower = [uid]
      }else{
        follower = followerPost.follower.toObject();
        
        if(follower.includes(uid)){
          follower = follower.filter((v) => {return v != uid})

        }else{
          follower = [...follower, uid]
        }

        console.log('follower > ', follower)
        let _followerPostModel = await  followerPostModel.findOneAndUpdate({ post_id: id }, { post_id: id, follower }, { new: true, upsert: true });
        // if ( _followerPostModel !== null ){
          // follower.map( async (_uid, i) => {
          //    console.log('_uid, i :', _uid, i)
            let fss = await socketsModel.find({ uid:owner_id });
            if ( fss !== null ){
              // case uid have muli devices
              fss.map((obj, i) => {
                if(obj.socketId){
                  io.to(obj.socketId).emit('follower_post', JSON.stringify({'post_id': id, 'follower':follower}) );
                }
              })
            }
          // })
        // }
        
      }  

      let fss = await socketsModel.find({ uid });
      if ( fss !== null ){
        // case uid have muli devices
        fss.map((obj, i) => {
          if(obj.socketId){
            io.to(obj.socketId).emit('follower_post', JSON.stringify({'post_id': id, 'follower':follower}) );
          }
        })
      }

      */
      return true;
    }
  } catch(err) {
    console.log(err);

    return false;
  }
}

// Notification center
/*
  จะแยก notification center ของแต่ละ uid

  type 
  - follow up (1) 
    - uid : คนที่กด follow_up
    - item : ข้อมูล
    ___followUp({"id": item.id, 
                "local": true, 
                "follow_up": follow_up, 
                "unique_id": getUniqueId(), 
                "owner_id": item.owner_id, 
                "date": Date.now()}, 0);

    การทำงาน เราจะต้อง ส่ง noti ไปที่ owner_id บอกว่า uid เป้นคนกด follow up
*/
const notification_center = async(type, uid, item)=>{
  try{

    console.log("notification_center : ", type, uid, item)
    if( empty(type) || empty(uid) || item === null ){
      console.log("notification_center uid, item null : ", uid, item)
    }else{

      switch(type){
        case 1:{
          let notifications_model = await notificationsModel.findOne({ uid });
          item = {...item, uid, "date":new Date()}
          if ( notifications_model === null ){
            await new notificationsModel({ uid, notification: [item]}).save()

            await send_notification_center(item.owner_id, item);
          }else {
            let notification = notifications_model.notification.toObject();
      
            if ( notification.length === 0 ){
              await notificationsModel.findOneAndUpdate(
                { uid },
                { $push: { notification: item } },
                { new: true, upsert: true }
              );

              await send_notification_center(item.owner_id, item);
            }else{
              let find_notification = notification.find(itm=>{return itm.type === item.type && itm.id === item.id})
              if ( find_notification  === undefined ){
                await notificationsModel.findOneAndUpdate(
                  { uid },
                  { $push: { notification: item } },
                  { new: true, upsert: true }
                );
    
                await send_notification_center(item.owner_id, item);
              }
            }
          }

          break
        }

        default:{
          break
        }
      }
    }
    return true

  }catch(error){
    console.log('notification_center, error : ', error);

    return false
  }
}

const send_notification_center = async( uid, item)=>{
  try{
    console.log('send_notification_center  : ', uid, item);
    let fss = await socketsModel.find({ uid });
    if ( fss !== null ){
      // case uid have muli devices
      fss.map((obj, i) => {
        if(obj.socketId){
          io.to(obj.socketId).emit('notification_center', JSON.stringify(item) );
        }
      })
    }
    
  }catch(error){
    console.log('send_notification_center, error : ', error);
  }
}

// Mapping objects to easily map sockets and users.
var clients = {};
// var users = [];


// db.on('ready',function() {
//   console.log('database connected');
// });

// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
var chatId = 1;

io.on('connection', async (socket) => {
  let handshake = socket.handshake;
  console.log(handshake.query.unique_id)

  var uid = handshake.query.uid;
  var unique_id = handshake.query.unique_id;
  var platform = handshake.query.platform;
  // var first_install = handshake.query.first_install;

  console.log(`Socket ${socket.id} connection`)

  console.log(`uid :  ${uid}`)
  // console.log('handshake.query >> ', handshake.query)
  // users[unique_id] = socket;

  socket.emit('message', { unique_id: unique_id });

  clients[socket.id] = socket;
  
  let fss = await  socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { uniqueId: unique_id, socketId: socket.id, platform, uid: (uid !== undefined  ? uid : 0) }, {
              new: true,
              upsert: true 
            });

  // console.log('connection ', socket.id, unique_id, fss)

  socket.on('disconnect', () => {
    // users = users.splice(users.indexOf(unique_id), 1); 
    // console.log(users)
    console.log(`Socket ${socket.id} disconnected.`);

    // db.collection('sockets').remove( { uniqueId:unique_id }, function (err, message) {
    //   console.log(err)
    //   console.log(message.ok)
    // })

    // socketsModel.remove({ uniqueId:unique_id }, function(err) {
    //   if (!err) {
    //     console.log('notification!');
    //   }else {
    //     console.log(err);
    //   }
    // });

    // `doc` is the document _after_ `update` was applied because of
    // `new: true`
    socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { socketId: ''}, {
      new: true,
      upsert: true 
    },function( error, result){
      // In this moment, you recive a result object or error
      // console.log(result)
    });
  });
});

app.get('/todo', (req, res) => {
  console.log('todo')
});

// Event listeners.
// When a user joins the chatroom.
function onUserJoined(userId, socket) {
  try {
    // The userId is null for new users.
    if (!userId) {
      // var user = db.collection('users').insert({}, (err, user) => {
      //   socket.emit('userJoined', user._id);
      //   users[socket.id] = user._id;
      //   _sendExistingMessages(socket);
      // });
    } else {
      users[socket.id] = userId;
      _sendExistingMessages(socket);
    }
  } catch(err) {
    console.log(err);
  }
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, senderSocket) {
  var userId = users[senderSocket.id];
  // Safety check.
  if (!userId) return;

  _sendAndSaveMessage(message, senderSocket);
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket) {
  // var messages = db.collection('messages')
  //   .find({ chatId })
  //   .sort({ createdAt: 1 })
  //   .toArray((err, messages) => {
  //     // If there aren't any messages, then return.
  //     if (!messages.length) return;
  //     socket.emit('message', messages.reverse());
  // });
}

// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(message, socket, fromServer) {
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
    chatId: chatId
  };

  // db.collection('messages').insert(messageData, (err, message) => {
  //   // If the message is from the server, then send to everyone.
  //   var emitter = fromServer ? io : socket.broadcast;
  //   emitter.emit('message', [message]);
  // });
}

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  _sendAndSaveMessage({
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }, null /* no socket */, true /* send from server */);
});

