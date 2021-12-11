const Redis_Instance = require("./RedisInstance");
const debug = require("debug")("REDIS_SQS: Publisher.js");

var Publisher = class Publisher {
    redisInstance;
    label;

    constructor(label) {
        this.label = `Redis SQS Publisher-${label}`;
        this.redisInstance = new Redis_Instance(this.label);
    }

    /**
     * 
     * @param {Object} config
     * @param {number} config.port
     * @param {string} config.host
     * @param {string} config.auth_pass
     * @returns {Promise<undefined>}
     */
    async initialise(config) {
        await this.redisInstance.initialise(config);

        return Promise.resolve(undefined);
    }

    graceFullShutDown() {
        this.redisInstance.getClient().quit((error) => {
            if (error) {
                debug(error);
                return;
            }
            debug("redis sqs publisher connections are closed");
        }
        );
    }

    /**
     * 
     * @param {string} channel
     * @param {string|string[]} data 
     * @returns {Promise<void>}
     */
    publish(channel, data) {
        return new Promise(async (resolve, reject) => {
            this.redisInstance.getClient().publish(channel, data, (err, receiverCount) => {
                try {
                    if (err) {
                        throw err;
                    }
                    else {
                        debug(`${this.label}: Published to channel ${channel},totalReceiverCount:${receiverCount}`);
                        resolve();
                    }
                }
                catch (e) {
                    reject({ error: e, origin: "Redis SQS Publisher->publish", label: this.label, channel, data });
                }
            });
        });
    }
}

module.exports = Publisher;