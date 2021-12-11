const LList = require("./Llist");
const Redis_Connection = require("./init");

const redisInstancePub = Redis_Connection.redisInstancePub;
const redisInstanceSub = Redis_Connection.redisInstanceSub;
const redisInstance = Redis_Connection.redisInstance;

/**
 * 
 * @param {string} queueName 
 * @param {string|string[]} items 
 * @returns {Promise<void>}
 */
const enqueue = async (queueName, items) => {
    await LList.rPush(redisInstance, queueName, items);
    await redisInstancePub.publish(queueName, "true");
    return Promise.resolve();
}

/**
 * 
 * @param {string} queueName 
 * @param {string[]} items
 * @returns {Promise<void>} 
 */
const enqueueWithOutPub = async (queueName, items) => {
    await LList.rPush(redisInstance, queueName, items);
    return Promise.resolve();
}

/**
 * 
 * @param {string} queueName
 * @param {number} count 
 * @returns {Promise<{items:string[], size:number}>}
 */
const dequeue = (queueName, count) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (count <= 0) { resolve({ items: [], size: 0 }); return }
            const items = await LList.lPop(redisInstance, queueName, count);
            const size = items.length;
            resolve({ items, size });
            return;
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

/**
 * 
 * @param {string} queueName
 * @param {function(string|string[]):Promise<void>} handler
 */
const subscribe = async (queueName, handler) => {
    redisInstanceSub.subscribe(queueName, handler);
    await redisInstancePub.publish(queueName, "true");
}

/**
 * 
 * @param {string} queueName
 */
const unsubscribe = (queueName) => {
    redisInstanceSub.unSubscribe(queueName);
}


const Worker = {
    enqueue,
    enqueueWithOutPub,
    dequeue,
    subscribe,
    unsubscribe
}

module.exports = Worker;