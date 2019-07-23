// middleware
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// init server
const server = express();

// init middleware
server.use(express.json());
server.use(cors());
server.use(helmet());

// routes
const authRouter = require('../routes/authentication/auth-router');
const userRouter = require('../routes/user-routes/user-router');
const tripRouter = require('../routes/trip-routes/trip-router');
const textRouter = require('../routes/text-routes/text-router');

// init routers
server.use(authRouter);
server.use(userRouter);
server.use(tripRouter);
server.use(textRouter);

// sanity route
server.get('/', (req, res) => {
  res.status(200).json({ api: 'active' });
});

// export
module.exports = server;