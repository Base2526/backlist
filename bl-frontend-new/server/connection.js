const mongoose = require('mongoose');

const {
  MONGO_HOSTNAME_ENV,
  MONGO_PORT_ENV,
  MONGO_DATABASE_NAME_ENV,
  MONGO_USERNAME_ENV,
  MONGO_PASSWORD_ENV
} = process.env;

// mongoose.connect(`mongodb://${MONGO_USERNAME_ENV}:${MONGO_PASSWORD_ENV}@${MONGO_HOSTNAME_ENV}:${MONGO_PORT_ENV}/${MONGO_DATABASE_NAME_ENV}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true});


mongoose.connect('mongodb://mongo1:27017,mongo2:27017,mongo3:27017/bl?replicaSet=my-mongo-set', {
                                            useNewUrlParser : true,
                                            useFindAndModify: false, // optional
                                            useCreateIndex  : true,
                                            useUnifiedTopology : true,
                                            // replicaSet      : 'rs0', // We use this from the entrypoint in the docker-compose file
                                            // dbName: 'mongo_test'
                                          });
const dboose = mongoose.connection;
dboose.on('error', console.error.bind(console, 'connection error:'));
dboose.once('open', async function() {
  // we're connected!
  console.log('Connected successfully to database!')

  // const silence = new kittySchema({ name: 'Silence' });
  // console.log(`silence ${silence}`)

  // await new kittySchema({ name: 'Silence' }).save()
});


module.exports = dboose;