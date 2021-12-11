const debug = require("debug")("Redis_SQS:index");
const { init } = require("./init");
const { subscribe, unsubscribe, enqueue, enqueueWithOutPub, dequeue } = require("./util");

/**
 * 
 * @param {string} queueName 
 * @param {string|string[]} data
 * @returns {Promise<void>}
 */
const sendMessage = (queueName, data) => {
    return enqueue(queueName, data);
}

/**
 * 
 * @param {string} queueName
 * @param {function(string|string[]):Promise<void>} handler
 * @param {number=} batchSize - Default 1
 */
const consumeMessages = async (queueName, handler, batchSize = 1) => {
    const callback = async (args) => {
        const { items, size } = await dequeue(queueName, batchSize);
        if (size > 0) {
            try {
                handler(items);
            } catch (error) {
                await enqueueWithOutPub(queueName, items);
                debug(error);
            }
            callback(args);
        }
    }
    subscribe(queueName, callback);
}

/**
 * 
 * @param {string} queueName 
 */
const stopConsumeMessage = (queueName) => {
    return unsubscribe(queueName)
}

module.exports = { init, sendMessage, consumeMessages, stopConsumeMessage }