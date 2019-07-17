// middleware
const express = require('express');
// const socketio = require('socket.io');
// const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// init server with socket.io
const server = express();
// const app = require('http').createServer(server)
// const io = socketio.listen(app)

// make socket.io available to routes
// server.set('socketio', io)

// init socket.io
// io.sockets.on('connection', socket => {
//   console.log('Connected')
//   socket.on('disconnect', () => {
//     console.log('Disconnected')
//   })
// })

// init middleware
server.use(express.json());
server.use(cors());
server.use(helmet());
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: false }));

// routes
const authRouter = require('../routes/authentication/auth-router');
const userRouter = require('../routes/user-routes/user-router');
const tripRouter = require('../routes/trip-routes/trip-router');
const riderRouter = require('../routes/rider-routes/rider-router');
// const textRouter = require('../routes/text-routes/text-router');

// init routers
server.use(authRouter);
server.use(userRouter);
server.use(tripRouter);
server.use(riderRouter);
// server.use(textRouter);

// sanity route
server.get('/', (req, res) => {
  res.status(200).json({ api: 'active' });
});

module.exports = server;