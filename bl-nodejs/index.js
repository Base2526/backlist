// simple node web server that displays hello world
// optimized for Docker image

const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const mongoStore = require('connect-mongo');
const axios = require('axios')

const upload = require("express-fileupload");
const FormData = require('form-data'); 
const _ = require('lodash');
const fs = require('fs');

const NodeCache = require( "node-cache" );
const nc = new NodeCache({ checkperiod: 60 * 60 * 15 /* 15Hour */ });

var bodyParser = require('body-parser')

// Api
var cors = require("cors");
const app = express();

//MIDDLEWARES
app.use(upload({
  createParentPath: true,
}));
app.use(cors());

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
const SocketsSchema  = require('./models/SocketsSchema');
const FollowsSchema  = require('./models/FollowsSchema');
const AppFollowersSchema  = require('./models/AppFollowersSchema');

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


// app.use(bodyParser.json({limit: '10mb'}));
// app.use(bodyParser.urlencoded({
//   parameterLimit: 100000,
//   limit: '50mb',
//   extended: true
// }));

// app.use(bodyParser.urlencoded({
//   limit: "500mb",
//   extended: false
// }));
// app.use(bodyParser.json({limit: "500mb"}));

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb'}));


// parsing the incoming data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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

  if(email === undefined && password === undefined){
    return res.send({ status: false, message:"Email & Pass is empty" });
  }else if(email === undefined){
    return res.send({ status: false, message:"Email is empty" });
  }else if(password === undefined){
    return res.send({ status: false, message:"Pass is empty" });
  }

  // http://api.banlist.info:8090/api/v1/login?_format=json 
  let response = await axios.post(`${process.env.DRUPAL_API_ENV}/v1/login?_format=json`, {
                                "name":email, 
                                "password": password, 
                              },{});
  response = response.data
  const end = Date.now()

  console.log('/v1/login : ', response)
  
  if(response.result){
    req.session.userId    = response.user.uid;
    req.session.basicAuth = response.user.basic_auth;
    req.session.session   = response.user.session;

    return res.send({result: true, 
                     execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`,
                     data: response.user}); 
  }else{
    return res.send({ result: false, 
                      code: response.code,
                      execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`,
                      message: response.message});
  }
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

    let data = nc.get( `user-${uid}` );

    let cache = true;
    if(utils.isEmpty(data)){
      cache = false;
      data = await UserSchema.findOne({'uid':uid});

      nc.set( `user-${uid}` , data );
    }

    const end = Date.now()

    return res.send({
                      result : true,
                      cache,
                      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                      data  
                    });
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

    let data = nc.get( `node-${nid}` );

    let cache = true;
    if(utils.isEmpty(data)){
      cache = false;
      data = (await ArticlesSchema.findOne({'nid':nid})).body;

      nc.set( `node-${nid}` , data );

      console.log("without cache");
    }

    const end = Date.now()

    return res.send({
                      result : true,
                      cache,
                      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                      data 
                    });
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});

