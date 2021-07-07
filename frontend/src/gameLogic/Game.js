import * as Chess from 'chess.js'
import { BehaviorSubject } from 'rxjs'


const chess = new Chess()
// instance of standard chess library



export const gameSubject = new BehaviorSubject()

export function initGame() {
    // const savedGame = localStorage.getItem('savedGame')
    // const savedGame = null
    // if (savedGame) {
    //     chess.load(savedGame)
    // }
    updateGame()
}

export function resetGame() {
    chess.reset()
    updateGame()
}

export function handleMove(from, to) {
    console.log(chess.board())
    // --------------------------------------------------------------------
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion) // checking all possible moves, verbose true means we are converting it to array
    console.table(promotions)
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = { from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
    }
    const { pendingPromotion } = gameSubject.getValue()
    // --------------------------------------------------------------------
    if (!pendingPromotion) {
        move(from, to)
    }
}


export function move(from, to, promotion) {
    // promotion parameter is extra if you want to avoid promotion


    let tempMove = { from, to }

    // -------------------------------------------
    if (promotion) {
        tempMove.promotion = promotion
    }
    // --------------------------------------------

    // for initial setup, check screenshot.

    const legalMove = chess.move(tempMove)

    if (legalMove) {

        updateGame()
    }
}

export function handleMovePieces(positionObject) {
    handleMove(positionObject.from, positionObject.to)
}

function updateGame(pendingPromotion) {
    const isGameOver = chess.game_over()

    const newGame = {
        board: chess.board(),
        // Returns an 2D array representation of the current position. Empty squares are represented by null.
        // -------------------------------------------------------------
        // -------------------------------------------------------------
        pendingPromotion,
        // -------------------------------------------------------------
        // -------------------------------------------------------------
        isGameOver,
        turn: chess.turn(),
        result: isGameOver ? getGameResult() : null
    }

    // localStorage.setItem('savedGame', chess.fen())

    gameSubject.next(newGame)
}
function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}