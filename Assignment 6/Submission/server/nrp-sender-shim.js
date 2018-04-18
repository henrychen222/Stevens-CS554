const uuid = require("node-uuid");
const NRP = require("node-redis-pubsub");

const nrpConfig = {
    port: 6379,
    scope: 'queue'
};

const defaultRedisConnection = new NRP(nrpConfig);

const defaultMessageConfig = {
    data: {},
    timeout: 10000,
    eventName: "send",
    redis: defaultRedisConnection,
    expectsResponse: true
};

const sendMessage = (messageConfig = defaultMessageConfig) => {
    return new Promise((resolve, reject) => {
        //Assign  defaultMessageConfig, messageConfig to {} 
        let configs = Object.assign({}, defaultMessageConfig, messageConfig);

        let messageId = uuid.v4();
        let TimeoutId = undefined;
        let redisConnection = configs.redis;
        let eventName = configs.eventName;
        let outgoingEventName = `${eventName}:request:${messageId}`; 
        
        //has response
        if (configs.expectsResponse) {
            let successEventName = `${eventName}:success:${messageId}`;
            let failedEventName = `${eventName}:failed:${messageId}`;

            let successEvent = redisConnection.on(successEventName, (response, channel) => {
                resolve(response.data);
                TerminateMessageLifeCycle();
            });

            let errorEvent = redisConnection.on(failedEventName, (response, channel) => {
                reject(response.data);
                TerminateMessageLifeCycle();
            });

            let expireEvents = [successEvent, errorEvent];

            let TerminateMessageLifeCycle = () => {
                expireEvents.forEach(expire => {
                    expire();
                });
                clearTimeout(TimeoutId);
            };

            if (configs.timeout >= 0) {
                TimeoutId = setTimeout(() => {
                    reject(new Error("timed out"));
                    TerminateMessageLifeCycle();
                }, configs.timeout);
            }
        }
        
        //call the worker
        redisConnection.emit(outgoingEventName, {
            requestId: messageId,
            data: configs.data,
            eventName: configs.eventName
        });

        //no response
        if (!configs.expectsResponse) {
            resolve();
        }

    });
};

module.exports = {
    sendMessage
};

