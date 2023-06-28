import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'


export const boardService = {
    query,
    // getById,
    save,
    addMsg,
    updateParticipantBoard,
    deleteChat,
    deleteChatFromUser,
    toggleArchive
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
        // const chats = board.chats.reduce((acc, chat) => {
        //     var chatIds = chat.participants.map(p => {
        //        getUser(p.userId)
        //     })
        //     // chatIds = chatNames.filter(n => n.includes(filterBy.txt))
        //     // if (chatNames.length) acc.push(chat)
        //     return acc
        // }, [])
        // board = { ...board, chats: chats }
    }
    if (filterBy?.unRead === 'true') {
        var chats = board.chats.reduce((acc, c) => {
            if (c.messages.some(m => !m.isRead)) acc.push(c)
            return acc
        }, [])

        board = { ...board, chats: chats }
    }
    if (filterBy?.archive === 'true') {
        var chats = board.chats.filter(c=>c.isArchived)
        board = { ...board, chats: chats }
    }
    if (filterBy?.archive === 'false') {
        var chats = board.chats.filter(c=>!c.isArchived)
        board = { ...board, chats: chats }
    }

    // Sort the chats array based on the message with the latest timestamp
    board.chats.sort((chatA, chatB) => {
        const latestTimestampA = chatA.messages[chatA.messages.length - 1].timestamp
        const latestTimestampB = chatB.messages[chatB.messages.length - 1].timestamp

        return latestTimestampB - latestTimestampA
    })

    return board
}

function deleteChat(board, chatId) {
    let boardToSave = { ...board }
    const chatIdx = board.chats.findIndex(c => c.id === chatId)
    if (chatIdx === -1) return new Error('could not find chat to remove')
    boardToSave.chats.splice(chatIdx, 1)
    return boardToSave
}

function toggleArchive(board, chatId) {
    let boardToSave = { ...board }
    const chatIdx = board.chats.findIndex(c => c.id === chatId)
    if (chatIdx === -1) return new Error('could not find chat')
    if (boardToSave.chats[chatIdx].isArchived === undefined){
        boardToSave.chats[chatIdx].isArchived = true
    } else {
        boardToSave.chats[chatIdx].isArchived = !boardToSave.chats[chatIdx].isArchived
    }
    return boardToSave
}

async function deleteChatFromUser(userId, chatId) {
    const userBoard = await query({ user: { _id: userId } })
    const chatIdx = userBoard.chats.findIndex(c => c.id === chatId)
    if (chatIdx === -1) return new Error(`could not find chat to remove for user: ${userId} `)
    userBoard.chats.splice(chatIdx, 1)
    save(userBoard)
}

