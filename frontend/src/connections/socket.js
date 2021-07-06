import io from 'socket.io-client'

const ENDPOINT = "http://127.0.0.1:3003";

const socket = io(ENDPOINT);

var playerNumber 
var roomName
// 1 for while, // 2 for black

socket.on('init', detailsObject => {
    playerNumber = detailsObject.playerNumber;
    roomName = detailsObject.roomName
})

export { socket, playerNumber, roomName }