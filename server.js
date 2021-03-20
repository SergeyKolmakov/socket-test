'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', socket => {
  io.sockets.emit('broadcast', Date.now());

  console.log('Отправлено уведомление всем');

  io.on('disconnect', () => {
    io.sockets.emit('broadcast', 'close');
  });
});

http.listen(port, () => {
  console.log('listening on *:8080');
});
