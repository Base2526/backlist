const PORT = 3000;
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const _ = require('lodash')
const app   = require('express')();
var cookieParse = require('cookie-parser')();
var session = require('express-session')
var passport = require('passport');
var passportInit = passport.initialize();
var passportSession = passport.session();
const MongoStore = require('connect-mongo')(session);
const http  = require('http');
const server= http.createServer(app);
let io = require('socket.io')(server);

const path = require("path");
const multer = require("multer");
const fs = require('fs');
const FormData = require('form-data'); 


const Product         = require('./models/product')
const People          = require('./models/people')
const ContactUs       = require('./models/contact_us')
const HuayListBank    = require('./models/huay_list_bank')
const TransferMethod  = require('./models/transfer_method')
const ListBank        = require('./models/list_banck')
const Lotterys        = require('./models/lotterys')
const ShootNumbers    = require('./models/shoot_numbers')
const UserSocketID    = require('./models/user_socket_id')
const DepositStatus   = require('./models/deposit_status')
const AwardsModel     = require('./models/awards')
const ChitsModel      = require('./models/chits')

const connectMongoose = require("./src/connection")
const User            = require("./src/User.model")
const config          = require("./src/utils/config")

const utils           = require("./src/utils/utils")

const cache           = require("./src/utils/cache")



////////////////// redis /////////////////////

const { promisify } = require("util");
const { isEmpty } = require('lodash');

const redisClient = require("redis").createClient;
const redis = redisClient({
  host: "redis"
});
const getAsync = promisify(redis.get).bind(redis);

////////////////// redis /////////////////////

var socket_local;
// var session_local;

require('./src/utils/log-interceptor')(server);

var sessionMongoStore =  new MongoStore({url: config.mongo.url});
var sessionMiddleware = session({ 
  store: sessionMongoStore,
  secret: config.session.secret, 
  resave: false, 
  saveUninitialized: true,
  // expires: 30 * 24 * 60 * 60 * 1000
  // cookie: {
  //   expires = new Date(Date.now() + 720),
  //   maxAge  = 24
  // }
  // cookie:{
  //   expires: new Date(Date.now() + 720),
  //   maxAge: 60 * 60 * 1000
  // }
  // https://stackoverflow.com/questions/18760461/nodejs-how-to-set-express-session-cookie-not-to-expire-anytime
  cookie: {expires: new Date(253402300000000)} 
})

