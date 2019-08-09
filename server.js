const express = require('express');
const server = express();
server.use(express.json());

// check if api is running
server.get('/', (req, res) => {
	res.send(`<h2>API is running</h2>`)
});

// routes
const choresRoute = require('./chores/choresRoute');
server.use('/chores', choresRoute);

module.exports = server;