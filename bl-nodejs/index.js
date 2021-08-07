// simple node web server that displays hello world
// optimized for Docker image

const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");

const mongoStore = require('connect-mongo');

const axios = require('axios')

// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require('morgan');
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

// const MongoClient = require('mongodb').MongoClient;
// this example includes a connection to MongoDB

// const {
//   MONGO_USERNAME,
//   MONGO_PASSWORD,
//   MONGO_HOSTNAME,
//   MONGO_PORT,
//   MONGO_DATABASE_NAME
// } = process.env;

/*
  - NODE_ENV=development
  - MONGO_USERNAME=root
  - MONGO_PASSWORD=example
  - MONGO_HOSTNAME=mongo
  - MONGO_PORT=27017
  - MONGO_DATABASE_NAME=bl
*/
// let MONGO_USERNAME = 'root';
// let MONGO_PASSWORD = 'example';
// let MONGO_HOSTNAME = 'mongo';
// let MONGO_PORT = '27017';
// let MONGO_DATABASE_NAME = 'bl';

// // Connection URL
// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;

// // Create a new MongoClient
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// let db;
// // Use connect method to connect to the Server
var mongoose = require('mongoose');
setTimeout(() => {
  // client.connect(function(err) {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   console.log("Connected successfully to database");
  //   db = client.db(MONGO_DATABASE_NAME);
  // });

  console.log(`mongoose.connection.readyState: ${mongoose.connection.readyState}`);

  // mongoose.STATES[mongoose.connection.readyState] 
}, 2000);

// Api
const app = express();

const connection = require("./connection")
const UserSchema = require('./models/UserSchema');

const utils = require('./utils.js');

const {
  MONGO_HOSTNAME_ENV,
  MONGO_PORT_ENV,
  MONGO_DATABASE_NAME_ENV,
  MONGO_USERNAME_ENV,
  MONGO_PASSWORD_ENV
} = process.env;

// mongoose.connect(`mongodb://${MONGO_USERNAME_ENV}:${MONGO_PASSWORD_ENV}@${MONGO_HOSTNAME_ENV}:${MONGO_PORT_ENV}/${MONGO_DATABASE_NAME_ENV}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true});


const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
    // store: new mongoStore({ mongooseConnection: connection })
    store: mongoStore.create({
      mongoUrl: `mongodb://${MONGO_USERNAME_ENV}:${MONGO_PASSWORD_ENV}@${MONGO_HOSTNAME_ENV}:${MONGO_PORT_ENV}/${MONGO_DATABASE_NAME_ENV}?authSource=admin`
  })
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

app.use(morgan('common'));
app.get('/', function (req, res) {
  // console.log(`process.env = ${process.env}`)
  // console.log(process.env)
  // console.log(req)

  res.send(`Hello Docker World\n`);
});

app.post('/v1/login',  async(req, res, next)=> {
  const start = Date.now()

  let email = req.body.email.trim();
  let pass = req.body.pass.trim();

  // console.log(user)
  // console.log(pass)


  // let encrypt = utils.encrypt("ABC");
  // let decrypt = utils.decrypt(encrypt);
  // console.log(encrypt);
  // console.log(decrypt);
  // await new UserSchema({ name: 'Silence' }).save()

  // const user_schema = await UserSchema.findOne({'uid':1});

  // console.log( user_schema );

  
  if(email === undefined && pass === undefined){
    return res.send({ status: false, message:"Email & Pass is empty" });
  }else if(email === undefined){
    return res.send({ status: false, message:"Email is empty" });
  }else if(pass === undefined){
    return res.send({ status: false, message:"Pass is empty" });
  }

  const user_schema = await UserSchema.findOne({'email':email});

  let result = {};
  if(!utils.isEmpty(user_schema)){
    // console.log( user_schema._id );
    // console.log( user_schema.name );
    // console.log( user_schema.pass );

    let pass_decrypt =utils.decrypt(user_schema.pass)
    if(pass_decrypt === pass){
      req.session.userId    = user_schema.uid;

      result =  {
                  "result": true,
                  "execution_time": `Time Taken to execute = ${(Date.now() - start)/1000} seconds`,
                  "data":{
                    "uid": user_schema.uid,
                    "name": user_schema.name,
                    "email": user_schema.email,
                    "image_url": user_schema.image_url,
                    "gender": user_schema.gender,
                  }
                }
    }else{
      result =  {
        "result": false,
        "execution_time": `Time Taken to execute = ${(Date.now() - start)/1000} seconds`,
        "message": "pass wrong"
      } 
    }
  }else{
    result =  {
      "result": false,
      "execution_time": `Time Taken to execute = ${(Date.now() - start)/1000} seconds`,
      "message": "not email"
    } 
  }

  /*
  // http://api.banlist.info:8090/api/v1/login?_format=json
  const response = await axios.post(`${process.env.DRUPAL_API_ENV}/api/v1/login?_format=json`, {
                                "name":user, 
                                "password": pass, 
                                "unique_id":"aaa"
                              },{
                                headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                              });

  let data = response.data
  
  if(data.result){
    req.session.userId    = data.user.uid;
    req.session.basicAuth = data.user.basic_auth;
    req.session.session   = data.user.session;
  }
  */
  
  // console.log(data.result)
  // return res.send(data);

  return res.send(result);
});

