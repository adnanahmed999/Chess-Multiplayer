
import React from 'react'
import Square from './Square'
import { move } from './Game'
import { socket } from '../connections/socket'
const promotionPieces = ['r', 'n', 'b', 'q']

export default function Promote({
  promotion: { from, to, color },
}) {
  return (
    <div className="board">
      {promotionPieces.map((p, i) => (
        <div key={i} className="promote-square">
          <Square black={i % 3 === 0}>
            <div
              className="piece-container"
              onClick={() => {
                move(from, to, p)
                socket.emit('promoteMove', {from, to, p})
              } }
            >
              <img
                src={(`/assets/${p}_${color}.png`)}
                alt=""
                className="piece cursor-pointer"
              />
            </div>
          </Square>
        </div>
      ))}
    </div>
  )
}
