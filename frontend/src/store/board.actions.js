import { SET_BOARD } from "./board.reducer.js";
import { boardService } from "../services/board.service.local.js"
import { store } from '../store/store.js'

export async function loadboard() {
    try {
        const board = await boardService.query()
        console.log('Cars from DB:', board)
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }

}