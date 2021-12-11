const Publisher = require("./Publisher");
const Subscriber = require("./Subsciber");
const Redis_Instance = require("./RedisInstance");

let redisInstance = new Redis_Instance("Redis");
let redisInstancePub = new Publisher("Redis SQS-Publisher");
let redisInstanceSub = new Subscriber("Redis SQS-Subscribe");

/**
     * 
     * @param {Object} config
     * @param {number} config.port
     * @param {string} config.host
     * @param {string} config.auth_pass
     */
const init = async (config) => {
    await redisInstance.initialise(config);
    console.log("1111")
    await redisInstancePub.initialise(config);
    await redisInstanceSub.initialise(config);
}

const Redis_Connection = {
    init,
    redisInstance,
    redisInstancePub,
    redisInstanceSub
}

module.exports = Redis_Connection;