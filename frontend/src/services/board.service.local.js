import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'


export const boardService = {
    query,
    // getById,
    save,
    // remove,
    // getEmptyCar,
    // addCarMsg
}
window.cs = boardService
const STORAGE_KEY = 'board'


async function query(userID) {
    var boards = await storageService.query(STORAGE_KEY)
    let board
    if (!boards.length) {
        boards = demoBoards
        storageService._save(STORAGE_KEY, boards)
    }
    if (userID) {
        board = boards.find(b => b.userId === userID)
    }

    return board
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)

    } else {
        console.log('sent to storageservice.save instead od put :')
        savedBoard = await storageService.post(STORAGE_KEY, board)
    }
   
    return savedBoard
}

let demoBoards = [
    {
        "_id": "b101",
        "userId": 'u101',
        "chats": [
            {
                "id": "c101",
                "participants": [
                    "userId1",
                    "userId2"
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": "userId1",
                        "timestamp": "1685628094592",
                        "content": "Hello, Jane!"
                    },
                    {
                        "id": "message2",
                        "sender": "user2",
                        "timestamp": "1685628094592",
                        "content": "Hi, John! How are you?"
                    }
                ]
            },
            {
                "id": "c102",
                "participants": [
                    "userId1",
                    "userId5"
                ],
                "messages": [
                    {
                        "id": "m102",
                        "sender": "userId1",
                        "timestamp": "1685628094598",
                        "content": "Hiiii"
                    },
                    {
                        "id": "message1",
                        "sender": "user5",
                        "timestamp": "1685628094599",
                        "content": "hello you "
                    }
                ]
            }
        ]
    },
    {
        "_id": "b102",
        "userId": 'u102',
        "chats": [
            {
                "id": "c101",
                "participants": [
                    "userId1",
                    "userId2"
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": "userId1",
                        "timestamp": "1685628094592",
                        "content": "Hello, Jane!"
                    },
                    {
                        "id": "message2",
                        "sender": "user2",
                        "timestamp": "1685628094592",
                        "content": "Hi, John! How are you?"
                    }
                ]
            },
            {
                "id": "c102",
                "participants": [
                    "userId1",
                    "userId5"
                ],
                "messages": [
                    {
                        "id": "m102",
                        "sender": "userId1",
                        "timestamp": "1685628094598",
                        "content": "Hiiii"
                    },
                    {
                        "id": "message1",
                        "sender": "user5",
                        "timestamp": "1685628094599",
                        "content": "hello you "
                    }
                ]
            }
        ]
    }
]