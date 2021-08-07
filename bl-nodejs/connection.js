const mongoose = require('mongoose');

const {
  MONGO_HOSTNAME_ENV,
  MONGO_PORT_ENV,
  MONGO_DATABASE_NAME_ENV,
  MONGO_USERNAME_ENV,
  MONGO_PASSWORD_ENV
} = process.env;

mongoose.connect(`mongodb://${MONGO_USERNAME_ENV}:${MONGO_PASSWORD_ENV}@${MONGO_HOSTNAME_ENV}:${MONGO_PORT_ENV}/${MONGO_DATABASE_NAME_ENV}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true});

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