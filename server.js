const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
let games = []
let users = []
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    users.push(socket.id)
    console.log(socket.id)
    socket.on('gameStart',(s)=>{
        console.log("gamestarted")
        games.push({"players":[users[0], users[1]]})
        io.to(users[0]).emit('gamePlayer', '1');
        io.to(users[1]).emit('gamePlayer', '2');
    })

    socket.on('keyPressed',(s)=>{
        console.log(s)
        console.log(socket.id)
        let p = games[0]["players"].filter(item => item !== socket.id)
        io.to(p[0]).emit('playerMove', s)
    })
    
    socket.on('getActiveUsers',(s)=>{
        io.to(socket.id).emit('activeUsers', users)
    })
  console.log('a user connected');
});
//io.to(socketid).emit('message', 'for your eyes only');



server.listen(3000, () => {
  console.log('listening on *:3000');
});