const express = require('express');
const router = express.Router();

const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten
const redis = require('redis');
const client = redis.createClient();

const redisConnection = require("../../redis-connection");
const nrpSender = require("./nrp-sender-shim");


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



// GET	
// /api/people/history
router.get("/history", async (req, res) => {
    let keysList = [];
    let result = [];
    await client.multi()
        .keys('*')
        .keys('*', function (err, replies) {
            replies.forEach(async function (reply, index) {
                // console.log("Reply " + index + ": " + reply.toString());
                let p = await client.hgetallAsync(reply.toString());
            });
        })
        .exec(async function (err, replies) {
            for (var i = 0; i < replies[0].length && i < 20; i++) {
                let p = await client.hgetallAsync(replies[0][i]);
                result.push(p);
            }
            res.json(result);
        });
});

// GET	
// /api/people/:id
router.get("/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "get-people-by-id",
            data: {
                message: req.params.id
            }
        });
        res.json(response);
    } catch (e) {
        res.json({ error: e.message });
    }
});

// POST	
// /api/people
router.post("/", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "post-people",
            data: {
                message: req.body.people
            }
        });
        res.json(response);
    } catch (e) {
        res.json({ error: e.message });
    }
});

// DELETE	
// /api/people/:id
router.delete("/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "delete-people-by-id",
            data: {
                message: req.params.id
            }
        });
        res.json(response);
    } catch (e) {
        res.json({ error: e.message });
    }
});

// PUT	
// /api/people/:id
router.put("/:id", async (req, res) => {
    try {
        let people = req.body.people;
        people.id = req.params.id;
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "put-people",
            data: {
                message: req.body.people
            }
        });
        res.json(response);
    } catch (e) {
        res.json({ error: e.message });
    }
});



module.exports = router;