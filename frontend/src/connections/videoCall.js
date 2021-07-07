import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";
import { socket, myID, otherPlayerID, playerNumber } from './socket';



function VideoCall() {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })
    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    setTimeout(()=> {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });
    
        peer.on("signal", data => {
          socket.emit("callUser", { userToCall: id, signalData: data, from: myID })
        })
    
        peer.on("stream", stream => {
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream;
          }
        });
    
        socket.on("callAccepted", signal => {
          setCallAccepted(true);
          peer.signal(signal);
        })
    }, 1000)
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="videoPlayer" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video className="videoPlayer" playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;

  const PLAYERNUMBER = playerNumber === 1 ? "Player 2" : "Player 1"

  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{PLAYERNUMBER} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }
  return (
    <div>
      <div className="styleVideoFrames">
          <div>
            {UserVideo}
          </div>
          <div>
            {PartnerVideo}
          </div>
          <div>
            {callAccepted==false && <button onClick={() => callPeer(otherPlayerID)}>Call Opponent</button>}
          </div>
          <div>
            {callAccepted==false &&incomingCall}
          </div>
      </div>
    </div>
  );
}

export default VideoCall;