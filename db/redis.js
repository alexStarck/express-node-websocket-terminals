const redis=require('async-redis')
require('dotenv').config()


const redisClient =redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

module.exports=redisClient