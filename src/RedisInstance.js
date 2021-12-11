const redis = require("redis");
const debug = require("debug")("REDIS_SQS:RedisInstance.js")

var Redis_Instance = class Redis_Instance {
    label
    client

    constructor(label) {
        this.label = label;
    }

    /**
     * 
     * @param {Object} config
     * @param {number} config.port
     * @param {string} config.host
     * @param {string} config.auth_pass
     * @returns {Promise<undefined>}
     */
    initialise(config) {
        return new Promise((resolve, reject) => {
            const { port, host, auth_pass } = config;

            debug("redis config:", config, this.label);

            if (this.client) {
                reject(`RedisClient is already initailzed ,${this.label}`)
                return;
            }
            this.client = redis.createClient(
                {
                    host,
                    port,
                    auth_pass
                });

                this.client.ping((err,res)=>{
                    debug(err,res)
                })

            this.client.on('ready', () => {
                debug(`redis is ready ${this.label}`)
                resolve(undefined);
            });

            this.client.on('error', (err) => {
                debug(`redis err: ${this.label}`, err);
                reject(err);
            });
        })
    }

    getClient() {
        if (!this.client) {
            throw new Error(`RedisClient not yet initailsed, ${this.label}`);
        }
        return this.client;
    }
}

module.exports = Redis_Instance;