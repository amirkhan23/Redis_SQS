const { init, consumeMessages, sendMessage, stopConsumeMessage } = require("./src")

const RedisSQS = { init, consumeMessages, sendMessage, stopConsumeMessage }

module.exports = RedisSQS;