app.post('/v1/reset_password',  async(req, res, next)=> {

  let user = req.body.user;
  let pass = req.body.pass;

  if(user === undefined && pass === undefined){
    return res.send({ status: false, message:"User & Pass is empty" });
  }else if(user === undefined){
    return res.send({ status: false, message:"User is empty" });
  }else if(pass === undefined){
    return res.send({ status: false, message:"Pass is empty" });
  }

  // http://api.banlist.info:8090/api/v1/login?_format=json
  const response = await axios.post(`${process.env.DRUPAL_API_ENV}/api/v1/reset_password?_format=json`, {
                                "name":user, 
                                "password": pass, 
                                "unique_id":"aaa"
                              },{
                                headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                              });

  let data = response.data
  
  // if(data.result){
  //   req.session.userId    = data.user.uid;
  //   req.session.basicAuth = data.user.basic_auth;
  //   req.session.session   = data.user.session;
  // }
  
  console.log(data.result)
  return res.send(data);
});

app.post('/v1/logout', (req, res, next) =>{
  req.session.destroy();

  res.send({"result": true});
});

app.post('/v1/get_html',  async(req, res, next)=> {

  let nid = req.body.nid;

  if(nid === undefined){
    return res.send({ status: false, message:"NID is empty" });
  }

  // http://api.banlist.info:8090/api/v1/login?_format=json
  const response = await axios.post(`${process.env.DRUPAL_API_ENV}/api/v1/get_html?_format=json`, {
                                "nid":nid
                              },{
                                headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                              });
  let data = response.data
  
  return res.send(data);
});

app.post('/v1/search',  async(req, res, next)=> {

  const start = Date.now()
  try {
    let key_word = req.body.key_word;

    if(key_word === undefined){
      return res.send({ status: false, message:"Keyword is empty" });
    }

    // http://api.banlist.info:8090/api/v1/login?_format=json
    const response = await axios.post(`${process.env.DRUPAL_API_ENV}/api/search?_format=json`, {
                                  "key_word":key_word
                                },{
                                  headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                                });    

    // "execution_time": `Time Taken to execute = ${(Date.now() - start)/1000} seconds`,

    let result = {};
    if(response.data.result){
      return res.send({...response.data, ...{"execution_time2": `Time Taken to execute = ${(Date.now() - start)/1000} seconds`}});
    }else{
      return res.send(response.data);
    }
  } catch (err) {
    return res.send(err);
  }
});

app.get('/v1/healthz', function (req, res) {
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)


  let html = `<div> \
                <h1>Nodejs banlist status</h1> \ 
                <ul> \
                  <li>Mongoose connection readyState : ${mongoose.STATES[mongoose.connection.readyState]}</li> \
                </ul> \
                <ul> \
                  <li>User login, userId: ${req.session.userId} basicAuth: ${req.session.basicAuth} session: ${req.session.session}  --- ${req.session.cookie.expires}</li> \
                </ul> \
              </div>`;

  res.send(html);
});

// app.get('/documents', function (req, res, next) {
//   // might have not been connected just yet
//   if (db) {
//     db.collection('Kitten').find({}).toArray(function(err, docs) {
//       if (err) {
//         console.error(err);
//         next(new Error('Error while talking to database'));
//       } else {
//         res.json(docs);
//       }
//     });
//     // const files = Connection.db.collection('files').find({})
//     // db.employee.insert(
//     //   [
//     //     {name:"Sandeep Sharma", email:"sandeep@example.com", age:28, salary:5333.94},
//     //     {name:"Manish Fartiyal", email:"manish@example.com", age:26, salary:5555.4},
//     //     {name:"Santosh Kumar", email:"santosh@example.com", age:30, salary:7000.74},
//     //     {name:"Dhirendra Chauhan", email:"dhirendra@example.com", age:29, salary:4848.44}
//     //   ]
//     // )
//     // db.createCollection("employee", function(err, res) {
//     //   if (err) throw err;
//     //   console.log("Collection created!");
//     //   // db.close();
//     // });
//   } else {
//     next(new Error('Waiting for connection to database'));
//   }
// })



// getting-started.js
// const kittySchema       = require('./models/kittySchema');
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://root:example@mongo:27017/bl?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true});

// const dboose = mongoose.connection;
// dboose.on('error', console.error.bind(console, 'connection error:'));
// dboose.once('open', async function() {
//   // we're connected!
//   console.log('we\'re connected!')

//   // const silence = new kittySchema({ name: 'Silence' });
//   // console.log(`silence ${silence}`)

//   // await new kittySchema({ name: 'Silence' }).save()
// });



// app.post('/api/___follow_up', async(req, res) => {
app.get('/documents', (req, res, next) =>{
  // might have not been connected just yet

  // console.log('/documents')
  // let fss = await kittySchema.find();
  // console.log(fss)

  // await new kittySchema({ name: 'Silence' }).save()

  // NODE_ENV

  console.log(process.env)

  res.send('I am happy and healthy\n documents');
  // if (dboose) {
  //   dboose.collection('Kitten').find({}).toArray(function(err, docs) {
  //     if (err) {
  //       console.error(err);
  //       next(new Error('Error while talking to database'));
  //     } else {
  //       res.json(docs);
  //     }
  //   });

  //   // const files = Connection.db.collection('files').find({})
  //   // db.employee.insert(
  //   //   [
  //   //     {name:"Sandeep Sharma", email:"sandeep@example.com", age:28, salary:5333.94},
  //   //     {name:"Manish Fartiyal", email:"manish@example.com", age:26, salary:5555.4},
  //   //     {name:"Santosh Kumar", email:"santosh@example.com", age:30, salary:7000.74},
  //   //     {name:"Dhirendra Chauhan", email:"dhirendra@example.com", age:29, salary:4848.44}
  //   //   ]
  //   // )

  //   // db.createCollection("employee", function(err, res) {
  //   //   if (err) throw err;
  //   //   console.log("Collection created!");
  //   //   // db.close();
  //   // });

    
  // } else {
  //   next(new Error('Waiting for connection to database'));
  // }
})

module.exports = app;