function getDemoBoard(user) {
    console.log('retrieving demo board')
    return {
        "userId": `${user._id}`,
        "chats": [
            {
                "id": "c110fd",
                "participants": [
                    {
                        'userId': 'iwrDvfff',
                        'username': 'Sharon',
                    },
                    {
                        'userId': 'tGJgU',
                        'username': 'ris',
                    }
                ],
                "messages": [
                    {
                        "id": "m1014f5",
                        "sender": 'tGJgU',
                        "timestamp": 1687768856451,
                        "content": "hey ive tried to call you",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf3",
                        "sender": 'iwrDvfff',
                        "timestamp": 1687768905927,
                        "content": "hey sorry ive been so busy last few days. you alright?",
                        "isRead": true
                    },
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
    // ris 
    {
        "_id": "b101",
        "userId": 'tGJgU',
        "chats": [
            {
                "isArchived":true,
                "id": "c23g5fg",
                "participants": [
                    {
                        "userId": "iwrDv"
                    },
                    {
                        "userId": "tGJgU"
                    }
                ],
                "messages": [
                    {
                        "id": "m231d4fr",
                        "sender": "iwrDv",
                        "timestamp": 1687788810544,
                        "content": "Hello! im a guest here",
                        "isRead": true
                    },
                ]
            },
            {
                "id": "c235fg",
                "participants": [
                    {
                        "userId": "abc123"
                    },
                    {
                        "userId": "tGJgU"
                    }
                ],
                "messages": [
                    {
                        "id": "m2314fr",
                        "sender": "tGJgU",
                        "timestamp": 1687775285942,
                        "content": "Hey, have you seen the latest project update?",
                        "isRead": true
                    },
                    {
                        "id": "m2313gr",
                        "sender": "abc123",
                        "timestamp": 1687775339140,
                        "content": "Hi! Yes, I've reviewed it. Looks promising. Do you think we should suggest some improvements?",
                        "isRead": true
                    },
                    {
                        "id": "m2319jk",
                        "sender": "tGJgU",
                        "timestamp": 1687775512073,
                        "content": "Definitely! I have a few ideas in mind. Let's discuss them during our team meeting tomorrow.",
                        "isRead": true
                    },
                    {
                        "id": "m2318db",
                        "sender": "abc123",
                        "timestamp": 1687775569320,
                        "content": "Sounds good. Should we also share the update with the rest of the team?",
                        "isRead": true
                    },
                    {
                        "id": "m2317ff",
                        "sender": "tGJgU",
                        "timestamp": 1687775627564,
                        "content": "Yes, I think it would be helpful. I'll send out an email with the key highlights and encourage everyone to review the detailed report.",
                        "isRead": true
                    },
                    {
                        "id": "m2316js",
                        "sender": "abc123",
                        "timestamp": 1687775688892,
                        "content": "Great! Let's aim for a productive discussion and gather valuable feedback from the team.",
                        "isRead": true
                    },
                    {
                        "id": "m2315ht",
                        "sender": "tGJgU",
                        "timestamp": 1687775747181,
                        "content": "Absolutely! It's important to ensure everyone is aligned and has a chance to contribute.",
                        "isRead": true
                    },
                    {
                        "id": "m2314ru",
                        "sender": "abc123",
                        "timestamp": 1687775804397,
                        "content": "Agreed. We've been making good progress, and this update will keep everyone in the loop.",
                        "isRead": true
                    },
                    {
                        "id": "m2313gf",
                        "sender": "tGJgU",
                        "timestamp": 1687775869123,
                        "content": "Definitely. Let's continue to collaborate and deliver outstanding results.",
                        "isRead": true
                    }
                ]
            },
            {
                "id": "c110fd",
                "participants": [
                    {
                        'userId': 'iwrDvfff',
                    },
                    {
                        'userId': 'tGJgU',
                    }
                ],
                "messages": [
                    {
                        "id": "m1014f5",
                        "sender": 'tGJgU',
                        "timestamp": 1687768856451,
                        "content": "hey ive tried to call you",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf3",
                        "sender": 'iwrDvfff',
                        "timestamp": 1687768905927,
                        "content": "hey sorry ive been so busy last few days. you alright?",
                        "isRead": true
                    },
                    {
                        "id": "m1019jk7",
                        "sender": "tGJgU",
                        "timestamp": 1687770103350,
                        "content": "No worries! I'm doing fine, thanks for asking. How about you?",
                        "isRead": true
                    },
                    {
                        "id": "m1018db2",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770172891,
                        "content": "I'm doing well too, just swamped with work. By the way, did you watch the new movie that came out?",
                        "isRead": true
                    },
                    {
                        "id": "m1017ff1",
                        "sender": "tGJgU",
                        "timestamp": 1687770251163,
                        "content": "Yes, I did! It was amazing. We should plan a movie night and watch it together.",
                        "isRead": true
                    },
                    {
                        "id": "m1016js8",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770328112,
                        "content": "That sounds like a great idea! Let's do it this weekend. I'll bring some snacks.",
                        "isRead": true
                    },
                    {
                        "id": "m1015ht4",
                        "sender": "tGJgU",
                        "timestamp": 1687770405927,
                        "content": "Perfect! Saturday evening works for me. Can't wait to hang out and catch up.",
                        "isRead": true
                    },
                    {
                        "id": "m1014ru3",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770484432,
                        "content": "Sounds like a plan! It's been too long since we last got together. Any other movie recommendations?",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf5",
                        "sender": "tGJgU",
                        "timestamp": 1687770559876,
                        "content": "Definitely! How about we make a list of must-watch movies and discuss it when we meet? We can add some classics and new releases.",
                        "isRead": true
                    },
                    {
                        "id": "m1012kl9",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770632453,
                        "content": "That's a fantastic idea! We can create a shared document and keep adding to it. It will be our ultimate movie list.",
                        "isRead": true
                    },
                    {
                        "id": "m1011op0",
                        "sender": "tGJgU",
                        "timestamp": 1687770708349,
                        "content": "Agreed! We have so many"
                    },
                ]
            },
            {
                "id": "c101",
                "participants": [
                    {
                        'userId': 'tGJgU',
                    },
                    {
                        'userId': 'qXJvh',
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
                "id": "c110",
                "participants": [
                    {
                        'userId': 'iwrDvgJ',
                    },
                    {
                        'userId': 'tGJgU',
                    }
                ],
                "messages": [
                    {
                        "id": "m10145",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687725690383,
                        "content": "Hey Ris, I have left you a note on your desk with tasks for tomorrow",
                        "isRead": true
                    },
                    {
                        "id": "m10133",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687725773408,
                        "content": "Did you see it? 📝",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf3",
                        "sender": "tGJgU",
                        "timestamp": 1687770545888,
                        "content": "Yes! Thank you, I'm on it! 👍",
                        "isRead": true
                    },
                    {
                        "id": "m1012fa2",
                        "sender": "tGJgU",
                        "timestamp": 1687770619721,
                        "content": "Hey, have you finalized the presentation for the client meeting tomorrow? 📊",
                        "isRead": true
                    },
                    {
                        "id": "m1011he1",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687770688372,
                        "content": "Almost done! Just need to add a few more slides and then it'll be ready. 🖥️",
                        "isRead": true
                    },
                    {
                        "id": "m1010lj0",
                        "sender": "tGJgU",
                        "timestamp": 1687770762105,
                        "content": "Great! Let's have a quick meeting to go through it and make any necessary changes. How about in 30 minutes? ⏰",
                        "isRead": true
                    },
                    {
                        "id": "m109hb9",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687770843847,
                        "content": "Sounds good! Let's meet in the conference room. See you there! 👥",
                        "isRead": true
                    },
                    {
                        "id": "m108as8",
                        "sender": "tGJgU",
                        "timestamp": 1687770907921,
                        "content": "I'm on my way to the conference room now. See you shortly! 🚶",
                        "isRead": true
                    },
                    {
                        "id": "m107gr7",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687770979132,
                        "content": "I'm already here. Just finishing up some final touches. 🖊️",
                        "isRead": true
                    },
                    {
                        "id": "m106et6",
                        "sender": "tGJgU",
                        "timestamp": 1687771045702,
                        "content": "Perfect! Let's make sure everything is polished and ready to impress the client. 💼💪",
                        "isRead": true
                    }
                ]
            },
            {
                "id": "c102",
                "participants": [
                    {
                        'userId': 'tGJgU',
                    },
                    {
                        'userId': 'qXJvf',
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
                "isArchived": true,
                "id": "cd2dkwg",
                "participants": [
                    {
                        "userId": "iwrDv"
                    },
                    {
                        "userId": "qXJvh"
                    }
                ],
                "messages": [
                    {
                        "id": "m231d4fr",
                        "sender": "iwrDv",
                        "timestamp": 1687788810544,
                        "content": "Hello! im a guest here",
                        "isRead": true
                    },
                ]
            },
            {
                "id": "c101",
                "participants": [
                    {
                        'userId': 'tGJgU',
                    },
                    {
                        'userId': 'qXJvh',
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
                    },
                    {
                        'userId': 'qXJvh',
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
                "id": "c120",
                "participants": [
                    {
                        'userId': 'iwrDvgJ',
                    },
                    {
                        'userId': 'qXJvh',
                    },
                ],
                "messages": [
                    {
                        "id": "m10254",
                        "sender": 'qXJvh',
                        "timestamp": 1685628094598,
                        "content": "jordan, its been long time. how are you? ",
                        "isRead": true
                    },
                    {
                        "id": "message451",
                        "sender": 'iwrDvgJ',
                        "timestamp": 1687726084791,
                        "content": "hey Mai! it has! what have you been upto these days? ",
                        "isRead": false
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
                "id": "cd2ttwg",
                "participants": [
                    {
                        "userId": "iwrDv"
                    },
                    {
                        "userId": "qXJvf"
                    }
                ],
                "messages": [
                    {
                        "id": "m231d4fr",
                        "sender": "iwrDv",
                        "timestamp": 1687788810544,
                        "content": "Hello! im a guest here",
                        "isRead": true
                    },
                ]
            },
            {
                "id": "c105",
                "participants": [
                    {
                        'userId': 'qXJvf',
                    },
                    {
                        'userId': 'qXJvh',
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
                    },
                    {
                        'userId': 'qXJvf',
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

    // jordans board
    {
        "_id": "b110",
        "userId": 'iwrDvgJ',
        "chats": [
            {
                "id": "c110",
                "participants": [
                    {
                        'userId': 'iwrDvgJ',
                    },
                    {
                        'userId': 'tGJgU',
                    }
                ],
                "messages": [
                    {
                        "id": "m10145",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687725690383,
                        "content": "Hey Ris, I have left you a note on your desk with tasks for tomorrow",
                        "isRead": true
                    },
                    {
                        "id": "m10133",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687725773408,
                        "content": "Did you see it? 📝",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf3",
                        "sender": "tGJgU",
                        "timestamp": 1687770545888,
                        "content": "Yes! Thank you, I'm on it! 👍",
                        "isRead": true
                    },
                    {
                        "id": "m1012fa2",
                        "sender": "tGJgU",
                        "timestamp": 1687770619721,
                        "content": "Hey, have you finalized the presentation for the client meeting tomorrow? 📊",
                        "isRead": true
                    },
                    {
                        "id": "m1011he1",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687770688372,
                        "content": "Almost done! Just need to add a few more slides and then it'll be ready. 🖥️",
                        "isRead": true
                    },
                    {
                        "id": "m1010lj0",
                        "sender": "tGJgU",
                        "timestamp": 1687770762105,
                        "content": "Great! Let's have a quick meeting to go through it and make any necessary changes. How about in 30 minutes? ⏰",
                        "isRead": true
                    },
                    {
                        "id": "m109hb9",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687770843847,
                        "content": "Sounds good! Let's meet in the conference room. See you there! 👥",
                        "isRead": true
                    },
                    {
                        "id": "m108as8",
                        "sender": "tGJgU",
                        "timestamp": 1687770907921,
                        "content": "I'm on my way to the conference room now. See you shortly! 🚶",
                        "isRead": true
                    },
                    {
                        "id": "m107gr7",
                        "sender": "iwrDvgJ",
                        "timestamp": 1687770979132,
                        "content": "I'm already here. Just finishing up some final touches. 🖊️",
                        "isRead": true
                    },
                    {
                        "id": "m106et6",
                        "sender": "tGJgU",
                        "timestamp": 1687771045702,
                        "content": "Perfect! Let's make sure everything is polished and ready to impress the client. 💼💪",
                        "isRead": true
                    }
                ]
            },
            {
                "id": "c120",
                "participants": [
                    {
                        'userId': 'iwrDvgJ',
                    },
                    {
                        'userId': 'qXJvh',
                    },
                ],
                "messages": [
                    {
                        "id": "m10254",
                        "sender": 'qXJvh',
                        "timestamp": 1685628094598,
                        "content": "jordan, its been long time. how are you? ",
                        "isRead": true
                    },
                    {
                        "id": "message451",
                        "sender": 'iwrDvgJ',
                        "timestamp": 1687726084791,
                        "content": "hey Mai! it has! what have you been upto these days? ",
                        "isRead": true
                    }
                ]
            }
        ]
    },


    // Sharons board
    {
        "_id": "b110fg",
        "userId": 'iwrDvfff',
        "chats": [
            {
                "id": "c110fd",
                "participants": [
                    {
                        'userId': 'iwrDvfff',
                    },
                    {
                        'userId': 'tGJgU',
                    }
                ],
                "messages": [
                    {
                        "id": "m1014f5",
                        "sender": 'tGJgU',
                        "timestamp": 1687768856451,
                        "content": "hey ive tried to call you",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf3",
                        "sender": 'iwrDvfff',
                        "timestamp": 1687768905927,
                        "content": "hey sorry ive been so busy last few days. you alright?",
                        "isRead": true
                    },
                    {
                        "id": "m1019jk7",
                        "sender": "tGJgU",
                        "timestamp": 1687770103350,
                        "content": "No worries! I'm doing fine, thanks for asking. How about you?",
                        "isRead": true
                    },
                    {
                        "id": "m1018db2",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770172891,
                        "content": "I'm doing well too, just swamped with work. By the way, did you watch the new movie that came out?",
                        "isRead": true
                    },
                    {
                        "id": "m1017ff1",
                        "sender": "tGJgU",
                        "timestamp": 1687770251163,
                        "content": "Yes, I did! It was amazing. We should plan a movie night and watch it together.",
                        "isRead": true
                    },
                    {
                        "id": "m1016js8",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770328112,
                        "content": "That sounds like a great idea! Let's do it this weekend. I'll bring some snacks.",
                        "isRead": true
                    },
                    {
                        "id": "m1015ht4",
                        "sender": "tGJgU",
                        "timestamp": 1687770405927,
                        "content": "Perfect! Saturday evening works for me. Can't wait to hang out and catch up.",
                        "isRead": true
                    },
                    {
                        "id": "m1014ru3",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770484432,
                        "content": "Sounds like a plan! It's been too long since we last got together. Any other movie recommendations?",
                        "isRead": true
                    },
                    {
                        "id": "m1013gf5",
                        "sender": "tGJgU",
                        "timestamp": 1687770559876,
                        "content": "Definitely! How about we make a list of must-watch movies and discuss it when we meet? We can add some classics and new releases.",
                        "isRead": true
                    },
                    {
                        "id": "m1012kl9",
                        "sender": "iwrDvfff",
                        "timestamp": 1687770632453,
                        "content": "That's a fantastic idea! We can create a shared document and keep adding to it. It will be our ultimate movie list.",
                        "isRead": true
                    },
                    {
                        "id": "m1011op0",
                        "sender": "tGJgU",
                        "timestamp": 1687770708349,
                        "content": "Agreed! We have so many"
                    },
                ]
            },
        ]
    },


    // mitch board
    {
        "_id": "e235gh",
        "userId": "abc123",
        "chats": [
            {
                "id": "c235fg",
                "participants": [
                    {
                        "userId": "abc123"
                    },
                    {
                        "userId": "tGJgU"
                    }
                ],
                "messages": [
                    {
                        "id": "m2314fr",
                        "sender": "tGJgU",
                        "timestamp": 1687775285942,
                        "content": "Hey, have you seen the latest project update?",
                        "isRead": true
                    },
                    {
                        "id": "m2313gr",
                        "sender": "abc123",
                        "timestamp": 1687775339140,
                        "content": "Hi! Yes, I've reviewed it. Looks promising. Do you think we should suggest some improvements?",
                        "isRead": true
                    },
                    {
                        "id": "m2319jk",
                        "sender": "tGJgU",
                        "timestamp": 1687775512073,
                        "content": "Definitely! I have a few ideas in mind. Let's discuss them during our team meeting tomorrow.",
                        "isRead": true
                    },
                    {
                        "id": "m2318db",
                        "sender": "abc123",
                        "timestamp": 1687775569320,
                        "content": "Sounds good. Should we also share the update with the rest of the team?",
                        "isRead": true
                    },
                    {
                        "id": "m2317ff",
                        "sender": "tGJgU",
                        "timestamp": 1687775627564,
                        "content": "Yes, I think it would be helpful. I'll send out an email with the key highlights and encourage everyone to review the detailed report.",
                        "isRead": true
                    },
                    {
                        "id": "m2316js",
                        "sender": "abc123",
                        "timestamp": 1687775688892,
                        "content": "Great! Let's aim for a productive discussion and gather valuable feedback from the team.",
                        "isRead": true
                    },
                    {
                        "id": "m2315ht",
                        "sender": "tGJgU",
                        "timestamp": 1687775747181,
                        "content": "Absolutely! It's important to ensure everyone is aligned and has a chance to contribute.",
                        "isRead": true
                    },
                    {
                        "id": "m2314ru",
                        "sender": "abc123",
                        "timestamp": 1687775804397,
                        "content": "Agreed. We've been making good progress, and this update will keep everyone in the loop.",
                        "isRead": true
                    },
                    {
                        "id": "m2313gf",
                        "sender": "tGJgU",
                        "timestamp": 1687775869123,
                        "content": "Definitely. Let's continue to collaborate and deliver outstanding results.",
                        "isRead": true
                    }
                ]
            }
        ]
    },

    // guest board 
    {
        "_id": "e235gh",
        "userId": "iwrDv",
        "chats": [
            {
                "id": "c23g5fg",
                "participants": [
                    {
                        "userId": "iwrDv"
                    },
                    {
                        "userId": "tGJgU"
                    }
                ],
                "messages": [
                    {
                        "id": "m231d4fr",
                        "sender": "iwrDv",
                        "timestamp": 1687788810544,
                        "content": "Hello! im a guest here",
                        "isRead": true
                    },
                ]
            },
            {
                "id": "cd2dkwg",
                "participants": [
                    {
                        "userId": "iwrDv"
                    },
                    {
                        "userId": "qXJvh"
                    }
                ],
                "messages": [
                    {
                        "id": "m231d4fr",
                        "sender": "iwrDv",
                        "timestamp": 1687788810544,
                        "content": "Hello! im a guest here",
                        "isRead": true
                    },
                ]
            },
            {
                "id": "cd2ttwg",
                "participants": [
                    {
                        "userId": "iwrDv"
                    },
                    {
                        "userId": "qXJvf"
                    }
                ],
                "messages": [
                    {
                        "id": "m231d4fr",
                        "sender": "iwrDv",
                        "timestamp": 1687788810544,
                        "content": "Hello! im a guest here",
                        "isRead": true
                    },
                ]
            },
        ]
    }
]


// for me :
//  ris has chats with: mai (chatid: c101), jane(c102), Jordan(c110)
//  mai has chats with ris (c101), jane(c105), Jordan(c120)
// jane has a chat with mai(), ris()
// Jordan  has a chat with ris (c110), mai (c120)


