// simple node web server that displays hello world
// optimized for Docker image

const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const mongoStore = require('connect-mongo');
const axios = require('axios')

// Api
const app = express();

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#authentication
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  // cloud: {
  //   id: 'name:bG9jYWxob3N0JGFiY2QkZWZnaA==',
  // },
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  }
})

// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.
var mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
// const logger = require('./util/loggerEasy');
const logger = require('./util/logger');
const { stream }    = logger;
const connection    = require("./connection")
const UserSchema    = require('./models/UserSchema');
const FilesSchema   = require('./models/FilesSchema');
const ArticlesSchema = require('./models/ArticlesSchema');

const utils = require('./util/utils');

const {
  MONGO_HOSTNAME_ENV,
  MONGO_PORT_ENV,
  MONGO_DATABASE_NAME_ENV,
  MONGO_USERNAME_ENV,
  MONGO_PASSWORD_ENV
} = process.env;

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs'),
});

// Morgan
morgan.token('th-date', function (req, res) {
  const date = new Date();
  return date;
});

app.use(morgan('common', { stream: accessLogStream }));
app.use(
  morgan(
    ':th-date :method[pretty] :url :status :res[content-length] - :response-time ms',
    {
      stream: stream,
    }
  )
);

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


const oneYear = 1000 * 60 * 60 * 24 * 365;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneYear },
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
app.get('/', async (req, res) =>{
  // console.log(`process.env = ${process.env}`)
  // console.log(process.env)
  // console.log(req)

  // let result =  await client.search({
  //                       index: 'elasticsearch_index_banlist_content_back_list',
  //                       body: {
  //                         query: {
  //                           match: { hello: 'a' }
  //                         }
  //                       }
  //                     })

  // await client.index({
  //   index: 'elasticsearch_index_banlist_content_back_list',
  //   refresh: true,
  //   body: {
  //     character: 'Tyrion Lannister',
  //     quote: 'A Lannister always pays his debts.',
  //     house: 'lannister'
  //   }
  // })

  // const { body } = await client.get({
  //   index: 'elasticsearch_index_banlist_content_back_list',
  //   id: 'entity:node/9:en'
  // })

  // const { body } = await client.sql.query({
  //   body: {
  //     query: "SELECT * FROM \"elasticsearch_index_banlist_content_back_list\" WHERE body LIKE '%Commodo%'"
  //   }
  // })

  // const data = body.rows.map(row => {
  //   const obj = {}
  //   for (let i = 0; i < row.length; i++) {
  //     obj[body.columns[i].name] = row[i]
  //   }
  //   return obj
  // })

  // const query = {
  //   query: {
  //     // match: {
  //     //   field_sales_person_name: {
  //     //     query: "สมคิด",
  //     //     operator: "and",
  //     //     fuzziness: "auto"
  //     //   }
  //     // }

  //     "query_string": {
  //       "fields": [ "field_sales_person_name", "body", "nid" ],
  //       "query": "56",
  //       // "minimum_should_match": 2
  //     },

  //     // "match":{
  //     //   "title":"*bene*"
  //     // }
  //     /*    
  //       query: { match_all: {}},
  //       sort: [{ "nid": { "order": "asc" } }],
  //       from: 0,
  //       size: 5,
  //     */
  //   }
  // }

  // const { body } = await client.search({
  //   index: 'elasticsearch_index_banlist_content_back_list',
  //   // body: {
  //   //   query: {
  //   //     // match: {
  //   //     //   // field_transfer_amount: 8449660000
  //   //     //   banlist_name_surname_field: '*sisebruwristup*'
  //   //     // }
  //   //     match: {
  //   //       title: {
  //   //         query: 'Cogo',
  //   //         operator: "and",
  //   //         fuzziness: "auto"
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   body:  query
  // })

  // res.send(body);
  res.send(`Hello Docker World\n`);
});

