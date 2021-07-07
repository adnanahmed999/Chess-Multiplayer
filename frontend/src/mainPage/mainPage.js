import React, { useEffect, useState } from "react";
import { socket, roomName } from "../connections/socket";
import LaunchGame from "../gameLogic/launchGame";
import VideoCall from "../connections/videoCall";

export default function MainPage() {
  const [gotTheRoomName, setGotTheRoomName] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [gotUnknownCode, setGotUnknownCode] = useState(false);
  const [gotTooManyPlayers, setHandleTooManyPlayers] = useState(false);
  const [bothJoined, setBothJoined] = useState(false);

  const [typingRoomName, setTypingRoomName] = useState("");

  function createGameHandler() {
    socket.emit("newGame");
  }

  function joinSubmitHandler() {
    console.log("Typed Code:", typingRoomName);
    socket.emit("joinGame", typingRoomName);
  }

  function handleGameCode(roomName) {
    console.log("Room Name:", roomName);
    console.log("Typeof Variable:", typeof roomName);
    setRoomName(roomName);
    setGotTheRoomName(true);
  }

  function handleUnknownCode() {
    // more to be done here, like removing unwanted stuff...
    setGotUnknownCode(true);
  }

  function handleTooManyPlayers() {
    // more to be done here, like removing unwanted stuff...
    setHandleTooManyPlayers(true);
  }

  function handleBothJoined() {    
    setBothJoined(true);
  }

  if(bothJoined) {
    socket.emit("sendOtherPlayerClientID", roomName)
  }

  useEffect(() => {
    socket.on("gameCode", handleGameCode);
    socket.on("unknownCode", handleUnknownCode);
    socket.on("tooManyPlayers", handleTooManyPlayers);
    socket.on("bothJoined", handleBothJoined);
  }, []);

  return (
    <div>
      {bothJoined ? (
        <>
          <LaunchGame/>
          <VideoCall />
        </>
      ) : gotTheRoomName ? (
        <div id="gameScreen" className="h-100">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <h1>
              Your game code is: <span id="gameCodeDisplay">{roomName}</span>
            </h1>
          </div>
        </div>
      ) : gotUnknownCode ? (
        <h1>Unknown COde</h1>
      ) : gotTooManyPlayers ? (
        <h1>Too many</h1>
      ) : (
        <section className="vh-100">
          <div className="container h-100">
            <div id="initialScreen" className="h-100">
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <h1>Multiplayer Chess</h1>
                <button
                  type="submit"
                  className="btn btn-success"
                  id="newGameButton"
                  onClick={createGameHandler}
                >
                  Create New Game
                </button>
                <div>OR</div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter Game Code"
                    id="gameCodeInput"
                    value={typingRoomName}
                    onChange={(e) => {
                      setTypingRoomName(e.target.value);
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  id="joinGameButton"
                  onClick={joinSubmitHandler}
                >
                  Join Game
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
