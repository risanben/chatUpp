
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadChats, addCar, updateCar, removeCar, addToCart } from '../store/car.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { carService } from '../services/car.service.js'
import { loadboard, updateBoard } from '../store/board.actions.js'
import { ChatList } from '../cmps/chat-list.jsx'
import { Hero } from '../cmps/hero.jsx'
import { ChatDetails } from '../cmps/chat-details.jsx'
import { utilService } from '../services/util.service.js'
import { boardService } from '../services/board.service.local.js'

export function ChatIndex() {

    const board = useSelector(storeState => storeState.carModule.board)
    const [selectedChat, setSelectedChat] = useState(null)

    useEffect(() => {
        loadboard('u101')
    }, [])
    
    async function onAddMsg(msg) {
        let msgToSave = {
            content: msg,
            timestamp: Date.now(),
            sender: 'guest',
            id: utilService.makeId()
        }

        let boardToSave = { ...board }
        let chatToSave = boardToSave.chats.find(chat => chat.id === selectedChat.id)
        chatToSave.messages.push(msgToSave)
        try {
            const savedBoard = updateBoard(boardToSave)
        } catch (err) {
            console.error('unable to save board', err)
        }
    }



    if (!board) return 'loading...'
    return (
        <div className='chat-index'>
            <div className='green-background'></div>
            <div className='grey-background'></div>
            <main className='flex'>
                {!!board.chats?.length && <ChatList
                    chats={board.chats}
                    setSelectedChat={setSelectedChat}
                />}
                {selectedChat ? <ChatDetails chat={selectedChat} onAddMsg={onAddMsg} /> : <Hero />}
            </main>
        </div>
    )
}