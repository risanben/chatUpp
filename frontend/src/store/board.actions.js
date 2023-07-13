import { SET_BOARD, SET_SELECTED_CHAT, UPDATE_BOARD } from "./board.reducer.js";
import { boardService } from "../services/board.service.local.js"
import { store } from '../store/store.js'

export async function loadboard(user) {
    try {
        const board = await boardService.query(user)
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function setSelectedChatIdx(selectedChatIdx) {
    try {
        store.dispatch({
            type: SET_SELECTED_CHAT,
            selectedChatIdx:selectedChatIdx
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

export async function setBoard(board) {
    try {
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot set board', err)
        throw err
    }
}