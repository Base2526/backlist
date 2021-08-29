const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const _ = require('lodash')
const express = require('express');
const sessions = require('express-session');
const app   = require('express')();
const cookieParse = require('cookie-parser')();
const session = require('express-session')
// var passport = require('passport');
// var passportInit = passport.initialize();
// var passportSession = passport.session();
// const MongoStore = require('connect-mongo')(session);
const mongoStore = require('connect-mongo');
const http  = require('http');
const server= http.createServer(app);
let io = require('socket.io')(server, { path: '/mysocket' }); ///socketio/mysocket

const path = require("path");
const multer = require("multer");
const fs = require('fs');
const FormData = require('form-data'); 
const axios = require('axios')
const upload = require("express-fileupload");
const cors = require("cors");

const NodeCache     = require( "node-cache" );
const nc            = new NodeCache({ checkperiod: 60 * 60 * 15 /* 15Hour */ });

const utils             = require('./util/utils');
const SocketsSchema     = require('./models/SocketsSchema');
const UserSchema        = require('./models/UserSchema');
const FilesSchema       = require('./models/FilesSchema');
const ArticlesSchema    = require('./models/ArticlesSchema');
const FollowsSchema     = require('./models/FollowsSchema');
const AppFollowersSchema= require('./models/AppFollowersSchema');

const kittySchema       = require('./models/kittySchema')

const ContentsSchema    = require('./models/ContentsSchema')

require("./connection")

const rfs = require('rotating-file-stream');
const morgan = require('morgan');

//---------- Log -----------//
const logger = require('./util/logger');
const { stream }    = logger;

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
//---------- Log -----------//

//MIDDLEWARES
app.use(upload({
  createParentPath: true,
}));
app.use(cors());

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb'}));
//serving public file
app.use(express.static(__dirname));
// cookie parser middleware
app.use(cookieParser());

app.use(morgan('common'));

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#authentication
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  }
})

const {
  MONGO_HOSTNAME_ENV,
  MONGO_PORT_ENV,
  MONGO_DATABASE_NAME_ENV,
  MONGO_USERNAME_ENV,
  MONGO_PASSWORD_ENV
} = process.env;

//session middleware
app.use(sessions({
    secret: "fhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 /* OneYear */ },
    resave: false,
    store: mongoStore.create({
      mongoUrl: 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/bl?replicaSet=my-mongo-set'
      // mongoUrl: `mongodb://${MONGO_USERNAME_ENV}:${MONGO_PASSWORD_ENV}@${MONGO_HOSTNAME_ENV}:${MONGO_PORT_ENV}/${MONGO_DATABASE_NAME_ENV}?authSource=admin`
  })
}));

