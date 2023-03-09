import http from 'http';
import express from 'express';
import { ServerSocket } from './socket';

const server = express();
const httpServer = http.createServer(server);

new ServerSocket(httpServer)
// logger
server.use((req, res, next) => {
  console.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
  res.on('finish', () => {
    console.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  });
  next();
});

/** Parse the body of the request */
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

/** Rules of our API */
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

/** Healthcheck */
server.get('/ping', (req, res) => {
  return res.status(200).json({ ping: 'pong' });
});

/** Socket Information */
//todo
server.get('/status', (req, res, ) => {
  return res.status(200).json({ users: ServerSocket.instance.users });
});

/** Error handling */
server.use((req, res) => {
  const error = new Error('Not found');

  res.status(404).json({
    message: error.message
  });
});

/** Listen */
httpServer.listen(3333, () =>
  console.info(`Server is running on port: 3333...`));