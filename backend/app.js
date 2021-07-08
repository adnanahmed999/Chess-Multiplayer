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

    console.log("id", client.id)
    client.on('newGame', handleNewGame)
    client.on('joinGame', handleJoinGame)
    client.on('validMove', handleValidMove)
    client.on('callUser', handleCallUser)
    client.on('acceptCall', handleAcceptCall)
    client.on('reStartNewGame', handleReStartNewGame)
    client.on('sendOtherPlayerClientID', handleSendClientID)
    client.on('disconnect', handleDisconnect)

    function handleNewGame() {
        let roomName = uuidv4();
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName)
        client.join(roomName)
        client.number = 1;
        client.emit('init', {playerNumber: 1, clientID: client.id,  roomName})
    }

    function handleJoinGame(roomName) {
        // console.log("in coming room name:", roomName)
        const room = io.sockets.adapter.rooms.has(roomName)
        // checks if the room exists and returns either true or false.
        // console.log("allROoms", io.sockets.adapter.rooms)
        let allUsers;
        let numClients = 0;
        if (room===true) {
            numClients = io.sockets.adapter.rooms.get(roomName).size 
            // console.log(numClients)
        }

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
        client.emit('init', {playerNumber: 2, clientID: client.id, roomName} );
        io.sockets.in(roomName).emit('bothJoined')
    }

    function handleValidMove(positionObject) {
        io.sockets.in(positionObject.roomName).emit('movePieces',positionObject)
    }

    function handleSendClientID(roomName) {
        // console.log("rn", roomName)
        client.broadcast.emit('otherPlayerClientID',client.id)
    }

    function handleCallUser(data) {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    }

    function handleAcceptCall(data) {
        io.to(data.to).emit('callAccepted', data.signal);
    }

    function  handleReStartNewGame(detailsObject) {
        io.sockets.in(detailsObject.roomName).emit('resetGame', detailsObject.playerNumber)
    }

    function handleDisconnect() {
        console.log(client.id, "disconnected")
        const roomName = clientRooms[client.id]
        delete clientRooms[client.id]
        io.sockets.in(roomName).emit('opponentDisconnected')
    }

})

server.listen(port, ()=> {
    console.log(`Server is live at ${port}`)
})

