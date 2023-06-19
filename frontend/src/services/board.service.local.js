import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'


export const boardService = {
    query,
    // getById,
    save,
    addMsg
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
        if (!board) board = getDemoBoard(userID)
    }

    return board
}

function getDemoBoard(userId) {
    console.log('retrieving demo board')
    return {
        "userId": `${userId}`,
        "chats": [
            {
                "id": "c101",
                "participants": [
                    `${userId}`,
                    "qXJvh"
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": `${userId}`,
                        "timestamp": "1685628094592",
                        "content": "Hello, mai!"
                    },
                    {
                        "id": "message2",
                        "sender": "qXJvh",
                        "timestamp": "1685628094592",
                        "content": "Hello ris, my name is mai"
                    }
                ]
            },
            {
                "id": "c102",
                "participants": [
                    `${userId}`,
                    "u108"
                ],
                "messages": [
                    {
                        "id": "m102",
                        "sender": "u108",
                        "timestamp": "1685628094598",
                        "content": "Hiiii"
                    },
                    {
                        "id": "message1",
                        "sender": `${userId}`,
                        "timestamp": "1685628094599",
                        "content": "hello you "
                    }
                ]
            }
        ]
    }
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

function addMsg(board, chat, msg) {
    //adding the message within the sender board first 
    let boardToSave = { ...board }
    let chatToSave = boardToSave.chats.find(chat => chat.id === chat.id)
    chatToSave.messages.push(msg)

    // then adding the message within the other participant 
    const participantsIds = chat.participants.filter(p => p !== board.userId)
    _addMsgOnParticipantsBoard(participantsIds[0], chat, msg)
    // const board = await boardService.query(userId)
    return boardToSave
}

async function _addMsgOnParticipantsBoard(participantId, chat, msg) {
    try {

        let userBoard = await query(participantId)
        let chatToSave = userBoard.chats.find(chat => chat.id === chat.id)
        if (!chatToSave) {
            chatToSave = getEmptyChat(participantId, msg.sender, chat.Id)
            userBoard.chats.push(chatToSave)
        }
        chatToSave.messages.push(msg)
        save(userBoard)
    }
    catch (err) {
        console.error('propblem saving the message on participants board :', err)
    }
}

function getEmptyChat(receiverId, senderId, chatId) {
    return {
        "id": `${chatId}`,
        "participants": [
            `${receiverId}`,
            `${senderId}`
        ],
        "messages": []
    }
}

let demoBoards = [
    {
        "_id": "b101",
        "userId": 'u101',
        "chats": [
            {
                "id": "c101",
                "participants": [
                    "u101",
                    "u105"
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": "u101",
                        "timestamp": "1685628094592",
                        "content": "Hello, Jane!"
                    },
                    {
                        "id": "message2",
                        "sender": "u105",
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

