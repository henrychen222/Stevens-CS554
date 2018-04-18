const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(http);

const port = process.env.PORT || 8080;
const freezeTag = io.of("/freeze-tag");
const players = {};

const getRandomPosition = () => Math.ceil(Math.random() * 10);

app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/current-users", (req, res) => {
  res.json(Object.values(players).filter(x => x));
});

freezeTag.on("connection", socket => {
  let socketPlayer = null;

  socket.on("join", player => {
    const x = getRandomPosition();
    const y = getRandomPosition();

    player.x = x;
    player.y = y;

    socketPlayer = player;

    players[player.id] = player;

    freezeTag.emit("player-joined", player);
  });

  socket.on("move", direction => {
    if (socketPlayer.frozen) return;

    if (direction === "left") {
      if (socketPlayer.x === 1) return;
      socketPlayer.x--;
    } else if (direction === "right") {
      if (socketPlayer.x === 10) return;
      socketPlayer.x++;
    } else if (direction === "up") {
      if (socketPlayer.y === 10) return;
      socketPlayer.y++;
    } else {
      if (socketPlayer.y === 1) return;
      socketPlayer.y--;
    }

    const nowFrozenPlayers = Object.values(players).filter(
      player =>
        player && player.x === socketPlayer.x && player.y === socketPlayer.y
    );

    nowFrozenPlayers.forEach(player => {
      player.frozen = true;
    });

    if (nowFrozenPlayers.length > 0) {
      freezeTag.emit("players-frozen", nowFrozenPlayers.map(x => x.id));
    }

    freezeTag.emit("player-moved", {
      userId: socketPlayer.id,
      x: socketPlayer.x,
      y: socketPlayer.y
    });
  });

  socket.on("disconnect", () => {
    if (socketPlayer) {
      freezeTag.emit("player-left", socketPlayer);
      players[socketPlayer.id] = null;
      delete players[socketPlayer.id];
    }
  });
});

http.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
