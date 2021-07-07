import io from 'socket.io-client'

const ENDPOINT = "http://127.0.0.1:3003";

const socket = io(ENDPOINT);

var playerNumber 
var roomName
var myID // clientID of the user
var otherPlayerID
// 1 for while, // 2 for black

socket.on('init', detailsObject => {
    console.log("detailOb", detailsObject)
    playerNumber = detailsObject.playerNumber;
    myID = detailsObject.clientID
    roomName = detailsObject.roomName
})

socket.on('otherPlayerClientID', clientID => {
    otherPlayerID = clientID
    console.log('down', otherPlayerID)
})

export { socket, playerNumber, myID,  roomName, otherPlayerID }