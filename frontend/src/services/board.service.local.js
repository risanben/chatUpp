import { storageService } from './async-storage.service.js'


export const boardService = {
    query,
    // getById,
    // save,
    // remove,
    // getEmptyCar,
    // addCarMsg
}
window.cs = boardService
const STORAGE_KEY = 'board'


async function query(filterBy = { txt: '', price: 0 }) {
    var board = await storageService.query(STORAGE_KEY)
    if(!board.length) board = demoBoard
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     cars = cars.filter(car => regex.test(car.vendor) || regex.test(car.description))
    // }
    // if (filterBy.price) {
    //     cars = cars.filter(car => car.price <= filterBy.price)
    // }
    return board
}

let demoBoard = [
    {
        "id":"b101",
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