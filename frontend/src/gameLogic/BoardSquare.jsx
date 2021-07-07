import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { handleMove } from './Game'
import { gameSubject } from './Game'
import { socket, playerNumber, roomName } from '../connections/socket'
import useSound from 'use-sound'
import moveAudio from '../sound/moveAudio.mp3'

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
import Promote from './Promote'
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
export default function BoardSquare({piece,black,position,turn}) {
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  const [promotion, setPromotion] = useState(null)
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  const [play] = useSound(moveAudio)
  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item) => {
      const pieceDetailArray = item.id.split('_')
      if( (playerNumber===1 && turn === 'w') || (playerNumber===2 && turn === 'b')) {
        // handleMove(pieceDetailArray[0], position)
        play()
        socket.emit('validMove', {from: pieceDetailArray[0],to: position, roomName})
      }
    },
  })


  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  useEffect(() => {
    const subscribe = gameSubject.subscribe(
      ({ pendingPromotion }) =>
        pendingPromotion && pendingPromotion.to === position
          ? setPromotion(pendingPromotion)
          : setPromotion(null)
    )
    return () => subscribe.unsubscribe()
  }, [position])
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------0

  
  return (
    <div className="board-square" ref={drop}>
      <Square black={black}>
{/* // --------------------------------------------------------------
// --------------------------------------------------------------
// -------------------------------------------------------------- */}
        {promotion ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
{/* // --------------------------------------------------------------
// --------------------------------------------------------------
// -------------------------------------------------------------- */}
      </Square>
    </div>
  )
}
