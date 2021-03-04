const _ = require('lodash');

var config = {};

config.twitter = {};
config.redis = {};
config.web = {};
config.d8 = {};
config.mongo = {};
config.session = {};

config.default_stuff =  ['red','green','blue','apple','yellow','orange','politics'];
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;

config.d8.debug             = true;
config.d8.host              = 'http://drupal8';
config.d8.api_login         = config.d8.host + '/api/login.json';
config.d8.api_logout        = config.d8.host + '/api/logout.json';
config.d8.api_register      = config.d8.host + '/api/register.json';
config.d8.api_reset_password= config.d8.host + '/api/reset_password.json';

config.d8.api_list_bank     = config.d8.host + '/api/list_bank.json';
config.d8.api_add_bank      = config.d8.host + '/api/add_bank.json';
config.d8.api_delete_bank   = config.d8.host + '/api/delete_bank.json';

// ฝากเงิน
config.d8.api_add_deposit   = config.d8.host + '/api/add_deposit.json';

// ถอดเงิน
config.d8.api_withdraw      = config.d8.host + '/api/withdraw.json';

config.d8.api_update_socket_io      = config.d8.host + '/api/update_socket_io.json';

// แทงพนัน 
config.d8.api_bet                   = config.d8.host + '/api/bet.json';
config.d8.api_bet_cancel            = config.d8.host + '/api/bet_cancel.json';
config.d8.api_shoot_number          = config.d8.host + '/api/shoot_number.json';

config.d8.api_request_all           = config.d8.host + '/api/request_all.json';


config.d8.init_d8                   = config.d8.host + '/cron/cron_530AM.json';
config.d8.get_yeekee_answer         = config.d8.host + '/api/get_yeekee_answer.json'

config.d8.headers = {
                        "Content-Type": "application/json",
                        // "client_id": "1001125",
                        "client_secret": "YUhWaGVRPT0="
                    };
// mongo 
config.mongo.url = 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/huay?replicaSet=rs0';

// session 
config.session.secret = '1234567890';

module.exports = config;