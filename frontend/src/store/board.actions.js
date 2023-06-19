import { SET_BOARD, UPDATE_BOARD } from "./board.reducer.js";
import { boardService } from "../services/board.service.local.js"
import { store } from '../store/store.js'

export async function loadboard(userId) {

    try {
        const board = await boardService.query(userId)
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }

}

export async function updateBoard(board) {
    try {
        await boardService.save(board)
        store.dispatch({
            type: UPDATE_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot update board', err)
        throw err
    }
}