app.get('/',  async(req, res) => {

  // await new kittySchema({ name: 'Silence' }).save()

 
  // logger.error("ABCCCC");

  // let _ks =  await kittySchema.findOneAndUpdate({text: 12}, {text: 111}, { new: true, upsert: true  })

  // console.log(_ks)

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

    // const docs = await ContentsSchema.find({ owner_id: 60 });
  // console.log(JSON.stringify(docs))

    let user = await UserSchema.findOne({uid: response.user.uid}) 

    if(!utils.isEmpty(user)){
      let data =  {
                    basic_auth:response.user.basic_auth,
                    session: response.user.session,
                    user: user,
                    my_apps: await ContentsSchema.find({ owner_id: response.user.uid }),
                  }
  
      return res.send({result: true, 
                       execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`,
                       data}); 
    }else{
      return res.send({ result: false, 
        code: response.code,
        execution_time: `Time Taken to execute = ${(end - start)/1000} seconds`
      });
    }
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

  const start = Date.now()
  try {
    let key_word = req.body.key_word;
    let type     = req.body.type;
    let offset   = req.body.offset;
    let full_text_fields = req.body.full_text_fields;

    // console.log('/v1/search >', key_word, type, offset, full_text_fields)

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
          
        // console.log( 'query >', query );
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

        // console.log( 'query >', query );

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

        // console.log( 'query >', query );
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

// Clear cache by keys
app.post('/v1/cache_del',  async(req, res, next)=> {
  try {
    const start = Date.now()
    let keys = req.body.keys;
  
    if(keys === undefined){
      return res.send({ status: false, message:"Without keys" });
    }

    // console.log("keys >> ", keys)
    /*
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
              io.to(socket.socketId).emit('onProfile', user);
            }
            
          })
          break;
        }

        // case 'node':{
        //   break;
        // }
      }
      
    })
    */

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
        io.to(socket.socketId).emit('onContent', {mode, nid, data});
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
        io.to(socket.socketId).emit('onUser', {'mode': mode});
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

    // await new kittySchema({ text: '/v1/syc_local' }).save()

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
                            await AppFollowersSchema.findOneAndUpdate({nid: mf.id}, {value: new_value}, { new: true, upsert: true  })
                          }else{
                            // await new AppFollowersSchema({ nid: mf.id, value: [{uid : uid, status: mf.status, date:Date.now()}] }, {upsert: true}).save()

                            await AppFollowersSchema.findOneAndUpdate({nid: mf.id}, {value: [{uid : uid, status: mf.status, date:Date.now()}]}, { new: true, upsert: true  })
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

                            // let __auth = uids[0].uid
                            // if(__auth){
                            //   let sockets = await SocketsSchema.find({ auth: __auth });
                            //   sockets.map(async(socket) => {
                            //     console.log('/v1/syc_local  หาเจ้าของ Content = ', socket.socketId)
                            //     if(!utils.isEmpty(socket.socketId)){
                            //       global.io.to(socket.socketId).emit('onAppFollowUp', {data: {uid, status: mf.status}});
                            //     }
                            //   })
                            // }
                          }
                          // หาเจ้าของ Content เพือ ส่ง noti ไปแจ้งว่ามี คนกด follow

                          // -----------  AppFollowersSchema  -----------

                          // mf.local = false
                          // return mf
                        })

      let new_my_follows = []
      console.log('/v1/syc_local, new_my_follows #1 : ', uid , ' - ', new_my_follows )
      //-----------------  FollowsSchema  -------------------
      let follow = await FollowsSchema.findOne({ 'uid': uid });
      if(!utils.isEmpty(follow)){
        // 'Not Empty'
        /*
        จะดึงจาก db เก่าแล้วเอามา merge         
        */
        var merge = (a, b, p) => a.filter(aa =>!b.find(bb => aa[p] === bb[p])).concat(b).map((v)=>{  v.local = false; return v });
        new_my_follows = merge(follow.value, my_follows, "id");
      }else{
        new_my_follows = my_follows.map((mf)=>{mf.local = false; return mf})
      }

      console.log('/v1/syc_local, new_my_follows #2 : ', uid , ' - ', new_my_follows )
      await FollowsSchema.findOneAndUpdate({'uid': uid}, {value: new_my_follows},  { new: true, upsert: true })

      // let sockets = await SocketsSchema.find({ auth: uid });
      // sockets.map(async(socket) => {
      //   console.log('/v1/syc_local  socket.socketId = ', socket.socketId, ' - ', uid)
      //   if(!utils.isEmpty(socket.socketId)){
      //     global.io.to(socket.socketId).emit('onMyFollows', {my_follows: new_my_follows});
      //   }
      // })
      //-----------------  FollowsSchema  -------------------
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


app.get('/v1/healthz', async (req, res) =>{
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)

  // let health = await client.cluster.health({});

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

// var request = require('request');
// io.adapter(mongoAdapter( config.mongo.url ));
io.on('connection', async (socket) => {
  // global.socket = socket
  let handshake = socket.handshake;

  var t = handshake.query.t;
  var platform = handshake.query.platform;
  var geolocation = handshake.query.geolocation

  // console.log(handshake.query.unique_id)

  console.log(`Socket ${socket.id} - ${t} - ${geolocation} - ${handshake.auth} - ${handshake.auth.token} connection`)
  // console.log(socket)

  socket.emit('uniqueID', { ...handshake.query, "socketID": socket.id });

  let token = 0
  if(handshake.auth.token !== 0){
    token = handshake.auth.token;

    let  user_schema =await UserSchema.findOne({'uid':token});
    console.log(`Socket UserSchema  ------- >  ${user_schema}  -- ${handshake.auth.token}`)
    if(utils.isEmpty(user_schema)){

      // กรณี เช็ดแล้วไม่มี user ในระบบเราจะสั่งให้ client ที่ connect เข้ามาทำการ logout ออกจากระบบ
      socket.emit('onUser', {'mode': 'delete'});
    }
  }


  await SocketsSchema.findOneAndUpdate({t}, { t, socketId: socket.id, platform,  auth:token, geolocation }, { new: true, upsert: true  })

  socket.on('disconnect', async() => {

    console.log(`Socket ${socket.id} - ${t} disconnect`)

    await SocketsSchema.deleteMany({t})
  });

  socket.conn.on('heartbeat', ()=>{
    if (!socket.authenticated) {
      // Don't start counting as present until they authenticate.
      return;
    }

    console.log(`Heartbeat ${socket.id} - ${t} - ${geolocation} - ${handshake.auth} - ${handshake.auth.token} connection`)
 
  });
});
  

const PORT = process.env.PORT || 8080;
server.listen(PORT, function (err) {
  console.log(`Listening on port - ${PORT}`)

  // connectMongoose().then(() => {
  //   console.log("MongoDb connected - xxx");
  // })

  AppFollowersSchema.watch().on('change', data =>{
    console.log('AppFollowersSchema', data.operationType, data, JSON.stringify(data))

    switch(data.operationType){
      case 'insert':{
        console.log('AppFollowersSchema > insert');
        break;
      } 

      case 'update':{
        console.log('AppFollowersSchema > insert');
        break;
      }
    }
  });

  FollowsSchema.watch().on('change', async data =>{
    console.log('FollowsSchema > init : ', data.operationType, data, JSON.stringify(data))

    switch(data.operationType){
      case 'insert':{
        let followsSchema = await FollowsSchema.findById(data.documentKey._id.toString()) 
        console.log('FollowsSchema > insert : ', JSON.stringify(followsSchema));

        let uid = followsSchema.uid
        let value = followsSchema.value

        let sockets = await SocketsSchema.find({ auth: uid });
        sockets.map(async(socket) => {
          console.log('/v1/syc_local  socket.socketId = ', socket.socketId, ' - ', uid)
          if(!utils.isEmpty(socket.socketId)){
            io.to(socket.socketId).emit('onMyFollows', {my_follows: value});
          }
        })
        break;
      } 

      case 'update':{
        let followsSchema = await FollowsSchema.findById(data.documentKey._id.toString()) 
        console.log('FollowsSchema > update : ', JSON.stringify(followsSchema), followsSchema.uid, followsSchema.value);

        let uid = followsSchema.uid
        let value = followsSchema.value

        let sockets = await SocketsSchema.find({ auth: uid });
        sockets.map(async(socket) => {
          console.log('/v1/syc_local  socket.socketId = ', socket.socketId, ' - ', uid)
          if(!utils.isEmpty(socket.socketId)){
            io.to(socket.socketId).emit('onMyFollows', {my_follows: value});
          }
        })
        
        break;
      }
    }
  });

  ContentsSchema.watch().on('change', async data =>{
    console.log('ContentsSchema > init : ', data.operationType)

    switch(data.operationType){
      case 'insert':
      case 'update':{
        try{
          let cs = await ContentsSchema.findById(data.documentKey._id.toString()) 
          // console.log('ContentsSchema > update : ', JSON.stringify(cs) );

          // "entity:node/397:en"
          if(!utils.isEmpty(cs)){
            await client.index({
              index: "banlist", 
              type: "content",
              id: cs._id + ":"+ cs.owner_id +":"+ cs.nid +":"+ cs.type + ":" + cs.langcode,
              body: {
                ref: cs._id,
                title: cs.title,
                type: cs.type,
                name_surname: cs.name_surname,
                owner_id: cs.owner_id,
                transfer_amount: cs.transfer_amount,
                detail: cs.detail,
                selling_website: cs.selling_website,
                nid: cs.nid,
                id_card_number: cs.id_card_number,
                merchant_bank_account: cs.merchant_bank_account,
                images: cs.images,
                status: cs.status,
                created: cs.created,
                changed: cs.changed,
                langcode: cs.langcode,
              }
            })
          }

        }catch(err) {
          console.log( err );
        }
      
        // let uid = followsSchema.uid
        // let value = followsSchema.value

        // let sockets = await SocketsSchema.find({ auth: uid });
        // sockets.map(async(socket) => {
        //   console.log('/v1/syc_local  socket.socketId = ', socket.socketId, ' - ', uid)
        //   if(!utils.isEmpty(socket.socketId)){
        //     global.io.to(socket.socketId).emit('onMyFollows', {my_follows: value});
        //   }
        // })
        
        break;
      }

      case 'delete':{

        try{
          // let contentsSchema = await ContentsSchema.findById(data.documentKey._id.toString()) 
          console.log('ContentsSchema > delete : ', data.documentKey._id.toString() );

          // let cs = await ContentsSchema.findById(data.documentKey._id.toString()) 
          // console.log('ContentsSchema > delete : ', JSON.stringify(cs) );

          // let uid = followsSchema.uid
          // let value = followsSchema.value

          // let sockets = await SocketsSchema.find({ auth: uid });
          // sockets.map(async(socket) => {
          //   console.log('/v1/syc_local  socket.socketId = ', socket.socketId, ' - ', uid)
          //   if(!utils.isEmpty(socket.socketId)){
          //     global.io.to(socket.socketId).emit('onMyFollows', {my_follows: value});
          //   }
          // })

          // await client.delete({ index: "banlist", type: "content", id: data.documentKey._id.toString() });
  
          const results  = await client.search({
                                                index: 'banlist',
                                                body:  {
                                                "query": {
                                                    "bool": {
                                                        "must": [
                                                            {"match" : { "ref": data.documentKey._id.toString() }},
                                                        ],
                                                    }
                                                },
                                                size: 1,
                                                }
                                            })
          // console.log("body :", body)
          if(results.statusCode === 200){
            let _ids = results.body.hits.hits.map((hit)=>{ return hit._id})
            if(_ids.length > 0){
              const myArr =  _ids[0].split(":");
              let _id = myArr[0];
              let owner_id = myArr[1];
              let nid = myArr[2];
              let type = myArr[3];
              let langcode = myArr[4];

              // console.log("_id : ", _id)
              // console.log("owner_id : ", owner_id)
              // console.log("nid : ", nid)
              // console.log("type : ", type)
              // console.log("langcode : ", langcode)

              console.log('ContentsSchema > delete : nid ', nid)

              io.sockets.emit('onContent', {mode: 'delete', nid});             
            }
          }

          await client.deleteByQuery({  index: 'banlist',
                                        type: 'content',
                                        body: {
                                          query: {
                                              match: { ref: data.documentKey._id.toString() }
                                          }
                                        }
                                      });
        }catch(err) {
          console.log(err);
        }
        break;
      }
    }
  });

  UserSchema.watch().on('change', async data =>{
    console.log('UserSchema > init : ', data.operationType, JSON.stringify(data))
    switch(data.operationType){
      case 'insert':
      case 'update':{
        let user = await UserSchema.findById(data.documentKey._id.toString()) 
        if(!utils.isEmpty(user)){
          let sockets = await SocketsSchema.find({auth: user.uid });
          sockets.map(async(socket) => {
            if(!utils.isEmpty(socket.socketId)){
              io.to(socket.socketId).emit('onProfile', user);
            }
          })
        }
        break;
      }
      case 'delete':{
        let user = await UserSchema.findById(data.documentKey._id.toString()) 

        console.log('UserSchema > delete : ', data.operationType, JSON.stringify(user))
        if(!utils.isEmpty(user)){
          let sockets = await SocketsSchema.find({auth: user.uid });
          // sockets.map(async(socket) => {
          //   if(!utils.isEmpty(socket.socketId)){
          //     io.to(socket.socketId).emit('onUser', {'mode': 'delete'});
          //   }
          // })
        }
        break;
      }
    }
  });

  SocketsSchema.watch().on('change', async data =>{
    console.log('UserSchema > init : ', data.operationType, JSON.stringify(data))
    switch(data.operationType){
      case 'insert':
      case 'update':{
        // let user = await UserSchema.findById(data.documentKey._id.toString()) 
        // if(!utils.isEmpty(user)){
        //   let sockets = await SocketsSchema.find({auth: user.uid });
        //   sockets.map(async(socket) => {
        //     if(!utils.isEmpty(socket.socketId)){
        //       io.to(socket.socketId).emit('onProfile', user);
        //     }
        //   })
        // }
        break;
      }
      case 'delete':{
        // let user = await UserSchema.findById(data.documentKey._id.toString()) 
        // if(!utils.isEmpty(user)){
        //   let sockets = await SocketsSchema.find({auth: user.uid });
        //   sockets.map(async(socket) => {
        //     if(!utils.isEmpty(socket.socketId)){
        //       io.to(socket.socketId).emit('onUser', {'mode': 'delete'});
        //     }
        //   })
        }
        break;
    }
  });



//     console.log();
//     // console.log(socket_connection);

//     // User ทั้งหมดทีมีอยู่ในระบบ
//     People.watch().on('change', data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('People > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('People > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('People > replace');
//           break;
//         }
//         case 'update':{
//           // data.documentKey._id.toString() << จะได้ _id ที่ update 
//           People.findById(data.documentKey._id.toString(), async function (err, user) { 
//             // _.each( user.user_access, ( uv, uk ) => { 
//             //   // จะ emit ตาม socket.id ของแต่ละ device ที่ user access
//             //   io.to(uv.socket_id).emit('update_user', JSON.stringify(user));
//             // });

            
//             if(_.isEmpty(err)){
//               var result = await UserSocketID.findOne({ uid: user.uid });
//               if(!_.isEmpty(result)){
//                 result.data.forEach(function(item){ 
//                   console.log(item.socket_id);
//                   io.to(item.socket_id).emit('update_user', JSON.stringify(user));
//                 });
//               }
//             }
//           });
//           // console.log('People > update > ' + data.documentKey._id.toString());
//           break;
//         }
//         case 'drop':{
//           console.log('People > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('People > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('People > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('People > dropDatabase');
//           break;
//         }
//       }
//     });

//     // รายชือบัญชาธนาคารของ เว็บฯ
//     HuayListBank.watch().on('change', async data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('HuayListBank > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('HuayListBank > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('HuayListBank > replace');
//           break;
//         }
//         case 'update':{
//           console.log('HuayListBank > update');
//           if(socket_local.connected){
//             socket_local.emit("huay_list_bank", JSON.stringify(await HuayListBank.find({})));
//           }
//           break;
//         }
//         case 'drop':{
//           console.log('HuayListBank > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('HuayListBank > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('HuayListBank > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('HuayListBank > dropDatabase');
//           break;
//         }
//       }
//     });

//     // ช่องทางการโอนเงิน
//     TransferMethod.watch().on('change', async data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('TransferMethod > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('TransferMethod > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('HuayListBank > replace');
//           break;
//         }
//         case 'update':{
//           console.log('TransferMethod > update');
//           if(socket_local.connected){
//             socket_local.emit("transfer_method", JSON.stringify(await TransferMethod.find({})));
//           }
//           break;
//         }
//         case 'drop':{
//           console.log('TransferMethod > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('TransferMethod > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('TransferMethod > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('TransferMethod > dropDatabase');
//           break;
//         }
//       }
//     });

 
//     // ข้อมูลติดต่อเว็บฯ
//     ContactUs.watch().on('change', async data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('ContactUs > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('ContactUs > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('ContactUs > replace');
//           break;
//         }
//         case 'update':{
//           console.log('ContactUs > update');
//           // if(socket_local.connected){
//           //   socket_local.emit("contact_us", JSON.stringify(await ContactUs.find({})));
//           // }

//           // var contact_us = await ContactUs.find({});
//           // await cache.setCache('contact_us', contact_us)
//           // io.sockets.emit("contact_us", JSON.stringify( contact_us ));

//           break;
//         }
//         case 'drop':{
//           console.log('ContactUs > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('ContactUs > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('ContactUs > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('ContactUs > dropDatabase');
//           break;
//         }
//       }
//     });

//     // รายชือธนาคารทั้งหมด
//     ListBank.watch().on('change', async data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('ListBank > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('ListBank > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('ListBank > replace');
//           break;
//         }
//         case 'update':{
//           console.log('ListBank > update');

//           // if(socket_local.connected){
//           //   socket_local.emit("list_bank", JSON.stringify(await ListBank.find({})));
//           // }

//           // var list_bank = await ListBank.find({});
//           // await cache.setCache('list_bank', list_bank)
//           // io.sockets.emit("list_bank", JSON.stringify( list_bank ));

//           break;
//         }
//         case 'drop':{
//           console.log('ListBank > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('ListBank > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('ListBank > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('ListBank > dropDatabase');
//           break;
//         }
//       }
//     });

//     Lotterys.watch().on('change', async data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('Lotterys > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('Lotterys > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('Lotterys > replace');
//           break;
//         }
//         case 'update':{
//           console.log('Lotterys > update');

//           // var lotterys = await Lotterys.find({});
//           // await cache.setCache('lotterys', lotterys)
          
//           // io.sockets.emit("lotterys", JSON.stringify( lotterys ));
//           break;
//         }
//         case 'drop':{
//           console.log('Lotterys > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('Lotterys > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('Lotterys > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('Lotterys > dropDatabase');
//           break;
//         }
//       }
//     });

//     ShootNumbers.watch().on('change', async data =>{
//       console.log(new Date(), data)

//       // console.log(new Date(), data.documentKey._id.toString())
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('ShootNumbers > insert');
//           // if(socket_local.connected){
//           //   let find= await ShootNumbers.find({});
//           //   io.sockets.emit("shoot_numbers", JSON.stringify(find));
//           // } 
          
//           /*
//           let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
//           if(find){
//             io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(find));
//           }
//           */

//           /*
//          let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
//          // console.log(find)
//          if(find){
//            let data = await ShootNumbers.findOne({ round_id: find.round_id });
//            io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
//          }
//          */

//           // let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
//           // // console.log(find)
//           // if(find){
//           //   let data = await ShootNumbers.find({ round_id: find.round_id });

//           //   await cache.setCache("shoot_numbers_" + find.round_id + "_" + find.date, data)

//           //   io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
//           // }
//           break;
//         }
//         case 'delete':{
//           console.log('ShootNumbers > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('ShootNumbers > replace');
//           break;
//         }
//         case 'update':{
//           console.log('ShootNumbers > update');
//           /*
//           let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
//           // console.log(find)
//           if(find){
//             let data = await ShootNumbers.findOne({ round_id: find.round_id });
//             io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
//           }
//           */

// //          await ShootNumbers.create({ round_id: req.body.round_tid, 
// //           number: req.body.data, 
// //              uid: user.uid,
// //             date: req.body.date,
//     //       });

//     // let data = await ShootNumbers.findOne({round_id: req.body.round_tid});

//           // let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
//           // // console.log(find)
//           // if(find){
//           //   let data = await ShootNumbers.find({ round_id: find.round_id });

//           //   await cache.setCache("shoot_numbers_" + find.round_id + "_" + find.date, data)

//           //   io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
//           // }
         
//           break;
//         }
//         case 'drop':{
//           console.log('ShootNumbers > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('ShootNumbers > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('ShootNumbers > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('ShootNumbers > dropDatabase');
//           break;
//         }
//       }
//     });

//     /*
//     AwardsModel.watch().on('change', async data =>{
//       console.log(new Date(), data)

//       // console.log(new Date(), data.documentKey._id.toString())
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('AwardsModel > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('AwardsModel > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('AwardsModel > replace');
//           break;
//         }
//         case 'update':{
//           console.log('AwardsModel > update');
//           break;
//         }
//         case 'drop':{
//           console.log('AwardsModel > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('AwardsModel > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('AwardsModel > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('AwardsModel > dropDatabase');
//           break;
//         }
//       }
//     });
//     */
   
//     UserSocketID.watch().on('change', async data =>{
//       console.log(new Date(), data)
//       //operationType
//       switch(data.operationType){
//         case 'insert':{
//           console.log('UserSocketID > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('UserSocketID > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('UserSocketID > replace');
//           break;
//         }
//         case 'update':{
//           console.log('UserSocketID > update');
          
//           // socket_local.emit("shoot_numbers", JSON.stringify(await ShootNumbers.find({})));
//           break;
//         }
//         case 'drop':{
//           console.log('UserSocketID > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('UserSocketID > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('UserSocketID > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('UserSocketID > dropDatabase');
//           break;
//         }
//       }
//     });

//     DepositStatus.watch().on('change', async data =>{
//       switch(data.operationType){
//         case 'insert':{
//           console.log('DepositStatus > insert');
//           break;
//         }
//         case 'delete':{
//           console.log('DepositStatus > delete');
//           break;
//         }
//         case 'replace':{
//           console.log('DepositStatus > replace');
//           break;
//         }
//         case 'update':{
//           console.log('DepositStatus > update');
//           if(socket_local.connected){
//             socket_local.emit("deposit_status", JSON.stringify(await DepositStatus.find({})));
//           }
//           break;
//         }
//         case 'drop':{
//           console.log('DepositStatus > drop');
//           break;
//         }
//         case 'rename':{
//           console.log('DepositStatus > rename');
//           break;
//         }
//         case 'dropDatabase':{
//           console.log('DepositStatus > dropDatabase');
//           break;
//         }
//         case 'invalidate':{
//           console.log('DepositStatus > dropDatabase');
//           break;
//         }
//       }
//     });

//     // sessionMongoStore.all(function(error, sessions){
//     //   console.log(sessions);
//     // })
//   }).catch(err => {
//     console.log( 'DB Connection Error: ${err.message}' );
//   });

})