'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 8080;
const host = '0.0.0.0';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', socket => {
  socket.broadcast.emit('hello', 'world');

  socket.on('disconnect', () => {
    socket.broadcast.emit('hello', 'googbye');
  });
});

app.listen(port, host);
// console.log(`running on http://${host}:${port}`);
