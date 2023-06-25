import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'


export const boardService = {
    query,
    // getById,
    save,
    addMsg,
    updateParticipantBoard
    // remove,
    // getEmptyCar,
    // addCarMsg
}
window.cs = boardService
const STORAGE_KEY = 'board'


async function query({ user, filterBy }) {

    var boards = await storageService.query(STORAGE_KEY)
    let board
    if (!boards.length) {
        boards = backupBoards
        storageService._save(STORAGE_KEY, boards)
    }
    if (user) {
        board = boards.find(b => b.userId === user._id)
        if (!board) {
            board = getDemoBoard(user)
            board = storageService.post(STORAGE_KEY, board)
        }

    }
    if (filterBy?.txt) {
        const chats = board.chats.reduce((acc, chat) => {
            var chatNames = chat.participants.map(p => p.username)
            chatNames = chatNames.filter(n => n.includes(filterBy.txt))
            if (chatNames.length) acc.push(chat)
            return acc
        }, [])
        board = { ...board, chats: chats }
    }
    if (filterBy?.unread) {
        console.log('board.chats:', board.chats)
        var chats = board.chats.reduce((acc, c) => {
            if (c.messages.some(m => !m.isRead)) acc.push(c)
            return acc
        }, [])

        board = { ...board, chats: chats }
    }

    return board
}

function getDemoBoard(user) {
    console.log('retrieving demo board')
    return {
        "userId": `${user._id}`,
        "chats": [
            {
                "id": utilService.makeId(),
                "participants": [
                    {
                        'userId': `${user._id}`,
                        'username': `${user.username}`,
                        'imgUrl': `${user.imgUrl}`
                    },
                    {
                        'userId': 'qXJvf',
                        'username': 'jane',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687190716/gps5k4scacs04qqlrjn2.jpg'
                    },
                ],
                "messages": [
                    {
                        "id": utilService.makeId(),
                        "sender": `${user._id}`,
                        "timestamp": 1687175825301,
                        "content": "Hello, Jane! i missed you "
                    },
                    {
                        "id": utilService.makeId(),
                        "sender": 'qXJvf',
                        "timestamp": 1687175863306,
                        "content": "nice to hear from you, wanna grab a coffee?"
                    }
                ]
            },
            {
                "id": utilService.makeId(),
                "participants": [
                    {
                        'userId': `${user._id}`,
                        'username': `${user.username}`,
                        'imgUrl': `${user.imgUrl}`
                    },
                    {
                        'userId': 'tGJgU',
                        'username': 'ris',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174221/ozfn5c2uulrxaulrqoir.jpg'
                    },

                ],
                "messages": [
                    {
                        "id": utilService.makeId(),
                        "sender": 'tGJgU',
                        "timestamp": 1687175863306,
                        "content": "Hiiii"
                    },
                    {
                        "id": utilService.makeId(),
                        "sender": `${user._id}`,
                        "timestamp": 1687175923171,
                        "content": "hello Ris, i love your app "
                    }
                ]
            }
        ]
    }
}

async function save(board) {
    var savedBoard
    if (board._id) {
        console.log('board has Id')
        savedBoard = await storageService.put(STORAGE_KEY, board)
    } else {
        console.log('sent to storageservice.save instead od put :')
        savedBoard = await storageService.post(STORAGE_KEY, board)
    }

    return savedBoard
}

async function addMsg(board, chat, msg) {
    let boardToSave = { ...board }
    let chatToSave = boardToSave.chats.find(c => c.id === chat.id)
    chatToSave.messages.push(msg)
    return boardToSave
}


