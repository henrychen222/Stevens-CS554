const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;

const express = require("express");
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const namespace = io.of("/mynamespace");        // Namespace (socket.io)
const usersToSocket = {};


const redis = require('redis');
const client = redis.createClient();

const redisConnection = require("./redis-connection");
const nrpSender = require("./nrp-sender-shim");


app.use("/", express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/newYandex.html');
});

namespace.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    socket.leave(data.previousRoom);      //add client to the room
    socket.join(data.newRoom);            //remove client from the room

    socket.emit("joined-room", data.newRoom);
  });

  socket.on('direct message', (msg) => {
    usersToSocket[msg.userName].emit('private message', {
      from: msg.fromUserName,
      text: msg.text
    });
  });

  socket.on('setup',async (connectionInfo) => {
    usersToSocket[connectionInfo.nickname] = socket;
  });

  socket.on('send-message',async (msg) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "search-for-image",
            data: {
                message: msg.text               //msg.text
            }
        });
        //use to or in (same) when broadcasting or emitting
        namespace.in(msg.room).emit('receive-message',{response, nickname: msg.nickname, message:msg.text});
    } catch (e) {
        console.log(e.message);
    }
    
  });

  socket.emit('request-credentials');
});

http.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});