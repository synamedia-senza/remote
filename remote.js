const express = require("express");
const app = express();
const errorHandler = require('errorhandler');
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 8080;
const publicDir = process.argv[2] || __dirname + '/public';
const io = require('socket.io').listen(app.listen(port));

app.use(express.static(publicDir));
app.use(errorHandler({ dumpExceptions: true, showStack: true}));

console.log("Remote server running at " + hostname + ":" + port);

let events = ["mousedown", "mousemove", "mouseup", "keydown", "command"];

io.sockets.on('connection', (socket) => {
  socket.on("join", (message) => socket.join(message.device));
  
  events.forEach(event => {
    socket.on(event, async (message) => {
      console.log(event, message);
      socket.to(message.device).emit(event, message);
    });
  });
});
