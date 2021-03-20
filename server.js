'use strict';

const fs = require('fs');
const cors = require('cors');
const https = require('https');
const express = require('express');
const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(https);

const port = 8080;
const ip = require('ip').address();

const options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt'),
};
const serverPort = 443;

const server = https.createServer(options, app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'https://muskulspb.ru',
    methods: ['GET', 'POST'],
  },
});

// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'https://muskulspb.ru');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With,content-type'
//   );
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

const corsOptions = {
  origin: 'https://muskulspb.ru',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
  console.log('Listening...');
});

io.on('connection', socket => {
  io.sockets.emit('broadcast', Date.now());

  console.log('Отправлено уведомление всем');

  io.on('disconnect', () => {
    io.sockets.emit('broadcast', 'close');
  });
});

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
  console.log('IP %s', ip);
});
