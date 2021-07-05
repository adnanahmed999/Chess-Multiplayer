import io from 'socket.io-client'

const ENDPOINT = "http://127.0.0.1:3003";

const socket = io(ENDPOINT);

var playerNumber 
// 1 for while, // 2 for black

socket.on('init', playerNum => {
    playerNumber = playerNum;
})

export { socket, playerNumber }