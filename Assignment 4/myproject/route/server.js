const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

const express = require("express");
const app = express.Router();
const data = require("../data");
const userData = data.userData;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//  /api/people/:id
app.get("/:id", async (req, res) => {
  // step 1: check if client.existsAsync(req.params.id) exists
  // step 2, if they do, do const user = client.getAsync(req.params.id)
  // 2.1; client.lpushAsync("history", user)
  // 2.2 res.send(user);
  // step 3, if they do not exist, do:
  // 3.1: const user = await data.getById(req.params.id)
  // 3.2 client.setAsync(req.params.id, JSON.stringify(user))
  // 3.3 client.lpushAsync("history", JSON.stringify(user));
  // 3.4 res.json(user);


  if (await client.existsAsync(req.params.id)) {
    const user = await client.getAsync(req.params.id);
    //lpush: Insert all the specified values at the head of the list stored at key
    client.lpushAsync("history", user);
    res.send(user);
  } else {
    //if the user is not in the cache, query the data module for the person
    const user = await userData.getById(req.params.id);
    //fail the request if they are not found
    if (!user) {
       throw "user is not exist in data module"
    }
    //put the user in the cache, and the history list
    //send JSON and cache the result if they are found
    client.lpushAsync("history", JSON.stringify(user));
    res.json(user);
  }

});

//  /api/people/history
app.get("/", async (req, res) => {
  // //check the cache
  // const UserInCache = await client.existsAsync(req.params.id)
  // if (UserInCache) {
  //   client.lpushAsync("history", user);
  //   res.send(user);
  // } else {
  //   const DataUserID = await userData.getById(req.param.id);
  //   //put the user in the cache, and the history list
  //   const historyList = await client.lpushAsync("history", JSON.stringify(DataUserID));
  //   //get the last user from history list
  //   // const historyResult = await res.json(await client.lrange(historyList, 0, 19));
  //   // console.log(historyResult);
  //   res.json(await client.lrangeAsync(historyList, 0, 19));

  //   // //method 2
  //   // const historyList = await client.rpushAsync("history", JSON.stringify(DataUserID));
  //   // res.json(await client.lrangeAsync(historyList, 779, 999));
  // }



  //If you go to the route that looks for a user by id, you add them to that history list
  //get the user directly from history list
  const historyResult = await client.lrangeAsync("history", 0, 19);
  res.json(historyResult);

});



module.exports = app;
