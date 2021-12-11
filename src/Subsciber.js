const Redis_Instance = require("./RedisInstance");
const debug = require("debug")("REDIS_SQS: Subscribe.js");

var Subscriber = class Subscriber {

    redisInstance;
    eventHandlerMap; //Map<string, RedisPubSubSubscribeEventHandler>
    label;
    isListening;

    constructor(label) {
        this.label = `Redis SQS Subscriber-${label}`;
        this.redisInstance = new Redis_Instance(this.label);
        this.eventHandlerMap = new Map();
        this.isListening = false;
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

        this.listenMessages();

        return Promise.resolve(undefined);
    }

    /**
     * 
     * @param {string} channel
     * @param {function(string|string[]):Promise<void>} handler
     */
    subscribe(channel, handler) {
        const alreadyRegistered = this.eventHandlerMap.has(channel);
        this.eventHandlerMap.set(channel, handler);

        if (alreadyRegistered) {
            debug(`${channel} is already subscribed,handler updated`);
        }

        this.redisInstance.getClient().subscribe(channel);
    }

    /**
     * 
     * @param {string} channel
     */
    unSubscribe(channel) {
        const alreadyRegistered = this.eventHandlerMap.has(channel);
        this.eventHandlerMap.delete(channel);

        if (alreadyRegistered) {
            debug(`${channel} is  un-subscribed,handler remove`);
        }

        this.redisInstance.getClient().unsubscribe(channel);
    }

    graceFullShutDown() {
        this.redisInstance.getClient().quit((error) => {
            if (error) {
                debug(error);
                return;
            }
            debug("redis sqs subscribers connections are closed");
        }
        );
    }

    listenMessages() {
        if (this.isListening) {
            debug({ message: 'Already Listening to Redis SQS Sub', label: this.label })
            return;
        }
        else {
            this.isListening = true;
        }

        this.redisInstance.getClient().on('message', async (channel, data) => {
            debug(`${this.label} : Message Received on channel ${channel}`);

            const handler = this.eventHandlerMap.get(channel);

            try {
                if (handler) {
                    await handler(data);
                }
                else {
                    throw new Error(`No handler method found for channel: ${channel}`);
                }
            }
            catch (e) {
                debug({ message: `Redis SQS Sub Message Handler Failed`, label: this.label, data, channel, error: e })
            }
        });

        this.redisInstance.getClient().on('subscribe', (channel, count) => {
            debug(`${this.label} : Subscribed to channel ${channel},totalSubcribedChannels:${count}`);
        });
        this.redisInstance.getClient().on('unsubscribe', (channel, count) => {
            debug(`${this.label} : UnSubscribed from channel ${channel},totalSubcribedChannels:${count}`);
        });
    }
}

module.exports = Subscriber;