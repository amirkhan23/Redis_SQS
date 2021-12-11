# Redis_SQS
Redis SQS is alternate of AWS SQS and RabbitMQ

 #### Enable debug mode
 ``` set DEBUG=Redis_SQS* ```
### First initailize redis like

```
await RedisSQS.init(
{ port: 6379,
  host: "127.0.0.1",
  auth_pass: "password"
});

```
_**Send Message to Queue**_

```
/**
 * 
 * @param {string} queueName 
 * @param {string|string[]} data
 * @returns {Promise<void>}
 */
RedisSQS.sendMessage(queueName, data): Promise<void>;

Example:
 await RedisSQS.sendMessage("queueName","any kind of data");

```

_**Consume an Queue**_

```
/**
 * 
 * @param {string} queueName
 * @param {function(string|string[]):Promise<void>} handler
 * @param {number=} batchSize - Default 1
 */
 RedisSQS.consumeMessages(queueName,handler,batchSize=1);
 
 Example:
  await RedisSQS.consumeMessages("queuename",(data)=>{console.log(data)},1);

```
_**Stop Consume an Queue**_

```
/**
 * 
 * @param {string} queueName
 */
 RedisSQS.stopConsumeMessage(queueName);
 
 Example:
  await RedisSQS.stopConsumeMessage("queuename");
  
```
