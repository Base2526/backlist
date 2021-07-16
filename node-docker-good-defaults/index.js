// simple node web server that displays hello world
// optimized for Docker image

const express = require('express');
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
// setTimeout(() => {
//   client.connect(function(err) {
//     if (err) {
//       return console.error(err);
//     }
//     console.log("Connected successfully to database");
//     db = client.db(MONGO_DATABASE_NAME);
//   });
// }, 2000);

// Api
const app = express();
app.use(morgan('common'));
app.get('/', function (req, res) {
  res.send('Hello Docker World\n');
});

app.get('/healthz', function (req, res) {
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n');
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

const connection = require("./connection")

// app.post('/api/___follow_up', async(req, res) => {
app.get('/documents', async(req, res, next) =>{
  // might have not been connected just yet

  // console.log('/documents')
  // let fss = await kittySchema.find();
  // console.log(fss)

  // await new kittySchema({ name: 'Silence' }).save()

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
