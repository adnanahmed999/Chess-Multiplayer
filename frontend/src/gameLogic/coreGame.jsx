import React, { useEffect, useState } from 'react'
import '../App.css'
import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'
import { roomName, socket, playerNumber } from '../connections/socket'


function CoreGame() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [turn, setTurn] = useState()
  const [userChecked, setUserChecked] = useState(false)
 
  
  useEffect(() => {
    initGame()
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board)
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setTurn(game.turn)
      setUserChecked(game.isChecked)
    })
    return () => subscribe.unsubscribe()
  }, [])

  useEffect(()=> {
    socket.on('resetGame', resetGame)
  }, [])

  function handleReset() {
    socket.emit('reStartNewGame', {roomName, playerNumber })
  }



  return (
    <div className="container">
      <div>
        {isGameOver && (
          <h2 className="text">
            GAME OVER
          </h2>
        )}
        <div>
          <button className="btn btn-success mb-4" onClick={handleReset}>Reset Game</button>
          {userChecked && <h1>Check!!!</h1>}
        </div>
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