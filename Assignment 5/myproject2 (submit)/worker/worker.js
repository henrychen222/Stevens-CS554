const redisConnection = require("../redis-connection");
const data = require("./data");
const peopleData = data.people;

const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

peopleData.getAllPeople().then((people) => {
    people.forEach(function (p) {
        client.hmsetAsync(p.id, flat(p));
    });
}).catch((e) => {
    console.log(e);
});

redisConnection.on('get-people-by-id:request:*', async (message, channel) => {
    let peopleResult = await client.existsAsync(message.data.message);
    let requestId = message.requestId;
    let eventName = message.eventName;
    if (peopleResult) {
        let p = await client.hgetallAsync(message.data.message);
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: {
               message: p
            },
            eventName: eventName
        });
    }
    else {
        let failEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failEvent, {
            requestId: requestId,
            data: {
                message: "No such person!"
            },
            eventName: eventName
        });
        console.log("People not found");
    }
});

redisConnection.on('post-people:*', async (message, channel) => {
    let people = message.data.message;
    let peopleResult = await client.existsAsync(people.id);
    let requestId = message.requestId;
    let eventName = message.eventName;
    if (!peopleResult) {
        let p = await client.hmsetAsync(people.id, flat(people));
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: {
                people
            },
            eventName: eventName
        });
    }
    else {
        let failEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failEvent, {
            requestId: requestId,
            data: {
                message: "person already exist!"
            },
            eventName: eventName
        });
    }
});

redisConnection.on('delete-people-by-id:request:*', async (message, channel) => {
    let peopleResult = await client.existsAsync(message.data.message);
    let requestId = message.requestId;
    let eventName = message.eventName;
    if (peopleResult) {
        let p = await client.delAsync(message.data.message);
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: {
                message:"OK"
            },
            eventName: eventName
        });
    }
    else {
        let failEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failEvent, {
            requestId: requestId,
            data: {
                message: "No such person!"
            },
            eventName: eventName
        });
        console.log("error");
    }
});


redisConnection.on('put-people:request:*', async (message, channel) => {
    let people = message.data.message;
    let peopleResult = await client.existsAsync(people.id);
    let requestId = message.requestId;
    let eventName = message.eventName;
    if (peopleResult) {
        let p = await client.hmsetAsync(message.data.message.id, flat(people));
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: {
                message:people
            },
            eventName: eventName
        });
    }
    else {
        let failEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failEvent, {
            requestId: requestId,
            data: {
                message: "No such person!"
            },
            eventName: eventName
        });
        console.log("No such person!");
    }
});