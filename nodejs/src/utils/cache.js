const { promisify } = require("util");

const redisClient = require("redis").createClient;

const redis = redisClient({
  host: "redis"
});
const getAsync = promisify(redis.get).bind(redis);

// mongoose.Query.prototype.exec = async function(){ 
exports.setCache =   async function setCache(hashkey, value){
    // redis.del(JSON.stringify(hashkey))
    await redis.set(hashkey, JSON.stringify(value));
}

exports.getCache =   async function setCache(hashkey){
    // redis.del(JSON.stringify(hashkey))
    // await redis.set('title', JSON.stringify({'key':'value'}));

    return JSON.parse( (await getAsync(hashkey)) );
}
// redis.set('title', JSON.stringify({'key':'value'}));

exports.clearCache =    function clearCache(){
                            redis.flushall((err, success) => {
                                if (err) {
                                throw new Error(err);
                                }
                                console.log(success); // will be true if successfull
                            })
                        }

                    /*
                    ;
                    */

                    /*
                    
                    exports.makeid = makeid;
exports.__test = __test;*/