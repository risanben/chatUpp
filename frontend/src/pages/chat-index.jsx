
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadChats, addCar, updateCar, removeCar, addToCart } from '../store/car.actions.js'
import { login, logout, signup } from '../store/user.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { carService } from '../services/car.service.js'
import { loadboard, setSelectedChatId, updateBoard } from '../store/board.actions.js'
import { ChatList } from '../cmps/chat-list.jsx'
import { Hero } from '../cmps/hero.jsx'
import { ChatDetails } from '../cmps/chat-details.jsx'
import { utilService } from '../services/util.service.js'
import { boardService } from '../services/board.service.local.js'
import { LoginSignup } from '../cmps/login-signup.jsx'
import { chatService } from '../services/chat.service.js'

export function ChatIndex() {
    const user = useSelector(storeState => storeState.userModule.user)
    const board = useSelector(storeState => storeState.boardModule.board)
    const selectedChatId = useSelector(storeState => storeState.boardModule.selectedChatId)
    const [isCredentialMatched, setIsCredentialMatched] = useState(true)
    const [selectedChat, setSelectedChat] = useState(null)
    const [filterBy, setFilterBy] = useState(chatService.getDefaultFilter())

    useEffect(() => {
        if (user) loadboard({ user: user, filterBy: filterBy })
    }, [filterBy, user])

    useEffect(() => {
        if (selectedChatId) {
            let chatSelected = board.chats.filter(c => c.id === selectedChatId)[0]
            setSelectedChat(chatSelected)
        }
    }, [selectedChatId])

    async function onLogin(credentials) {
        try {
            const user = await login(credentials)
            console.log('logged in succesfully')
        } catch (err) {
            setIsCredentialMatched(false)
            console.error('Cannot login')
        }
    }

    async function onAddMsg(msg) {

        let msgToSave = {
            content: msg,
            timestamp: Date.now(),
            sender: user._id,
            id: utilService.makeId(),
            isRead: "true"
        }

        let boardToSave = await boardService.addMsg(board, selectedChat, msgToSave)
        // console.log('boardToSave:', boardToSave)
        try {
            updateBoard(boardToSave)
            boardService.updateParticipantBoard(board, selectedChat, msgToSave)
        } catch (err) {
            console.error('unable to save board', err)
        }
    }

    async function onLogout() {
        try {
            await logout()
            await setSelectedChatId(null)
            console.log('byebye')
        } catch (err) {
            console.error('problem logging out:', err)
        }
    }

    async function onSignup(credentials) {
        try {
            const user = await signup(credentials)
            console.log('user signed up succesfully')
        } catch (err) {
            console.error('user cant sign up', err)
        }
    }

    async function onSelectChat(chat) {
        setSelectedChatId(chat.id)

        if (chat.messages.some(m => !m.isRead)) {
            const chatToSave = chatService.updateIsRead(chat)
            try {
                updateBoard(board)
            } catch (err) {
                console.error('unable to save board', err)
            }
        }
    }

    function onSetFilterby(filters) {
        if (typeof filters === 'boolean') {
            setFilterBy((prevFilter) => { return { ...prevFilter, unread: filters } })
        } else {
            setFilterBy((prevFilter) => { return { ...prevFilter, txt: filters } })
        }
    }


    if (!user) return <LoginSignup onSignup={onSignup} onLogin={onLogin} isCredentialMatched={isCredentialMatched} setIsCredentialMatched={setIsCredentialMatched} />
    if (!board) return 'loading...'

    return (
        <div className='chat-index'>
            <div className='green-background'></div>
            <div className='grey-background'></div>
            <main className='flex'>
                {!!board && <ChatList
                    onSetFilterby={onSetFilterby}
                    chats={board.chats}
                    selectedChatId={selectedChat?.id}
                    onSelectChat={onSelectChat}
                    onLogout={onLogout}
                    userId={user._id}
                />}
                {selectedChat ? <ChatDetails chat={selectedChat} onAddMsg={onAddMsg} userId={user._id} /> : <Hero />}
            </main>
        </div>
    )
}