app.post('/v1/login',  async(req, res)=> {
  const start = Date.now()

  let email = req.body.email;
  let password = req.body.password;

  // console.log(user)
  // console.log(pass)


  // let encrypt = utils.encrypt("ABC");
  // let decrypt = utils.decrypt(encrypt);
  // console.log(encrypt);
  // console.log(decrypt);
  // await new UserSchema({ name: 'Silence' }).save()

  // const user_schema = await UserSchema.findOne({'uid':1});

  // console.log( user_schema );
  
  if(email === undefined && password === undefined){
    return res.send({ status: false, message:"Email & Pass is empty" });
  }else if(email === undefined){
    return res.send({ status: false, message:"Email is empty" });
  }else if(password === undefined){
    return res.send({ status: false, message:"Pass is empty" });
  }

  /*
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

  return res.send(result);
  */

  
  // http://api.banlist.info:8090/api/v1/login?_format=json 
  const response = await axios.post(`${process.env.DRUPAL_API_ENV}/v1/login?_format=json`, {
                                "name":email, 
                                "password": password, 
                                // "unique_id":"aaa"
                              },{
                                // headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                              });

  let data = response.data

  const end = Date.now()
  
  if(data.result){
    req.session.userId    = data.user.uid;
    req.session.basicAuth = data.user.basic_auth;
    req.session.session   = data.user.session;
  }
  
  
  // console.log(data.result)
  return res.send({...data, execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`});

  // 
});

app.post('/v1/register',  async(req, res)=> {
  const start = Date.now()

  let email = req.body.email;
  let name = req.body.name;
  let password = req.body.password;

  // console.log(user)
  // console.log(pass)


  // let encrypt = utils.encrypt("ABC");
  // let decrypt = utils.decrypt(encrypt);
  // console.log(encrypt);
  // console.log(decrypt);
  // await new UserSchema({ name: 'Silence' }).save()

  // const user_schema = await UserSchema.findOne({'uid':1});

  // console.log( user_schema );
  
  if(email === undefined &&  name === undefined && password === undefined){
    return res.send({ status: false, message:"Email & Name & Pass is empty" });
  }else if(email === undefined){
    return res.send({ status: false, message:"Email is empty" });
  }else if(name === undefined){
    return res.send({ status: false, message:"Name is empty" });
  }else if(password === undefined){
    return res.send({ status: false, message:"Pass is empty" });
  }


  // http://api.banlist.info:8090/api/v1/login?_format=json 
  const response = await axios.post(`${process.env.DRUPAL_API_ENV}/v1/register?_format=json`, 
                              {
                                "email":  email,
                                "name":  name, 
                                "password": password, 
                              },{
                                // headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                              });

  let data = response.data

  const end = Date.now()
  
  // if(data.result){
  //   req.session.userId    = data.user.uid;
  //   req.session.basicAuth = data.user.basic_auth;
  //   req.session.session   = data.user.session;
  // }
  
  
  // console.log(data.result)
  return res.send({...data, execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`});

  // 
});

app.post('/v1/reset_password',  async(req, res, next)=> {

  let email = req.body.email;

  if(email === undefined ){
    return res.send({ status: false, message:"Email is empty" });
  }

  // http://api.banlist.info:8090/api/v1/login?_format=json
  const response = await axios.post(`${process.env.DRUPAL_API_ENV}/v1/reset_password?_format=json`, {
                                "email":email, 
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

app.post('/v1/profile',  async(req, res, next)=> {
  try {
    const start = Date.now()

    let uid = req.body.uid;

    if(uid === undefined){
      return res.send({ result: false, message:"UID is empty" });
    }

    const user_schema = await UserSchema.findOne({'uid':uid});
    const end = Date.now()

    let data = {
                result : true,
                execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                data   : user_schema
                }
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});

app.post('/v1/get_html',  async(req, res, next)=> {
  try {
    const start = Date.now()

    let nid = req.body.nid;

    if(nid === undefined){
      return res.send({ result: false, message:"NID is empty" });
    }

    /*
    // http://api.banlist.info:8090/api/v1/login?_format=json
    const response = await axios.post(`${process.env.DRUPAL_API_ENV}/v1/get_html?_format=json`, {
                                  "nid":nid
                                },{
                                  headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
                                });
    let data = response.data
    */

    const articles_schema = await ArticlesSchema.findOne({'nid':nid});
    const end = Date.now()

    let data = {
                result : true,
                execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                data   : articles_schema.body
                }

    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});

app.post('/v1/search',  async(req, res, next)=> {

  // logger.error(`Ready Listening on port 2`);

  const start = Date.now()
  try {
    let key_word = req.body.key_word;
    let full_text_fields = req.body.full_text_fields;

    console.log("full_text_fieldsfull_text_fieldsfull_text_fieldsfull_text_fieldsfull_text_fields")
    console.log(full_text_fields)

    if(key_word === undefined){
      return res.send({ status: false, message:"Keyword is empty" });
    }


    let query = {
      query: {
        "query_string": {
          "fields": [ "field_sales_person_name", "body" ],
          "query": `*${key_word}*`,
        },
        
        
        //   query: { match_all: {}},
        //  sort: [{ "nid": { "order": "asc" } }],
        //  from: 0,
        //  size: 5,
        
      },
      size: 5,
    }

    if(!utils.isEmpty(full_text_fields)){
      full_text_fields = JSON.parse(full_text_fields);

      query = {
        query: {
          "query_string": {
            "fields": full_text_fields,
            "query": `*${key_word}*`,
          },
          
          
          //   query: { match_all: {}},
          //  sort: [{ "nid": { "order": "asc" } }],
          //  from: 0,
          //  size: 5,
          
        },
        size: 5,
      }
    }
    
    // http://api.banlist.info:8090/api/v1/login?_format=json
    // const response = await axios.post(`${process.env.DRUPAL_API_ENV}/v1/search?_format=json`, {
    //                               "key_word":key_word
    //                             },{
    //                               headers: { 'Authorization': `Basic ${process.env.DRUPAL_AUTHORIZATION_ENV}` }
    //                             });   
                                
    // const end = Date.now()
    

    ///------------------
   
  
    const { body } = await client.search({
      index: 'elasticsearch_index_banlist_content_back_list',
      body:  query
    })

    var results = [];
    results = body.hits.hits.map((hit)=>{ 
                                        let title   = hit._source.title[0];
                                        let name    = utils.isEmpty(hit._source.field_sales_person_name) ? "" : hit._source.field_sales_person_name[0];  
                                        let surname = utils.isEmpty(hit._source.field_sales_person_surname) ? "" : hit._source.field_sales_person_surname[0];  
                                        let name_surname    = utils.isEmpty(hit._source.banlist_name_surname_field) ? "" : hit._source.banlist_name_surname_field[0]; 
                                        let owner_id        = hit._source.uid[0];
                                        let transfer_amount = utils.isEmpty(hit._source.field_transfer_amount) ? "" : hit._source.field_transfer_amount[0]; 
                                        let detail          = utils.isEmpty(hit._source.body) ? "" : hit._source.body[0] ;
                                        let id              = hit._source.nid[0];
                                        let id_card_number  = utils.isEmpty(hit._source.field_id_card_number) ? [] : hit._source.field_id_card_number[0] ;
                                        let images          = hit._source.banlist_images_field;

                                        return {id, owner_id, name, surname, name_surname, title, transfer_amount, detail, id_card_number, images}
                                      });
    const end = Date.now()

    /*
    all_result_count: 10
    count: 10
    */
    ///------------------
    // if(response.data.result){
    return res.send({ result        : true,
                      execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`, 
                      body          : body,
                      datas         : results ,
                      all_result_count: body.hits.total.value,
                      count         : results.length });
    // }else{
    //   return res.send(response.data);
    // }
    
    /*
    const query = {
      query: {
        "query_string": {
          "fields": [ "field_sales_person_name", "body" ],
          "query": `*${key_word}*`,
        },
        
        //   query: { match_all: {}},
        //  sort: [{ "nid": { "order": "asc" } }],
        //  from: 0,
        //  size: 5,
        
      }
    }
  
    const { body } = await client.search({
      index: 'elasticsearch_index_banlist_content_back_list',
      body:  query
    })

    return res.send({"result"        : true,
                     "execution_time": `Time Taken to execute = ${(Date.now() - start)/1000} seconds`,
                     "count"         : body.hits.total.value,
                     "datas"         : body.hits.hits,
                     });
                     */
  
  } catch (err) {
    logger.error(err);
    return res.send({"result" : false, "message": err});
  }
});

app.get('/v1/healthz', async (req, res) =>{
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)

  let health = await client.cluster.health({});

  let html = `<div> \
                <h1>Nodejs banlist status</h1> \ 
                <ul> \
                  <li>Mongoose connection readyState : ${mongoose.STATES[mongoose.connection.readyState]}</li> \
                </ul> \
                <ul> \
                  <li>User login, userId: ${req.session.userId} basicAuth: ${req.session.basicAuth} session: ${req.session.session}  --- ${req.session.cookie.expires}</li> \
                </ul> \
                <ul> \
                  <li>Elasticsearch : statusCode= ${health.statusCode}, body status: ${health.body.status}</li> \
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
