const express = require('express');
const app = express();
const configRoutes = require('./route');

configRoutes(app);

app.listen(3000, () => {
    console.log("Server has started");
    console.log("Listening on port 3000...");
});