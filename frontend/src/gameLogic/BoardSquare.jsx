import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { move } from './Game'
import { gameSubject } from './Game'
import { socket, playerNumber, roomName } from '../connections/socket'
import useSound from 'use-sound'
import moveAudio from '../sound/moveAudio.mp3'
import Promote from './Promote'

const covertAlpha = {"a":"h", "b":"g", "c":"f", "d":"e", "e":"d", "f":"c", "g":"b", "h":"a"}
const convertNum = {"0":"7", "1":"6", "2":"5", "3":"4", "4":"3", "5":"4", "6":"1", "7":"0"}

export default function BoardSquare({piece,black,position,turn}) {
  const [promotion, setPromotion] = useState(null)
  const [play] = useSound(moveAudio)
  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item) => {
      // console.log("pos",position)
      const pieceDetailArray = item.id.split('_')
      if( (playerNumber===1 && turn === 'w') || (playerNumber===2 && turn === 'b')) {
        // handleMove(pieceDetailArray[0], position)
        play()
        socket.emit('validMove', {from: pieceDetailArray[0],to: position, roomName})
      }
    },
  })


  // useEffect(() => {
  //   const subscribe = gameSubject.subscribe(
  //     ({ pendingPromotion }) => {
  //       if(pendingPromotion) {
  //         if( (playerNumber===1 && turn === 'w') || (playerNumber===2 && turn === 'b')) {
  //             if(pendingPromotion.to === position) {
  //               console.log("pos",position)
  //               setPromotion(pendingPromotion)
  //             } else {
  //               setPromotion(null)
  //           }
  //         } else {
  //           let newPosition = covertAlpha[position[0]]+convertNum[position[1]]
            
  //           if(pendingPromotion.to === newPosition) {
  //             // console.log("newpos",newPosition)
  //             console.log("newpos",newPosition)
  //             setPromotion(pendingPromotion)
  //           } else {
  //             setPromotion(null)
  //           }            
  //         }
  //       }
  //     }
  // return () => subscribe.unsubscribe()
// }, [position])
  useEffect(() => {
    const subscribe = gameSubject.subscribe(
      ({ pendingPromotion }) =>
        pendingPromotion && pendingPromotion.to === position
          ? setPromotion(pendingPromotion)
          : setPromotion(null)
    )
    return () => subscribe.unsubscribe()
  }, [position])

  useEffect(()=> {
        socket.on('validPromoteMove', (detailsObject)=> {
          move(detailsObject.from, detailsObject.to, detailsObject.p)
        })
  })
  
  return (
    <div className="board-square" ref={drop}>
      <Square black={black}>
        {promotion && (((playerNumber===1 && turn === 'w') || (playerNumber===2 && turn === 'b'))) ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
  )
}
