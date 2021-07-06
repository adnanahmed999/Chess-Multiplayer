import React, { useEffect, useState } from 'react'
import BoardSquare from './BoardSquare'
import { playerNumber } from '../connections/socket'
import { socket } from '../connections/socket'
import { handleMovePieces } from './Game'


export default function Board({ board, turn }) {
  const [currBoard, setCurrBoard] = useState([])

  useEffect(() => {
    setCurrBoard(
      playerNumber === 1 ? board.flat() : board.flat().reverse()
    )
  }, [board, playerNumber])

  useEffect(()=> {
    socket.on('movePieces', handleMovePieces)
}, [])

  function getXYPosition(i) {
    
// -> '   +------------------------+
//      7 | r  n  b  q  k  b  n  r |
//      6 | p  p  p  p  .  p  p  p |
//      5 | .  .  .  .  .  .  .  . |
//      4 | .  .  .  .  p  .  .  . |
//      3 | .  .  .  .  P  P  .  . |
//      2 | .  .  .  .  .  .  .  . |
//      1 | P  P  P  P  .  .  P  P |
//      0 | R  N  B  Q  K  B  N  R |
//        +------------------------+
//          0  1  2  3  4  5  6  7
//       i values are indexes i.e from 0 (at (0,7)) to 63 (at (7,0))
    const x = turn === 'w' ? i % 8 : Math.abs((i % 8) - 7)
    const y =
      turn === 'w'
        ? Math.abs(Math.floor(i / 8) - 7)
        : Math.floor(i / 8)
    return { x, y }
  }

  function isBlack(i) {
    const { x, y } = getXYPosition(i)
    return (x + y) % 2 === 0
  }

  function getPosition(i) {
    const { x, y } = getXYPosition(i)
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][
      x
    ]
    return `${letter}${y + 1}`
  }
  return (
    <div className="board">
      {currBoard.map((piece, i) => (
        <div key={i} className="square">
          <BoardSquare
            piece={piece}
            black={isBlack(i)}
            position={getPosition(i)} 
            turn = {turn}
          />
        </div>
      ))}
    </div>
  )
}
