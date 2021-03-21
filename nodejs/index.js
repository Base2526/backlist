// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');

// const socket = require("socket.io");

// const PORT = process.env.PORT || 3000;
// const app = express();

// const http  = require('http');
// const server= http.createServer(app);
// let io = require('socket.io')(server);

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(express.static(__dirname + '/public'));

// app.get('/todo', (req, res) => {
//   ToDo.find()
//     .then((toDos) => res.status(200).send(toDos))
//     .catch((err) => res.status(400).send(err));
// });

// app.post('/todo', (req, res) => {
//   const body = req.body;
//   const toDo = new ToDo({
//     text: body.text,
//   });
//   toDo.save(toDo)
//     .then((savedToDo) => res.status(201).send(savedToDo))
//     .catch((err) => res.status(400).send(err));
// });

// app.patch('/todo/:id', (req, res) => {
//   const { id } = req.params;
//   ToDo.findOneAndUpdate({ _id: id }, { done: true })
//     .then((toDo) => res.status(200).send(toDo))
//     .catch((err) => res.status(400).send(err));
// });

// const mongoose = require('mongoose');
// const ToDo = require('./toDoModel.js').ToDo;
// const DB_URI = 'mongodb://mongo:27017/toDoApp';

// mongoose.connect(DB_URI).then(() => {
//   console.log('Listening on port: ' + PORT);
//   app.listen(PORT);
// });

// io.on('connection', (socket) => { 
//   let handshake = socket.handshake;

//   console.log('connection')
// });
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

const socketsModel  = require('./models/sockets');
const usersModel    = require('./models/users');

const connection = require("./connection")

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

app.get('/api/hello', (req, res) => {
  // db.collection('sockets').insert(res, (err, message) => {
  //   console.log(err)
  //   console.log(message)
  // })
  console.log('/api/hello')

  res.send({ express: config.mongo.url });
});


// case login will add uid to socketsModel and logout will clear uid for socketsModel
app.post('/api/login', (req, res) => {
  try {
    console.log(req.body)
    
    let {unique_id, uid} = req.body
    if(!unique_id || !uid){    
      res.status(404).send({'message': 'ERROR'});
    }else{

      socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { uid }, {
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

app.post('/api/logout', (req, res) => {
  try {
    console.log(req.body)
    
    let {unique_id, uid} = req.body
    if(!unique_id || !uid){    
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

app.post('/api/favorite', async (req, res) => {
  try {
    console.log(req.body)
    
    // let {unique_id, uid} = req.body
    // if(!unique_id || !uid){    
    //   res.status(404).send({'message': 'ERROR'});
    // }else{

    //   socketsModel.findOneAndUpdate({ uniqueId: unique_id, uid }, { uid: '' }, {
    //     new: true,
    //     upsert: true 
    //   },function( error, result){
    //     // In this moment, you recive a result object or error
    //     console.log(result)
    //   });
    //   res.status(200).send({'message': 'OK'});
    // }  

    let { uid, id_favorite, unique_id } = req.body
    if(!uid || !id_favorite || !unique_id){    
      res.status(404).send({'message': 'ERROR'});
    }else{
      let user = await usersModel.findOne({ uid });
      
      if ( user === null ){
        await new usersModel({ uid, favorites: [id_favorite]}).save()
      }else{
        var favorites = user.favorites.toObject();
        
        if(favorites.includes(id_favorite)){
          favorites = favorites.filter((v) => {return v != id_favorite})
        }else{
          favorites = [...favorites, id_favorite]
        }

        usersModel.findOneAndUpdate({ uid }, { uid, favorites }, {
          new: true,
          upsert: true 
        },async function( error, result){
          if ( error === null ){
            console.log(result)

            let fs = await socketsModel.findOne({ unique_id });
            if ( fs !== null ){
              if(fs.socketId){
                console.log(fs.socketId)
                io.to(fs.socketId).emit('FromAPI', 'for your eyes only');
              }
            }
          }
        });
      }
    }
    
    res.status(200).send({'message': 'OK'});
  } catch (err) {
    res.status(500).send({errors: err});
  }
});

// Mapping objects to easily map sockets and users.
var clients = {};
// var users = [];


// db.on('ready',function() {
//   console.log('database connected');
// });

// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
var chatId = 1;

io.on('connection', (socket) => {
  let handshake = socket.handshake;
  console.log(handshake.query.unique_id)

  var unique_id = handshake.query.unique_id;
  var platform = handshake.query.platform;

  console.log(`Socket ${socket.id} connection`)

  // console.log(socket)
  // users[unique_id] = socket;

  socket.emit('message', { unique_id: unique_id });

  clients[socket.id] = socket;
  // socket.on('userJoined', (userId) => onUserJoined(userId, socket));
  // socket.on('message', (message) => onMessageReceived(message, socket));
  // db.collection('sockets').findOne({
  //   uniqueId: unique_id
  // }, function(err, doc) {
  //   if(!err){
  //     if(doc){
  //       db.collection('sockets').remove( { socketId:doc.socketId }, function (err, message) {
  //         console.log(err)
  //         console.log(message.ok)
  //       })
  //     }

  //     var socketData = {
  //       uniqueId: unique_id,
  //       socketId: socket.id,
  //       platform,
  //       createdAt: new Date(),
  //     }

  //     db.collection('sockets').insert(socketData, (err, message) => {
  //         console.log(err)
  //         console.log(message)
  //     })
  //   }
  // })

  // var _sockets = await sockets.findOne({ uniqueId: unique_id });
  // console.log(_sockets)

  // `doc` is the document _after_ `update` was applied because of
  // `new: true`
  socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { uniqueId: unique_id, socketId: socket.id, platform}, {
    new: true,
    upsert: true 
  },function( error, result){
    // In this moment, you recive a result object or error
    console.log(result)
  });

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
      console.log(result)
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
    console.err(err);
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

