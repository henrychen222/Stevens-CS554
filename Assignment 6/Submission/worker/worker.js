const redisConnection = require("./redis-connection");
const request = require('request');
const flat = require("flat");
const unflatten = flat.unflatten
const redis = require('redis');
const client = redis.createClient();
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


redisConnection.on('search-for-image:request:*', async (message, channel) => {
    console.log(message.data.message);
    let query = 'https://pixabay.com/api/?key=8563912-53ecea6879e958cafc37897f5&q=' + message.data.message;
    //Request is designed to be the simplest way possible to make http calls
    request(query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let requestId = message.requestId;
            let eventName = message.eventName;
            let successEvent = `${eventName}:success:${requestId}`;
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: {
                    message: JSON.parse(body)
                },
                eventName: eventName
            });
            console.log(body);
        }
    });
});