/////////  multer /////////////
// const storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function(req, file, cb){
//      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000000},
// }).single("myImage");

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /*
      Files will be saved in the 'uploads' directory. Make
      sure this directory already exists!
    */
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    /*
      uuidv4() will generate a random ID that we'll use for the
      new filename. We use path.extname() to get
      the extension from the original file name and add that to the new
      generated ID. These combined will create the file name used
      to save the file on the server and will be available as
      req.file.pathname in the router handler.
    */
    const newFilename = "IMAGE-" + Date.now() + `${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

/////////  multer /////////////
app.use(sessionMiddleware)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.use(function(socket, next){
  socket.client.request.originalUrl = socket.client.request.url;
  cookieParse(socket.client.request, socket.client.request.res, next);
});

io.use(function(socket, next){
  socket.client.request.originalUrl = socket.client.request.url;
  sessionMiddleware(socket.client.request,   socket.client.request.res, next);
});

io.use(function(socket, next){
  passportInit(socket.client.request, socket.client.request.res, next);
});

io.use(function(socket, next){
  passportSession(socket.client.request, socket.client.request.res, next);
});

app.get('/session', (req, res) => {
  let sess = req.session
  console.log(sess)
  res.send({_id: 'test' })
})

app.get('/api/hello', async(req, res) => {

  // set & update cache
  // await redis.set('title', JSON.stringify({'key':'value'}));

  /*
  redis.set(title, JSON.stringify(doc), function () {
                        callback(doc);
                    });
  */

  // get cacke by key
  // let getTitleDataFromCache = await getAsync('title');

  // console.log( getTitleDataFromCache );

  // console.log(cache.getCache('1'));

  /*
  const getUserProfile = async(uid)=>{
  var user = await cache.getCache(uid)

  if(isEmpty(user)){
    user = await People.find({ uid });
    await cache.setCache(uid, user)
  }
  */

  console.log(await getUserProfile('15'))

  res.send({ express: 'Hello From Express' });
});

app.get('/api/get_cache', async(req, res) => {
  let c = await cache.getCache('1');
  console.log(c)

  res.send({ express: 'Hello From Express' });
});


app.get('/api/set_cache', async(req, res) => {
  let vv = await cache.setCache('1', {'key1':'somkid', 'key2':'simajarn'})

  console.log(vv)
  res.send({ express: 'Hello From Express' });
});

// clearCache
app.get('/clear_cache', (req, res) => {
  cache.clearCache()

  io.sockets.emit("clear_cache", JSON.stringify({}));
  res.send({'result': true});
});


var sid = 0
app.get('/s', async (req, res) => {


  // ShootNumbers

  let round_id = '125';
  let date = 'date';

  let data = await ShootNumbers.find({ round_id: round_id, date: date });
  
  var p1=0, p16=0, sum = 0;
  data.sort((a, b) => b.createdAt - a.createdAt).forEach((v, i) => {
    sum +=parseInt(v.number)
    switch(i){
      case 0:{
        p1 = v.number;
        break;
      }

      case 15:{
        p16 = v.number;
        break;
      }
    }
  })

  console.log(p1, p16, sum)

  await cache.setCache("shoot_numbers_" + round_id + "_" + date, { p1, p16, sum, data })

  /**
   
       var fs = await cache.getCache("shoot_numbers_" + req.query.tid + "_" + req.query.date);
    if(_.isEmpty(fs)){

      let data = await ShootNumbers.find({ round_id: req.query.tid });

      await cache.setCache("shoot_numbers_" + req.query.tid + "_" + req.query.date, data)
* 
  */
  res.send({'result': true});
})

app.get('/c', async (req, res) => {
  sessionMongoStore.get(sid, function(error, session){
    console.log(error);
    console.log(session);
  })
})

app.get('/d', async (req, res) => {
  // req.session.destroy(function(err) {
  //   // cannot access session here
  // })



})

app.get('/',  async(req, res) => {

  let sess = req.session;

  sid = sess.id;
  console.log(sess.id);

  socket_local.emit("FromAPI", {'test':'dog'});

  // console.log(sessionMongoStore);

  // let perm = await permission2(req);
  // console.log(perm);

  // sessionMongoStore.get(req.session.id, function(error, session){
  //   if (error === null){
      
  //   }else{
  //     res.send({result:false, status: '0', message: error}); ;
  //   }
  // })

  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {
    res.send({'result': true});
  }else{
    res.send({result:false, status: '-1'}); ;
  }

  // mongoStore.all(function(error, sessions){
  //   console.log(sessions);
  // })

  // mongoStore.clear(function(error){
  //   console.log(error);
  // })

  

  // var payload = {
  //                 "name": "My Product from Postman",
  //                 "category": "Tool",
  //                 "price": 0,
  //                 "tags": ["test1", "test2", "tag1"]
  //               };
  // const product = new Product(payload)
  // await product.save()

  /*
  var payload = {
    roles: [
      'authenticated'
    ],
    banks: [],
    uid: '100',
    name: 'u999',
    email: 'u8444@local.local',
    image_url: '',
    credit_balance: 0,
    user_access: {
        '33': {
            cookie: 'VHFv0tPi8CxmEDvuKK9ZHiTIRWklC_z6alB0eiCVIRM',
            socket_id: 'jF1A4VO9T-Wzc8u4AAAD'
        },
        '34': {
            cookie: 'vKZraSjZVEasMEXptUoKMFc2dPVF_t71tKg5O76qG58',
            socket_id: '8yxwDFSBHu0IlmOEAAAD'
        }
    },
  };
  const people = new People(payload)
  await people.save()

  res.send('OOP Chat Server is running on port 8080');
  */

  // fetch('http://localhost:8055/api/login.json', {method: 'GET', body: 'a=1'})
	// .then(res => res.json()) // expecting a json response
  // .then(json => console.log(json));
  
});

app.post('/api/login', async(req, res) => {
  if(config.d8.debug){
    console.log(req);
    console.log(req.body);
    console.log(config.d8.headers);
  }
  // sessionMongoStore.touch(req.session.id, req.session, function(error){
  //   console.log('mongoStore.touch');
  // })
  
  if (req.headers.authorization == "aHVheQ==" ) {
    config.d8.headers['session'] = req.session.id;
    var data = {
      "name": req.body.name,
      "pass": req.body.pass
    }
    const responses = await fetch(config.d8.api_login, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)});
    const response = await responses.json();
    console.log(response); 
    if(response.result){
      // session_local = response.data;
  
      var lotterys = await cache.getCache('lotterys');
      console.log(lotterys)
      if(isEmpty(lotterys)){
        lotterys   = await Lotterys.find({});
        await cache.setCache('lotterys', lotterys)
      }else{
        console.log('cache >lotterys')
      }

      var huay_list_bank = await cache.getCache('huay_list_bank');
      if(isEmpty(huay_list_bank)){
        huay_list_bank   = await HuayListBank.find({});
        await cache.setCache('huay_list_bank', huay_list_bank)
      }else{
        console.log('cache >huay_list_bank')
      }

      // const transfer_method = await TransferMethod.find({});
      var transfer_method = await cache.getCache('transfer_method');
      if(isEmpty(transfer_method)){
        transfer_method   = await TransferMethod.find({});
        await cache.setCache('transfer_method', transfer_method)
      }else{
        console.log('cache >transfer_method')
      }

      // const contact_us      = (await ContactUs.find({}))[0];
      var contact_us = await cache.getCache('contact_us');
      if(isEmpty(contact_us)){
        contact_us   = (await ContactUs.find({}))[0];
        await cache.setCache('contact_us', contact_us)
      }else{
        console.log('cache >contact_us')
      }

      // const list_bank       = await ListBank.find({});
      var list_bank = await cache.getCache('list_bank');
      if(isEmpty(list_bank)){
        list_bank   = await ListBank.find({});
        await cache.setCache('list_bank', list_bank)
      }else{
        console.log('cache >list_bank')
      }

      // const deposit_status       = await DepositStatus.find({});
      var deposit_status = await cache.getCache('deposit_status');
      if(isEmpty(deposit_status)){
        deposit_status   = await DepositStatus.find({});
        await cache.setCache('deposit_status', deposit_status)
      }else{
        console.log('cache >deposit_status')
      }

      var _people = await People.findOne({ uid: response.data.uid });

      if(!_.isEmpty(_people)){  
        var user = _people.toObject();
        user.session =  req.session.id;

        res.send({
          result: true,
          user,
          lotterys,
          huay_list_bank,
          transfer_method,
          contact_us,
          list_bank,
          deposit_status
        })
      }else{
        res.send({'result': false});
      }
    }else{
      res.send(response);
    }
  }else{
    // http://expressjs.com/en/4x/api.html#res.status
    res.status(403).send({ error: "Forbidden" });
  }
});

// 
app.post('/api/register', async(req, res) => {
  if(config.d8.debug){
    console.log(req);
    console.log(req.body);
    console.log(config.d8.headers);
  }
  
  if (req.headers.authorization == "aHVheQ==" ) {
    config.d8.headers['session'] = req.session.id;
    var data = {
      "name": req.body.name,
      "pass": req.body.pass
    }
    /*
    const responses = await fetch(config.d8.api_login, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)});
    const response = await responses.json();
    console.log(response); 
    if(response.result){
      // session_local = response.data;
  
      const lotterys        = await Lotterys.find({});
      const huay_list_bank  = await HuayListBank.find({});
      const transfer_method = await TransferMethod.find({});
      const contact_us      = (await ContactUs.find({}))[0];
      const list_bank       = await ListBank.find({});

      var _people = await People.findOne({ uid: response.data.uid });

      if(!_.isEmpty(_people)){  
        var user = _people.toObject();
        user.session =  req.session.id;

        res.send({
          result: true,
          user,
          lotterys,
          huay_list_bank,
          transfer_method,
          contact_us,
          list_bank
        })
      }else{
        res.send({'result': false});
      }
    }else{
      res.send(response);
    }
    */
  }else{
    // http://expressjs.com/en/4x/api.html#res.status
    res.status(403).send({ error: "Forbidden" });
  }
});

// https://www.codota.com/code/javascript/functions/express-session/Session/destroy
app.post('/api/logout', (req, res) => {
  console.log(req.body);
  console.log(config.d8.headers);

  req.session.destroy();
  res.send({'result': true});

  /*
  config.d8.headers['session'] = req.session.id;
  var data = {
    "uid": req.body.uid
  }
  fetch(config.d8.api_logout, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
    .then((res) => {
      return res.json()
  })
  .then((json) => {
    console.log(json);
    // Do something with the returned data.

    req.session.destroy();
    // session_local = null;

    res.send(json);
  });
  */
});

app.post('/api/list_bank', (req, res) => {
  if(config.d8.debug){
    console.log(req);
    console.log(req.body);
    console.log(config.d8.headers);
  }

  var data = {}
  fetch(config.d8.api_list_bank, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
    .then((res) => {
      return res.json()
  })
  .then((json) => {
    console.log(json);
    // Do something with the returned data.

    res.send(json);
  });
});

app.post('/api/add_bank', async (req, res) => {
  if(config.d8.debug){
    console.log(req);
    console.log(config.d8.headers);
  }

  if(!permission(req)){
    res.send({'result': false});
  }else{
    var data = {
      "uid": req.body.uid,
      "tid_bank": req.body.tid_bank,
      "name_bank": req.body.name_bank,
      "number_bank": req.body.number_bank,
    }
  
    fetch(config.d8.api_add_bank, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
      .then((res) => {
        return res.json()
    })
    .then((json) => {
      console.log(json);
      // Do something with the returned data.
  
      res.send(json);
    });
  }
});

app.post('/api/delete_bank', (req, res) => {
  if(config.d8.debug){
    console.log(req.body);
    console.log(config.d8.headers);
  }

  if(!permission(req)){
    res.send({'result': false});
  }else{
    var data = {
      "uid": req.body.uid,
      "target_id": req.body.target_id,
    }
  
    fetch(config.d8.api_delete_bank, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
      .then((res) => {
        return res.json()
    })
    .then((json) => {
      console.log(json);
      // Do something with the returned data.
  
      res.send(json);
    });
  }
});

app.post('/api/withdraw', async(req, res) => {
  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  
    var data = {
      "uid"               : req.body.uid,
      "user_id_bank"      : req.body.user_id_bank,
      "amount_of_withdraw": req.body.amount_of_withdraw,
      "note"              : req.body.note
    }
  
    fetch(config.d8.api_withdraw, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
      .then((res) => {
        return res.json()
    })
    .then((json) => {
      console.log(json);
      // Do something with the returned data.
  
      res.send(json);
    });
  }else{
    res.send({result:false, status: '-1'}); ;
  }
});

app.post('/api/bet', async(req, res) => {
  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  
    // var data = {
    //   "uid"       : req.body.uid,
    //   "data"      : req.body.data
    // }

    // let data = 'stackabuse.com';
    // let buff = new Buffer(data);
    // let base64data = buff.toString('base64');

    // console.log('"' + data + '" converted to Base64 is "' + base64data + '"');

    let buff = new Buffer(req.body.data, 'base64');
    let data = JSON.parse(buff.toString());

    if(new Date(data.round.date) >= new Date()){
      // console.log( 'สามารถซื้อได้' );
      // fetch(config.d8.api_bet, { method: 'POST', headers: config.d8.headers, body: JSON.stringify({"uid": req.body.uid, "data": req.body.data})})
      //   .then((res) => {
      //     return res.json()
      // })
      // .then((json) => {
      //   console.log(json);
      //   res.send(json);
      // });


      console.log(data)

      // ChitsModel
      /*
      chait_type: String,
        data: [],
        round: {}
      */

      res.send({'result': true, 'data':await ChitsModel.create({ 
                                    uid: req.body.uid,
                                    chait_type: data.chait_type, 
                                    data: data.data, 
                                    round: data.round,
                                })
                });
    }else{
      res.send({result:false, status: '-1', message:'Timeout'});
    }
  }else{
    res.send({result:false, status: '-1'}); ;
  }
});

app.post('/api/bet_cancel', async(req, res) => {
  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  
    var data = {
      "uid"      : req.body.uid,
      "nid"      : req.body.nid,
      "time"     : req.body.time
    }

    fetch(config.d8.api_bet_cancel, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
      .then((res) => {
        return res.json()
    })
    .then((json) => {
      console.log(json);
      res.send(json);
    });
  }else{
    res.send({result:false, status: '-1'}); ;
  }
});

app.post('/api/shoot_number', async(req, res) => {
  let start_time = new Date();
  
  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  
    // เราต้องเอาเวลาของ round มาคิดด้วยถ้าเลยเวลาเราจะไม่ให้มี การเพิ่ม
    if(new Date(req.body.date) >= new Date()){
      let data = await ShootNumbers.create({ round_id: req.body.round_tid, 
                                               number: req.body.data, 
                                                  uid: req.body.uid,
                                                  user: (await getUserProfile(req.body.uid)),
                                                 date: req.body.date,
                              });
      res.send({result:true, data, execution_time: (new Date() - start_time) });
    }else{
      res.send({result:false, status: '-1', message:'Timeout'});
    }
  }else{
    res.send({result:false, status: '-1'});
  }
});

app.get("/api/shoot_number_by_tid", async (req, res) => {
  let start_time = new Date();

  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  
    // let fs = await ShootNumbers.findOne({round_id: req.query.tid});

    var fs = await cache.getCache("shoot_numbers_" + req.query.tid + "_" + req.query.date);
    if(_.isEmpty(fs)){

      let data = await ShootNumbers.find({ round_id: req.query.tid });

      await cache.setCache("shoot_numbers_" + req.query.tid + "_" + req.query.date, data)

      if(_.isEmpty(data)){
        res.send({ result:false, data: {} });
      }else{
        res.send({ result:true, data, execution_time: (new Date() - start_time) });
      }
    }else{
      res.send({ result:true, data: fs, execution_time: (new Date() - start_time) });
    }
  }else{
    res.send({result:false, status: '-1'});
  }
});

// 
app.get("/api/get_people_by_uid", async (req, res) => {
  let start_time = new Date();

  let fs = await People.findOne({uid: req.query.uid});
  if(_.isEmpty(fs)){
    res.send({ result:false, data: {} });
  }else{
    res.send({ result:true, data: fs, execution_time: (new Date() - start_time) });
  }
});

app.get("/users", async (req, res) => {
  console.log(`/user`);
  const users = await User.find();

  res.json(users);
});

app.get("user-create", async (req, res) => {
  console.log(`/user-create`);
  const user = new User({ username: "userTest" });

  await user.save().then(() => console.log("User created"));

  res.send("User created \n");
});

app.post("/api/contact-us", async (req, res) => {
  let ct = await ContactUs.find({});
  if (ct === undefined || ct.length == 0) {
    // array empty or does not exist
  }
  res.send({result: true, data: ct[0]});
});


/////////  multer /////////////
app.post('/api/add-deposit', upload.single('attached_file'), async (req, res) => {
  /*
    We now have a new req.file object here. At this point the file has been saved
    and the req.file.filename value will be the name returned by the
    filename() function defined in the diskStorage configuration. Other form fields
    are available here in req.body.
  */

  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  
    var formData = new FormData();
    if(req.file !== undefined){
      formData.append('attached_file', fs.createReadStream(req.file.path));
    }
    formData.append('uid', req.body.uid);
    formData.append('hauy_id_bank', req.body.hauy_id_bank);
    formData.append('user_id_bank', req.body.user_id_bank);
    formData.append('transfer_method', req.body.transfer_method);
    formData.append('amount', req.body.amount);
    formData.append('date_transfer', req.body.date_transfer);
    formData.append('note', req.body.note);
  
    fetch(config.d8.api_add_deposit, {
      method: 'POST',
      headers: formData.getHeaders(),
      body: formData
    }).then((res) => {
      return res.json()
    })
    .then((json) => {

      // ลบไฟล์เพราะจะเก็บไว้ที่ drupal เพราะมีระบบจัดไฟล์ทั้งหมด
      if(req.file !== undefined){
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err)
            return
          }
          //file removed
        })
      }

      res.send(json);
    });
  }else{
    res.send({result:false, status: '-1'}); ;
  }
});
/////////  multer /////////////

///////// ดึงรายการ ฝาก/ถอน //////////
// app.post('/api/request_all', async(req, res) => {
//   let is_session = await sessionMongoStore.get(req.session.id);
//   if (is_session !== undefined) {  
//     var data = {
//       "uid"       : req.body.uid,
//     }
//     console.log(config.d8.headers);
//     fetch(config.d8.api_request_all, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
//       .then((res) => {
//         return res.json()
//     })
//     .then((json) => {
//       res.send(json);
//     });
//   }else{
//     res.send({result:false, status: '-1'}); ;
//   }
// });
///////// ดึงรายการ ฝาก/ถอน //////////

// config.d8.get_yeekee_answer 
app.post('/api/get_yeekee_answer', async(req, res) => {
  let start_time = new Date();

  let is_session = await sessionMongoStore.get(req.session.id);
  if (is_session !== undefined) {  

    if( _.isEmpty(req.body.uid) || 
        _.isEmpty(req.body.type_lotterys)|| 
        _.isEmpty(req.body.date) || 
        _.isEmpty(req.body.round_tid) ){
      res.send({result:false, status: '-2'});
    }

    let {type_lotterys, date, round_tid} = req.body

    // console.log(uid);
    // console.log(type_lotterys);
    // console.log(date);
    // console.log(round_tid);

    let hashkey = type_lotterys +'_'+ round_tid +'_'+ date;

    var data = await cache.getCache(hashkey)
    console.log(data);
    if(isEmpty(data)){
    
      var sn_data = await ShootNumbers.find({ round_id: round_tid.toString(), date: date.toString() });
      
      var p1={}, p16={}, sum = 0;
      sn_data.sort((a, b) => b.createdAt - a.createdAt).forEach((v, i) => {
        sum +=parseInt(v.number)
        switch(i){
          case 0:{
            p1 = v;
            break;
          }
    
          case 15:{
            p16 = v;
            break;
          }
        }
      })
    
      // console.log(p1, p16, sum)

      data = { round_tid, type_lotterys, date, p1, p16, sum, sn_data }
    
      await cache.setCache(hashkey, data)
    }

    res.send({ result:true, data, execution_time: (new Date() - start_time) });
  }else{
    res.send({result:false, status: '-1'}); ;
  }
});

// var request = require('request');
// io.adapter(mongoAdapter( config.mongo.url ));
io.on('connection', (socket) => { 
  let handshake = socket.handshake;
  // console.log(socket);
  // console.log(handshake);
  // console.log(socket.id);
  // console.log(handshake.time);
  // console.log(handshake.query);
  // console.log(`Socket ${socket.id} connected.`);

  socket_local = socket;

  update_socket_id(socket);

  // connectDb().then( async (db) => {
  //   console.log("MongoDb connected >> connection");

  //   var payload = {
  //     uid:socket.handshake.query.uid,
  //     socket
  //   };
  //   console.log(payload);
  //   const __io = new _io(payload)
  //   await __io.save()

  //   // const people = new People(payload)
  //   // await people.save()
  // });  



  // console.log("user-agent: "+socket.request.headers['user-agent']);
  // request('http://localhost/rest/api/get?_format=json', function (error, response, body) {
  //     // if (!error && response.statusCode == 200) {
  //         console.log(response) // Print the google web page.
  //     // }
  // })

  // request.get("http://www.google.com", (error, response, body) => {
  //     if(error) {
  //       // return console.dir(error);
  //       console.log(error) 
  //     }
  //     // console.dir(JSON.parse(body));

  //     console.log(body) 
  // });

  // request('http://web/rest/api/get?_format=json', function (error, response, body) {
  //      // if (!error && response.statusCode == 200) {
  //      console.log(response) // Print the google web page.
  //      console.log(body)
  //      // }
  // })

  socket.conn.on('heartbeat', async function() {
    console.log('#1 > ');
    // console.log(socket);

    let is_session = await sessionMongoStore.get(handshake.query.session);

    if (is_session !== undefined) {
      return;
    }else{
      let doc = await UserSocketID.findOne({ uid: handshake.query.uid });
      console.log(doc);

      if(!_.isEmpty(doc)){

        var socket_id = 0;
        doc.data.forEach(function(element) 
        { 
          if(element.session == handshake.query.session){
            socket_id = element.socket_id;
          }
        });

        await sessionMongoStore.destroy(handshake.query.session);
        
        io.to(socket_id).emit('force_logout', JSON.stringify({'system': true}));
      }
    }

    // 
 
    // console.log(is_session);
    // if (!socket.authenticated) {
    //   // Don't start counting as present until they authenticate.
    //   return;
    // }

    // console.log('#2');
    //Presence.upsert(socket.id, {
    //  username: socket.username
    //});
  });

  /*
  สร้าง event ไว้รอรับข้อความจาก react-native
  */
  socket.on("chat_message", msg => {
    // console.log(msg);
    // io.emit("chat_message", 'bbu');

    // socket.authenticated = true;

    io.sockets.in('room1').emit('response_message', 'what is going on, party people?');
  });

  socket.on('create', function(room) {
    socket.join(room);
    console.log(this);
  });

  // interval = setInterval(() => getApiAndEmit(socket), 10000);
  
  socket.on('disconnect', () => {
    
    update_socket_id(socket);
    console.log(`Socket ${socket.id} disconnected.`);
  });

  socket.on("get_list_of_clients_in_specific_room", msg => {

    console.log(io.sockets.connected);
    // var roster = io.sockets.clients('room1');

    // roster.forEach(function(client) {
    //     console.log('Username: ' + client.nickname);
    // }); 
  });
});

async function update_socket_id(socket){
  return true;

  // var cookief =socket.handshake.headers.cookie; 
  // var cookies = cookie.parse(socket.handshake.headers.cookie);
  // console.log(socket.connected);
  // console.log(cookief);
  // console.log(cookies);
  // console.log(session_local);

  if(socket.connected){
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    let doc = await UserSocketID.findOne({ uid: socket.handshake.query.uid });

    if(!_.isEmpty(doc)){
      var new_data=[]

      var isset = true;
      doc.data.forEach(function(element) 
      { 
        if(element.session == socket.handshake.query.session){
          isset = false;
          new_data.push({session:element.session, socket_id: socket.id, updated: new Date});
        }else{
          new_data.push(element);
        }
      });

      if(isset){
        new_data.push({session:socket.handshake.query.session, socket_id: socket.id, updated: new Date});
      }

      const filter = { uid:socket.handshake.query.uid };
      const update = { data: new_data };
      await UserSocketID.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert กรณีทียังไม่มีจะทำการสร้างให้
      });
    }else{
      
      const filter = { uid:socket.handshake.query.uid };
      const update = { data: {session:socket.handshake.query.session, socket_id: socket.id,updated: new Date} };
      await UserSocketID.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert กรณีทียังไม่มีจะทำการสร้างให้
      });
    }
  }else{
    // ลบกรณี disconnected
    let doc = await UserSocketID.findOne({ uid: socket.handshake.query.uid });
    var new_data=[]
    doc.data.forEach(function(element){ 
        if(element.session != socket.handshake.query.session){
          new_data.push(element);
        }
    });

    const filter = { uid:socket.handshake.query.uid };
    const update = { data: new_data };
    await UserSocketID.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true // Make this update into an upsert กรณีทียังไม่มีจะทำการสร้างให้
    });
  }

  // var data = {
  //   "uid"           : socket.handshake.query.uid,
  //   "socket_id"     : socket.id,
  //   "connected"     : socket.connected,
  //   "disconnected"  : socket.disconnected
  // }
  // console.log(socket);

  // config.d8.headers['session'] = socket.client.request.session.id;
  // await fetch(config.d8.api_update_socket_io, { method: 'POST', headers: config.d8.headers, body: JSON.stringify(data)})
  //   .then((res) => {
  //     return res.json()
  // })
  // .then((json) => {
  //   console.log(json);
  // });
}
// main();

/*async*/ function permission(req){
  return true;
  /*
  let user = await UserSocketID.findOne({ uid: req.headers.uid });
  if(!_.isEmpty(user)){
    var result = user.data.find(item => item.session === req.headers.authorization);
    
    console.log(result)
    if(!_.isEmpty(result)){
      return true;
    }
  }
  return false;
  */

  // let sess = req.session;

//  sid = sess.id;
//  console.log(sess.id);

//  console.log(sessionMongoStore);

  // sessionMongoStore.get(req.session.id, function(error, session){
  //   console.log(error);
  //   console.log(session);

  //   if (error === null){
  //     if (session !== undefined) {
  //       console.log('#1');
  //     }else{
  //       console.log('#2');
  //     }
  //   }else{
  //     console.log('#3');
  //   }
  // })
}


const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client

  // จะส่งไปทุกๆ  socket.on('FromAPI', (messageNew) => ในส่วน reactjs
  // socket.emit("FromAPI", response);

  // จะส่งไปตามแต่ละ socket.id
  // io.to('vwMRV1tla8OILFnWAAAC').emit('FromAPI', 'for your eyes only');
};

const getUserProfile = async(uid)=>{
  var user = await cache.getCache(uid)

  if(isEmpty(user)){
    user = await People.findOne({ uid });

    user = {uid, email: user.email, name: user.name }
    await cache.setCache(uid, user)
  }

  return user
}

// io.on('disconnect', () => {
//   console.log("disconnection");
// });
// server.listen(PORT);
server.listen(PORT, function (err) {
  console.log('listening on port 8080')

  connectMongoose().then(() => {
    console.log("MongoDb connected");

    console.log();
    // console.log(socket_connection);

    // User ทั้งหมดทีมีอยู่ในระบบ
    People.watch().on('change', data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('People > insert');
          break;
        }
        case 'delete':{
          console.log('People > delete');
          break;
        }
        case 'replace':{
          console.log('People > replace');
          break;
        }
        case 'update':{
          // data.documentKey._id.toString() << จะได้ _id ที่ update 
          People.findById(data.documentKey._id.toString(), async function (err, user) { 
            // _.each( user.user_access, ( uv, uk ) => { 
            //   // จะ emit ตาม socket.id ของแต่ละ device ที่ user access
            //   io.to(uv.socket_id).emit('update_user', JSON.stringify(user));
            // });

            
            if(_.isEmpty(err)){
              var result = await UserSocketID.findOne({ uid: user.uid });
              if(!_.isEmpty(result)){
                result.data.forEach(function(item){ 
                  console.log(item.socket_id);
                  io.to(item.socket_id).emit('update_user', JSON.stringify(user));
                });
              }
            }
          });
          // console.log('People > update > ' + data.documentKey._id.toString());
          break;
        }
        case 'drop':{
          console.log('People > drop');
          break;
        }
        case 'rename':{
          console.log('People > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('People > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('People > dropDatabase');
          break;
        }
      }
    });

    // รายชือบัญชาธนาคารของ เว็บฯ
    HuayListBank.watch().on('change', async data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('HuayListBank > insert');
          break;
        }
        case 'delete':{
          console.log('HuayListBank > delete');
          break;
        }
        case 'replace':{
          console.log('HuayListBank > replace');
          break;
        }
        case 'update':{
          console.log('HuayListBank > update');
          if(socket_local.connected){
            socket_local.emit("huay_list_bank", JSON.stringify(await HuayListBank.find({})));
          }
          break;
        }
        case 'drop':{
          console.log('HuayListBank > drop');
          break;
        }
        case 'rename':{
          console.log('HuayListBank > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('HuayListBank > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('HuayListBank > dropDatabase');
          break;
        }
      }
    });

    // ช่องทางการโอนเงิน
    TransferMethod.watch().on('change', async data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('TransferMethod > insert');
          break;
        }
        case 'delete':{
          console.log('TransferMethod > delete');
          break;
        }
        case 'replace':{
          console.log('HuayListBank > replace');
          break;
        }
        case 'update':{
          console.log('TransferMethod > update');
          if(socket_local.connected){
            socket_local.emit("transfer_method", JSON.stringify(await TransferMethod.find({})));
          }
          break;
        }
        case 'drop':{
          console.log('TransferMethod > drop');
          break;
        }
        case 'rename':{
          console.log('TransferMethod > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('TransferMethod > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('TransferMethod > dropDatabase');
          break;
        }
      }
    });

 
    // ข้อมูลติดต่อเว็บฯ
    ContactUs.watch().on('change', async data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('ContactUs > insert');
          break;
        }
        case 'delete':{
          console.log('ContactUs > delete');
          break;
        }
        case 'replace':{
          console.log('ContactUs > replace');
          break;
        }
        case 'update':{
          console.log('ContactUs > update');
          // if(socket_local.connected){
          //   socket_local.emit("contact_us", JSON.stringify(await ContactUs.find({})));
          // }

          var contact_us = await ContactUs.find({});
          await cache.setCache('contact_us', contact_us)
          io.sockets.emit("contact_us", JSON.stringify( contact_us ));

          break;
        }
        case 'drop':{
          console.log('ContactUs > drop');
          break;
        }
        case 'rename':{
          console.log('ContactUs > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('ContactUs > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('ContactUs > dropDatabase');
          break;
        }
      }
    });

    // รายชือธนาคารทั้งหมด
    ListBank.watch().on('change', async data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('ListBank > insert');
          break;
        }
        case 'delete':{
          console.log('ListBank > delete');
          break;
        }
        case 'replace':{
          console.log('ListBank > replace');
          break;
        }
        case 'update':{
          console.log('ListBank > update');

          // if(socket_local.connected){
          //   socket_local.emit("list_bank", JSON.stringify(await ListBank.find({})));
          // }

          var list_bank = await ListBank.find({});
          await cache.setCache('list_bank', list_bank)
          io.sockets.emit("list_bank", JSON.stringify( list_bank ));

          break;
        }
        case 'drop':{
          console.log('ListBank > drop');
          break;
        }
        case 'rename':{
          console.log('ListBank > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('ListBank > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('ListBank > dropDatabase');
          break;
        }
      }
    });

    Lotterys.watch().on('change', async data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('Lotterys > insert');
          break;
        }
        case 'delete':{
          console.log('Lotterys > delete');
          break;
        }
        case 'replace':{
          console.log('Lotterys > replace');
          break;
        }
        case 'update':{
          console.log('Lotterys > update');

          var lotterys = await Lotterys.find({});
          await cache.setCache('lotterys', lotterys)
          
          io.sockets.emit("lotterys", JSON.stringify( lotterys ));
          break;
        }
        case 'drop':{
          console.log('Lotterys > drop');
          break;
        }
        case 'rename':{
          console.log('Lotterys > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('Lotterys > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('Lotterys > dropDatabase');
          break;
        }
      }
    });

    ShootNumbers.watch().on('change', async data =>{
      console.log(new Date(), data)

      // console.log(new Date(), data.documentKey._id.toString())
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('ShootNumbers > insert');
          // if(socket_local.connected){
          //   let find= await ShootNumbers.find({});
          //   io.sockets.emit("shoot_numbers", JSON.stringify(find));
          // } 
          
          /*
          let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
          if(find){
            io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(find));
          }
          */

          /*
         let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
         // console.log(find)
         if(find){
           let data = await ShootNumbers.findOne({ round_id: find.round_id });
           io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
         }
         */

          let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
          // console.log(find)
          if(find){
            let data = await ShootNumbers.find({ round_id: find.round_id });

            await cache.setCache("shoot_numbers_" + find.round_id + "_" + find.date, data)

            io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
          }
          break;
        }
        case 'delete':{
          console.log('ShootNumbers > delete');
          break;
        }
        case 'replace':{
          console.log('ShootNumbers > replace');
          break;
        }
        case 'update':{
          console.log('ShootNumbers > update');
          /*
          let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
          // console.log(find)
          if(find){
            let data = await ShootNumbers.findOne({ round_id: find.round_id });
            io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
          }
          */

//          await ShootNumbers.create({ round_id: req.body.round_tid, 
//           number: req.body.data, 
//              uid: user.uid,
//             date: req.body.date,
    //       });

    // let data = await ShootNumbers.findOne({round_id: req.body.round_tid});

          let find= await ShootNumbers.findById({_id: data.documentKey._id.toString()});
          // console.log(find)
          if(find){
            let data = await ShootNumbers.find({ round_id: find.round_id });

            await cache.setCache("shoot_numbers_" + find.round_id + "_" + find.date, data)

            io.sockets.emit("shoot_numbers_" + find.round_id, JSON.stringify(data));
          }
         
          break;
        }
        case 'drop':{
          console.log('ShootNumbers > drop');
          break;
        }
        case 'rename':{
          console.log('ShootNumbers > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('ShootNumbers > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('ShootNumbers > dropDatabase');
          break;
        }
      }
    });

    /*
    AwardsModel.watch().on('change', async data =>{
      console.log(new Date(), data)

      // console.log(new Date(), data.documentKey._id.toString())
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('AwardsModel > insert');
          break;
        }
        case 'delete':{
          console.log('AwardsModel > delete');
          break;
        }
        case 'replace':{
          console.log('AwardsModel > replace');
          break;
        }
        case 'update':{
          console.log('AwardsModel > update');
          break;
        }
        case 'drop':{
          console.log('AwardsModel > drop');
          break;
        }
        case 'rename':{
          console.log('AwardsModel > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('AwardsModel > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('AwardsModel > dropDatabase');
          break;
        }
      }
    });
    */
   
    UserSocketID.watch().on('change', async data =>{
      console.log(new Date(), data)
      //operationType
      switch(data.operationType){
        case 'insert':{
          console.log('UserSocketID > insert');
          break;
        }
        case 'delete':{
          console.log('UserSocketID > delete');
          break;
        }
        case 'replace':{
          console.log('UserSocketID > replace');
          break;
        }
        case 'update':{
          console.log('UserSocketID > update');
          
          // socket_local.emit("shoot_numbers", JSON.stringify(await ShootNumbers.find({})));
          break;
        }
        case 'drop':{
          console.log('UserSocketID > drop');
          break;
        }
        case 'rename':{
          console.log('UserSocketID > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('UserSocketID > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('UserSocketID > dropDatabase');
          break;
        }
      }
    });

    DepositStatus.watch().on('change', async data =>{
      switch(data.operationType){
        case 'insert':{
          console.log('DepositStatus > insert');
          break;
        }
        case 'delete':{
          console.log('DepositStatus > delete');
          break;
        }
        case 'replace':{
          console.log('DepositStatus > replace');
          break;
        }
        case 'update':{
          console.log('DepositStatus > update');
          if(socket_local.connected){
            socket_local.emit("deposit_status", JSON.stringify(await DepositStatus.find({})));
          }
          break;
        }
        case 'drop':{
          console.log('DepositStatus > drop');
          break;
        }
        case 'rename':{
          console.log('DepositStatus > rename');
          break;
        }
        case 'dropDatabase':{
          console.log('DepositStatus > dropDatabase');
          break;
        }
        case 'invalidate':{
          console.log('DepositStatus > dropDatabase');
          break;
        }
      }
    });

    // sessionMongoStore.all(function(error, sessions){
    //   console.log(sessions);
    // })
  }).catch(err => {
    console.log( 'DB Connection Error: ${err.message}' );
  });

})