/*
upload image 
https://attacomsian.com/blog/uploading-files-nodejs-express
*/
app.post('/v1/add_banlist',  async(req, res, next)=> {
  const start = Date.now()
  try {

    console.log('req >', req.headers.authorization)
    // console.log('res >', res)

  /*
  nid: '0',
  product_type: '2',
  transfer_amount: '-2',
  person_name: '4',
  person_surname: '5',
  id_card_number: '-135',
  selling_website: '5',
  transfer_date: 'Wed Aug 18 2021 20:23:57 GMT+0700 (Indochina Time)',
  detail: '5',
  merchant_bank_account: '[]'
    */
    // let key_word = req.body.key_word;
    // let type     = req.body.type;
    // let offset   = req.body.offset;
    // let full_text_fields = req.body.full_text_fields;

    // const file = req.files;
    // const bodyData = req.body;

    const draft           = req.body.draft;
    const nid             = req.body.nid;
    const product_type    = req.body.product_type;
    const transfer_amount = req.body.transfer_amount;
    const person_name     = req.body.person_name;
    const person_surname  = req.body.person_surname;
    const id_card_number  = req.body.id_card_number;
    const selling_website = req.body.selling_website;
    const transfer_date   = req.body.transfer_date;
    const detail          = req.body.detail;
    const merchant_bank_account = req.body.merchant_bank_account;

    const files           = req.files;

    //-------------------
    let photos = []; 
    if(!utils.isEmpty(files)) {
      files['files[]'].map(async(photo) => { 
        let path = './uploads/' + photo.name
        if (!fs.existsSync(path)) {
          photo.mv(path);
        }

        photos.push({  
            name: photo.name,
            mimetype: photo.mimetype,
            size: photo.size
        });
      })
    }

    // console.log('photos > ', photos)
    //-------------------

    const form = new FormData();
    // draft
    form.append('draft', draft);
    form.append('nid', nid);
    form.append('product_type', product_type);
    form.append('transfer_amount', transfer_amount);
    form.append('person_name', person_name);
    form.append('person_surname', person_surname);
    form.append('id_card_number', id_card_number);
    form.append('selling_website', selling_website);
    form.append('transfer_date', transfer_date);
    form.append('detail', detail);
    form.append('merchant_bank_account', merchant_bank_account);

    photos.map((photo) => { 
      // form.append('files[]', file) 
      form.append('files[]', fs.createReadStream('./uploads/' + photo.name), {
        filename: photo.name
      });
    })

    const request_config = {
      headers: { 
        'Authorization': req.headers.authorization , 
        // 'Content-Type': 'multipart/form-data',
        'Content-Type':   form.getHeaders()['content-type'],
      },
      maxContentLength: 10000000000,
      maxBodyLength: 10000000000
    };
    // console.log('data > ', form)

    const response = await axios.post(`${process.env.DRUPAL_API_ENV}/api/added_banlist?_format=json`, form , request_config);
    // console.log('response > ', response);

    const end = Date.now()

    if(response.status === 200){

      // delete file all on local
      photos.map((photo) => { 
        let path = './uploads/' + photo.name
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      })

      let data = response.data

      return res.send({ result : true, 
                        ...data, 
                        // photos,
                        execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`, });
    }else{
      return res.send({result : false, "message": err});
    }
    
  } catch (err) {
    logger.error(err);
    return res.send({result: false, "message": err});
  }
});


/*
  Study : https://logz.io/blog/elasticsearch-queries/
*/
app.post('/v1/search',  async(req, res, next)=> {

  // logger.error(`Ready Listening on port 2`);

  const start = Date.now()
  try {
    let key_word = req.body.key_word;
    let type     = req.body.type;
    let offset   = req.body.offset;
    let full_text_fields = req.body.full_text_fields;

    console.log('/v1/search >', key_word, type, offset, full_text_fields)

    if(key_word === undefined){
      return res.send({ status: false, message:"Keyword is empty" });
    }

    let query = {}
    switch(type){
      case 0: {
        query = {
                  "query": {
                    "bool": {
                        "filter": [
                            { "term": { "status": true }}
                        ]
                    }
                  },
                  "from": offset * 20 + 1, 
                  "size": 20
                }
          
        console.log( 'query >', query );
        break;
      }

      /*
      uid AND status= {true or false}
      */
      case 1: {
        query = {
                  "query": {
                      "bool": {
                          "must": [
                              {"match" : { "uid": key_word }},
                              // {"match" : { "status": true}},
                          ],
                      }
                  },
                }

        console.log( 'query >', query );

        const { body } = await client.search({
          index: 'elasticsearch_index_banlist_content_back_list',
          body:  query
        })
    
        var results = body.hits.hits.map((hit)=>{ 
                                            let title           = hit._source.title[0];
                                            let name            = utils.isEmpty(hit._source.field_sales_person_name) ? "" : hit._source.field_sales_person_name[0];  
                                            let surname         = utils.isEmpty(hit._source.field_sales_person_surname) ? "" : hit._source.field_sales_person_surname[0];  
                                            let name_surname    = utils.isEmpty(hit._source.banlist_name_surname_field) ? "" : hit._source.banlist_name_surname_field[0]; 
                                            let owner_id        = hit._source.uid[0];
                                            let transfer_amount = utils.isEmpty(hit._source.field_transfer_amount) ? "" : hit._source.field_transfer_amount[0]; 
                                            let detail          = utils.isEmpty(hit._source.body) ? "" : hit._source.body[0] ;
                                            let id              = hit._source.nid[0];
                                            let id_card_number  = utils.isEmpty(hit._source.field_id_card_number) ? [] : hit._source.field_id_card_number[0] ;
                                            let images          = hit._source.banlist_images_field;
                                            let status          = hit._source.status[0];


                                            let created          = hit._source.created[0];
                                            let changed          = hit._source.changed[0];

    
                                            return {id, owner_id, name, surname, name_surname, title, transfer_amount, detail, id_card_number, images, status, created, changed}
                                          });
        const end = Date.now()

        // console.log( 'results >', { ...['a', 'b', 'c'] } );
    
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
    
                          hits: body.hits.hits,
                          count         : results.length });
    
        break;
      }

      /*
        search by key_word and select field dynamic
      */
      case 99:{
        const fields = JSON.parse(full_text_fields);
        const should = fields.map((field) => { return {'wildcard': {[field]: `*${key_word}*`}}});
        query = {
                  "query": {
                    "bool": {
                        "must_not": [
                          {"match": { "status": false}}
                        ],
                        should
                    }
                  },
                }

        console.log( 'query >', query );
        break;
      }

      // test 
      case 9999: {

        const fields = [ {name: "title"}, {name: "body"} ]
        const should = fields.map((val) => { return {'wildcard': {[val.name]: `*${key_word}*`}}});

        const { body } = await client.search({
                                                index: 'elasticsearch_index_banlist_content_back_list',
                                                body:  {
                                                "query": {
                                                    "bool": {
                                                        "must_not": [
                                                          {"match": { "status": false}}
                                                        ],
                                                        should
                                                    }
                                                },
                                                size: 5,
                                                }
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
                                            let status          = hit._source.status[0];
    
                                            return {id, owner_id, name, surname, name_surname, title, transfer_amount, detail, id_card_number, images, status}
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
    
                          hits: body.hits.hits,
                          count         : results.length });
        break;
      }
    }
     
    const { body } = await client.search({
      index: 'elasticsearch_index_banlist_content_back_list',
      body:  query
    })

    var results = [];
    results = body.hits.hits.map((hit)=>{ 
                                        let title           = hit._source.title[0];
                                        let name            = utils.isEmpty(hit._source.field_sales_person_name) ? "" : hit._source.field_sales_person_name[0];  
                                        let surname         = utils.isEmpty(hit._source.field_sales_person_surname) ? "" : hit._source.field_sales_person_surname[0];  
                                        let name_surname    = utils.isEmpty(hit._source.banlist_name_surname_field) ? "" : hit._source.banlist_name_surname_field[0]; 
                                        let owner_id        = hit._source.uid[0];
                                        let transfer_amount = utils.isEmpty(hit._source.field_transfer_amount) ? "" : hit._source.field_transfer_amount[0]; 
                                        let detail          = utils.isEmpty(hit._source.body) ? "" : hit._source.body[0] ;
                                        let id              = hit._source.nid[0];
                                        let id_card_number  = utils.isEmpty(hit._source.field_id_card_number) ? [] : hit._source.field_id_card_number[0] ;
                                        let images          = hit._source.banlist_images_field;
                                        let status          = hit._source.status[0];

                                        let created          = hit._source.created[0];
                                        let changed          = hit._source.changed[0];

                                        return {id, owner_id, name, surname, name_surname, title, transfer_amount, detail, id_card_number, images, status, created, changed}
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

                      hits: body.hits.hits,
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

// Clear cache by keys
app.post('/v1/cache_del',  async(req, res, next)=> {
  try {
    const start = Date.now()
    let keys = req.body.keys;
  
    if(keys === undefined){
      return res.send({ status: false, message:"Without keys" });
    }

    console.log("keys >> ", keys)

    keys.map( async(key) => {
      let key1 = key.split("-");
      // console.log("key1 >> ", key1)

      switch(key1[0]){
        case 'user':{
          
          let sockets = await SocketsSchema.find({auth: key1[1]});
          // console.log(sockets)

          sockets.map(async(socket) => {
            console.log('socket.socketId = ', socket.socketId)
            let user = nc.get( `user-${socket.auth}` );
            if(utils.isEmpty(user)){
              user = await UserSchema.findOne({'uid':socket.auth});;
        
              nc.set( `user-${socket.auth}` , user );
            }

            if(!utils.isEmpty(user)){
              global.io.to(socket.socketId).emit('onProfile', user);
            }
            
          })
          break;
        }

        // case 'node':{
        //   break;
        // }
      }
    })

    nc.del( keys );

    const end = Date.now()
    return res.send({
                      result : true,
                      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                    });
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});

// Clear cache flush all
app.post('/v1/cache_flush_all',  async(req, res, next)=> {
  try {
    const start = Date.now()

    nc.flushAll();

    const end = Date.now()
    return res.send({
                      result : true,
                      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                    });
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});


// notify_owner_content
app.post('/v1/notify_owner_content',  async(req, res, next)=> {
  try {
    const start = Date.now()
    let uid = req.body.uid;
    let mode = req.body.mode;
    let nid = req.body.nid;
    let data = req.body.data;

    // $data_obj = [ 'uid'=>$uid, 'mode'=>$mode, 'nid'=>$nid ];
  
    if(uid === undefined || mode === undefined || nid === undefined){
      return res.send({ status: false, message:"Without uid, mode, nid" });
    }

    console.log("/v1/notify_owner_content  uid :", uid, " mode : ", mode, " nid : ", nid , " data : ", data, data.images)

    let sockets = await SocketsSchema.find({ auth: uid });

    /*
    let datas = [];
    switch(mode){
      case 'add':
      case 'edit':{
        let   query = {
                        "query": {
                            "bool": {
                                "must": [
                                    {"match" : { "nid": nid }},
                                ],
                            }
                        },
                      }

        const { body } = await client.search({
          index: 'elasticsearch_index_banlist_content_back_list',
          body:  query
        })
    
        datas = body.hits.hits.map((hit)=>{ 
                                            let title           = hit._source.title[0];
                                            let name            = utils.isEmpty(hit._source.field_sales_person_name) ? "" : hit._source.field_sales_person_name[0];  
                                            let surname         = utils.isEmpty(hit._source.field_sales_person_surname) ? "" : hit._source.field_sales_person_surname[0];  
                                            let name_surname    = utils.isEmpty(hit._source.banlist_name_surname_field) ? "" : hit._source.banlist_name_surname_field[0]; 
                                            let owner_id        = hit._source.uid[0];
                                            let transfer_amount = utils.isEmpty(hit._source.field_transfer_amount) ? "" : hit._source.field_transfer_amount[0]; 
                                            let detail          = utils.isEmpty(hit._source.body) ? "" : hit._source.body[0] ;
                                            let id              = hit._source.nid[0];
                                            let id_card_number  = utils.isEmpty(hit._source.field_id_card_number) ? [] : hit._source.field_id_card_number[0] ;
                                            let images          = hit._source.banlist_images_field;
                                            let status          = hit._source.status[0];
    
                                            return {id, owner_id, name, surname, name_surname, title, transfer_amount, detail, id_card_number, images, status}
                                          });
        // const end = Date.now()

        
        break;
      }
    }

    console.log('/v1/notify_owner_content  datas = ', datas, ' >> ', datas[0].images)
    */

    sockets.map(async(socket) => {
      console.log('/v1/notify_owner_content  socket.socketId = ', socket.socketId)
      // let user = nc.get( `user-${socket.auth}` );
      // if(utils.isEmpty(user)){
      //   user = await UserSchema.findOne({'uid':socket.auth});;
  
      //   // nc.set( `user-${socket.auth}` , user );
      // }

      if(!utils.isEmpty(socket.socketId)){
        global.io.to(socket.socketId).emit('onContent', {mode, nid, data});
      }
    })

    // keys.map( async(key) => {
    //   let key1 = key.split("-");
    //   console.log("key1 >> ", key1, global)

    //   switch(key1[0]){
    //     case 'user':{
          
    //       let sockets = await SocketsSchema.find({auth: key1[1]});
    //       // console.log(sockets)

    //       sockets.map(async(socket) => {
    //         console.log('socket.socketId = ', socket.socketId)
    //         let user = nc.get( `user-${socket.auth}` );
    //         if(utils.isEmpty(user)){
    //           user = await UserSchema.findOne({'uid':socket.auth});;
        
    //           nc.set( `user-${socket.auth}` , user );
    //         }

    //         if(!utils.isEmpty(user)){
    //           global.io.to(socket.socketId).emit('onProfile', user);
    //         }
            
    //       })
    //       break;
    //     }

    //     // case 'node':{
    //     //   break;
    //     // }
    //   }
    // })

    // nc.del( keys );

    const end = Date.now()
    return res.send({
                      result : true,
                      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                    });
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});

// nodejs_notify_user
app.post('/v1/nodejs_notify_user',  async(req, res, next)=> {
  try {
    const start = Date.now()
    let uid = req.body.uid;
    let mode = req.body.mode;
  
    if(uid === undefined || mode === undefined){
      return res.send({ status: false, message:"Without uid, mode" });
    }

    console.log("/v1/nodejs_notify_user  uid :", uid, " mode : ", mode)

    let sockets = await SocketsSchema.find({ auth: uid });

    sockets.map(async(socket) => {
      console.log('/v1/nodejs_notify_user  socket.socketId = ', socket.socketId)
      if(!utils.isEmpty(socket.socketId)){
        global.io.to(socket.socketId).emit('onUser', {'mode': mode});
      }
    })

    switch(mode){
      case 'delete':{

        await SocketsSchema.deleteMany({ auth: uid });
        await UserSchema.deleteMany({ uid: uid });

        break;
      }
    }

    const end = Date.now()
    return res.send({
                      result : true,
                      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
                    });
  } catch (err) {
    logger.error(err);
    return res.send({result : false, message: err});
  }
});

// /v1/syc_local
app.post('/v1/syc_local',  async(req, res, next)=> {
  try {

    let uid = req.session.userId
    if(utils.isEmpty(uid)){
      logger.error("/v1/syc_local without session");

      return res.send({result : false, message: "without session"});
    }

    const start = Date.now()


    let my_follows = req.body.my_follows;

    /*
    req.session.userId    = response.user.uid;
    req.session.basicAuth = response.user.basic_auth;
    req.session.session   = response.user.session;
    */

    console.log('/v1/syc_local, my_follows #1 : ', my_follows )

    if(!utils.isEmpty(my_follows)){
      my_follows = JSON.parse(my_follows)
      my_follows.map( async(mf)=>{

        // -----------  AppFollowersSchema  -----------
        let app_followers = await AppFollowersSchema.findOne({ nid: mf.id });
        if(!utils.isEmpty(app_followers)){
          let v = app_followers.value
          let index = v.findIndex((obj => obj.uid == uid));

          let  new_value = [] 
          if(index !== -1){
            new_value = [...v]
            new_value[index] = {uid : uid, status: mf.status, date:Date.now()}
          }else{
            new_value =  [...v, {uid : uid, status: mf.status, date:Date.now()}]
          }

          // console.log('/v1/syc_local, if : ', new_value )
          await AppFollowersSchema.findOneAndUpdate({nid: mf.id}, {value: new_value})
        }else{
          await new AppFollowersSchema({ nid: mf.id, value: [{uid : uid, status: mf.status, date:Date.now()}] }, {upsert: true}).save()
        }

        // หาเจ้าของ Content เพือ ส่ง noti ไปแจ้งว่ามี คนกด follow
        const { body } = await client.search({
            index: 'elasticsearch_index_banlist_content_back_list',
            body:  {
            "query": {
                "bool": {
                    "must": [
                        {"match" : { "nid": mf.id }},
                        // {"match" : { "status": true}},
                    ],
                }
            },
            size: 1,
            }
        })

        if(body.hits.total.value){
          let uids = body.hits.hits.map((hit)=>{ return {uid : hit._source.uid[0]} });

          // console.log('/v1/syc_local  search : uids > ' , uids[0], ' -- ', mf.id)

          let __auth = uids[0].uid
          if(__auth){
            let sockets = await SocketsSchema.find({ auth: __auth });
            sockets.map(async(socket) => {
              console.log('/v1/syc_local  หาเจ้าของ Content = ', socket.socketId)
              if(!utils.isEmpty(socket.socketId)){
                global.io.to(socket.socketId).emit('onAppFollowUp', {data: {uid, status: mf.status}});
              }
            })
          }
        }
        // หาเจ้าของ Content เพือ ส่ง noti ไปแจ้งว่ามี คนกด follow

        // -----------  AppFollowersSchema  -----------

        return mf.local = false
      })

      await FollowsSchema.findOneAndUpdate({'uid': uid}, {value: my_follows}, {upsert: true})

      let sockets = await SocketsSchema.find({ auth: uid });
      sockets.map(async(socket) => {
        console.log('/v1/syc_local  socket.socketId = ', socket.socketId)
        if(!utils.isEmpty(socket.socketId)){
          global.io.to(socket.socketId).emit('onMyFollows', {my_follows});
        }
      })
    }

    const end = Date.now()
    return res.send({
      result : true,
      function : "/v1/syc_local",
      execution_time : `Time Taken to execute = ${(end - start)/1000} seconds`,
    });
  } catch (err) {
    logger.error(err.message);
    return res.send({result : false, message: err.message});
  }
})


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
