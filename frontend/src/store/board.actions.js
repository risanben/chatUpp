import { SET_BOARD, SET_SELECTED_CHAT, UPDATE_BOARD } from "./board.reducer.js";
import { boardService } from "../services/board.service.local.js"
import { store } from '../store/store.js'

export async function loadboard(filters) {
    console.log('loadBoard!')
    console.log('filters:', filters)
    try {
        const board = await boardService.query(filters)
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function setSelectedChatId(selectedChatId) {
    try {
        store.dispatch({
            type: SET_SELECTED_CHAT,
            // doing it with extended method so i can send null 
            selectedChatId:selectedChatId
        })

    } catch (err) {
        console.log('Cannot set selected chat id', err)
        throw err
    }
}

export async function updateBoard(board) {
 
    try {
        await boardService.save(board)
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot update board', err)
        throw err
    }
}