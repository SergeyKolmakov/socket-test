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
const io = require('socket.io')(server);

app.use(cors());
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
});
