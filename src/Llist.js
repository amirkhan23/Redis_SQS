const debug = require("debug")("REDIS_SQS:Llist.js");

/**
 * 
 * @param {redis.RedisClient} redisInstance 
 * @param {string} redisKey 
 * @param {string|string[]} value 
 * @returns {Promise<boolean>}
 */
const rPush = (redisInstance, redisKey, value) => {
    return new Promise((resolve, reject) => {
        try {
            redisInstance.getClient().rpush(redisKey, value, (err, res) => {
                if (err) {
                    throw err;
                }
                resolve(res > 0);
            });
        }
        catch (error) {
            debug(error);
            reject(error);
        }
    });
}

/**
 * 
 * @param {redis.RedisClient} redisInstance 
 * @param {string} redisKey 
 * @returns {Promise<number>}
 */
const getSize = (redisInstance, redisKey) => {
    return new Promise((resolve, reject) => {
        try {
            redisInstance.getClient().llen(redisKey, (err, res) => {
                if (err) {
                    throw err;
                }
                resolve(res)
            });
        }
        catch (error) {
            debug(error);
            reject(error);
        }
    });
}

/**
 * 
 * @param {redis.RedisClient} redisInstance 
 * @param {string} redisKey 
 * @param {number} startIndex 
 * @param {number} stopIndex 
 * @returns {Promise<boolean>}
 */
const lTrim = (redisInstance, redisKey, startIndex, stopIndex) => {
    return new Promise((resolve, reject) => {
        try {
            redisInstance.getClient().ltrim(redisKey, startIndex, stopIndex, (err, res) => {
                if (err) {
                    throw err;
                }
                resolve(res == "OK");
            });
        }
        catch (error) {
            debug(error);
            reject(error);
        }
    });
}

/**
 * 
 * @param {redis.RedisClient} redisInstance 
 * @param {string} redisKey 
 * @param {number} startIndex 
 * @param {number} stopIndex 
 * @returns 
 */
const lRange = (redisInstance, redisKey, startIndex, stopIndex) => {
    return new Promise((resolve, reject) => {
        try {
            redisInstance.getClient().lrange(redisKey, startIndex, stopIndex, (err, res) => {
                if (err) {
                    throw err;
                }
                resolve(res);
            });
        }
        catch (error) {
            debug(error);
            reject(error);
        }
    });
}

/**
 * 
 * @param {redis.RedisClient} redisInstance 
 * @param {string} redisKey 
 * @param {number=} count @returns {Promise<void>}
 * @returns {Promise<Array<string>>}
 */
const lPop = (redisInstance, redisKey, count = 1) => {
    return new Promise((resolve, reject) => {
        try {
            redisInstance.getClient().lpop(redisKey, count, (err, res) => {
                if (err) {
                    throw err;
                } else {
                    resolve(res);
                }
            });
        }
        catch (error) {
            debug(error);
            reject(error);
        }
    });
}

const LList = { rPush, getSize, lRange, lTrim, lPop }

module.exports = LList;