const express = require("express")
const app = express()
const http = require("http")
const socketIo = require("socket.io")
const server = http.createServer(app)
const port = process.env.port || 3003
const { v4: uuidv4 } = require('uuid');
const io = socketIo(server, {cors:{origin:"*"}})


const clientRooms = {}

io.on("connection", (client)=> {

    client.on('newGame', handleNewGame)
    client.on('joinGame', handleJoinGame)

    function handleNewGame() {
        let roomName = uuidv4();
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName)
        client.join(roomName)
        client.number = 1;
        client.emit('init', 1)
    }

    function handleJoinGame(roomName) {
        console.log("in coming room name:", roomName)
        const room = io.sockets.adapter.rooms.has(roomName)
        console.log("allROoms", io.sockets.adapter.rooms)
        let allUsers;
        let numClients = 0;
        if (room===true) {
        //   console.log("inside")
        //   console.log("roomsoc",room.sockets)
        //   allUsers = room.sockets;
            numClients = io.sockets.adapter.rooms.get(roomName).size
            console.log(numClients)
        }

        // console.log("room", room)
        // let numClients = 0;

        // if (allUsers) {
        //   numClients = Object.keys(allUsers).length;
        // }
        // console.log(allUsers)
        // console.log("numC", numClients)
        if (numClients === 0) {
          client.emit('unknownCode');
          return;
        } else if (numClients > 1) {
          client.emit('tooManyPlayers');
          return;
        }
    
        clientRooms[client.id] = roomName;
    
        client.join(roomName);
        client.number = 2;
        client.emit('init', 2);
        io.sockets.in(roomName).emit('bothJoined')
    }
})

server.listen(port, ()=> {
    console.log(`Server is live at ${port}`)
})