async function updateParticipantBoard(board, chat, msg) {
    const msgToSave = { ...msg, isRead: false }
    const receiverId = chat.participants.filter(p => p.userId !== board.userId).map(p => p.userId).join()
    const user = await userService.getById(receiverId)

    try {
        let userBoard = await query({ user })
        // console.log('userBoard:', userBoard)
        let chatToUpdate = userBoard.chats.find(c => c.id === chat.id)

        if (chatToUpdate) {
            console.log('chat was found at the receiver')
            chatToUpdate.messages.push(msgToSave)
        } else {
            console.log('new chat was opened at receiver')
            return new Error('chat wasnt found at participant')
        }
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

let backupBoards = [
    {
        "_id": "b101",
        "userId": 'tGJgU',
        "chats": [
            {
                "id": "c101",
                "participants": [
                    {
                        'userId': 'tGJgU',
                        'username': 'ris',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174221/ozfn5c2uulrxaulrqoir.jpg'
                    },
                    {
                        'userId': 'qXJvh',
                        'username': 'mai',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174468/ijfmgo5brwhwk4gue92m.jpg'
                    }
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": 'tGJgU',
                        "timestamp": 1685628094592,
                        "content": "Hello, Mai, im Ris!",
                        "isRead": true
                    },
                    {
                        "id": "message2",
                        "sender": 'qXJvh',
                        "timestamp": 1685628094592,
                        "content": "Hi Ris, my name is Mai",
                        "isRead": false
                    }
                ]
            },
            {
                "id": "c102",
                "participants": [
                    {
                        'userId': 'tGJgU',
                        'username': 'ris',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174221/ozfn5c2uulrxaulrqoir.jpg'
                    },
                    {
                        'userId': 'qXJvf',
                        'username': 'jane',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687190716/gps5k4scacs04qqlrjn2.jpg'
                    },
                ],
                "messages": [
                    {
                        "id": "m102",
                        "sender": 'qXJvf',
                        "timestamp": 1685628094598,
                        "content": "Hiiii ris im jane",
                        "isRead": true
                    },
                    {
                        "id": "message1",
                        "sender": 'tGJgU',
                        "timestamp": 1685628094599,
                        "content": "hello jane! i missed you ",
                        "isRead": true
                    }
                ]
            }
        ]
    },


    //mai board
    {
        "_id": "b102",
        "userId": 'qXJvh',
        "chats": [
            {
                "id": "c101",
                "participants": [
                    {
                        'userId': 'tGJgU',
                        'username': 'ris',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174221/ozfn5c2uulrxaulrqoir.jpg'
                    },
                    {
                        'userId': 'qXJvh',
                        'username': 'mai',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174468/ijfmgo5brwhwk4gue92m.jpg'
                    }
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": 'tGJgU',
                        "timestamp": 1685628094592,
                        "content": "Hello, Mai, im Ris!",
                        "isRead": true
                    },
                    {
                        "id": "message2",
                        "sender": 'qXJvh',
                        "timestamp": 1685628094592,
                        "content": "Hi Ris, my name is Mai",
                        "isRead": true
                    }
                ]
            },
            {
                "id": "c105",
                "participants": [
                    {
                        'userId': 'qXJvf',
                        'username': 'jane',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687190716/gps5k4scacs04qqlrjn2.jpg'
                    },
                    {
                        'userId': 'qXJvh',
                        'username': 'mai',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174468/ijfmgo5brwhwk4gue92m.jpg'
                    }
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": 'qXJvf',
                        "timestamp": 1685628094592,
                        "content": "Hello Mai, im Jane!",
                        "isRead": true
                    },
                    {
                        "id": "message2",
                        "sender": 'qXJvh',
                        "timestamp": 1685628094592,
                        "content": "Hi jane, my name is Mai",
                        "isRead": true
                    }
                ]
            },
        ]
    },


    // janes board  
    {
        "_id": "b103",
        "userId": 'qXJvf',
        "chats": [
            {
                "id": "c105",
                "participants": [
                    {
                        'userId': 'qXJvf',
                        'username': 'jane',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687190716/gps5k4scacs04qqlrjn2.jpg'
                    },
                    {
                        'userId': 'qXJvh',
                        'username': 'mai',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174468/ijfmgo5brwhwk4gue92m.jpg'
                    }
                ],
                "messages": [
                    {
                        "id": "m101",
                        "sender": 'qXJvf',
                        "timestamp": 1685628094592,
                        "content": "Hello Mai, im Jane!",
                        "isRead": true
                    },
                    {
                        "id": "message2",
                        "sender": 'qXJvh',
                        "timestamp": 1685628094592,
                        "content": "Hi jane, my name is Mai",
                        "isRead": true
                    }
                ]
            },
            {
                "id": "c102",
                "participants": [
                    {
                        'userId': 'tGJgU',
                        'username': 'ris',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174221/ozfn5c2uulrxaulrqoir.jpg'
                    },
                    {
                        'userId': 'qXJvf',
                        'username': 'jane',
                        'imgUrl': 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687190716/gps5k4scacs04qqlrjn2.jpg'
                    },
                ],
                "messages": [
                    {
                        "id": "m102",
                        "sender": 'qXJvf',
                        "timestamp": 1685628094598,
                        "content": "Hiiii ris im jane",
                        "isRead": true
                    },
                    {
                        "id": "message1",
                        "sender": 'tGJgU',
                        "timestamp": 1685628094599,
                        "content": "hello jane! i missed you ",
                        "isRead": true
                    }
                ]
            }
        ]
    },
]


// for me :
//  ris has chats with: mai (chatid: c101), jane(c102)
//  mai has chats with ris (c101), jane(c105)
// jane has a chat with mai(), ris()
