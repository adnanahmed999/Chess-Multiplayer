import React, { useEffect, useState } from 'react'
import '../App.css'
import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'

function CoreGame() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [turn, setTurn] = useState()
  
  useEffect(() => {
    initGame()
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board)
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setTurn(game.turn)
    })
    return () => subscribe.unsubscribe()
  }, [])
  return (
    <div className="container">
      <div>
        {isGameOver && (
          <h2 className="text">
            GAME OVER
          </h2>
        )}
      </div>
      <div className="board-container">
        <Board board={board} turn={turn} />
      </div>
      <div>
        {result && <p className="text">{result}</p>}
      </div>
    </div>
  )
}

export default CoreGame