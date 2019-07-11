const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

const authRouter = require('../routes/authentication/auth-router');

server.use(express.json(), cors(), helmet());
server.use(authRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: 'active' });
});

module.exports = server;