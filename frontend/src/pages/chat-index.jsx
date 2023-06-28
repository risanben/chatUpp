
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
import { storageService } from '../services/async-storage.service.js'
import { store } from '../store/store.js'

export function ChatIndex() {
    const user = useSelector(storeState => storeState.userModule.user)
    const board = useSelector(storeState => storeState.boardModule.board)
    const selectedChatId = useSelector(storeState => storeState.boardModule.selectedChatId)
    const [isCredentialMatched, setIsCredentialMatched] = useState(true)
    const [selectedChat, setSelectedChat] = useState(null)
    const [filterBy, setFilterBy] = useState(chatService.getDefaultFilter())
    const [isArchive, setIsArchive] = useState(false)
    let boardChats

    useEffect(() => {
        if (user) loadboard({ user: user, filterBy: filterBy })
    }, [filterBy, user])

    useEffect(() => {
        if (selectedChatId) {
            let chatSelected = board.chats.filter(c => c.id === selectedChatId)[0]
            setSelectedChat(chatSelected)
        } else {
            setSelectedChat(null)
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

    async function onDeleteChat() {
        let boardToSave = boardService.deleteChat(board, selectedChatId)
        const receiver = await chatService.getChatReceiver(selectedChat, user._id)
        const receiverId = receiver._id

        try {
            updateBoard(boardToSave)
            boardService.deleteChatFromUser(receiverId, selectedChatId)
        } catch (err) {
            console.error('unable to save board', err)
        } finally {
            try {
                setSelectedChatId(null)
            } catch (err) {
                console.error('cannot remove selected chat from store', err)
            }
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

    function onSetFilterby({ unRead, txt, archive }) {
        if (archive) {
            if (archive === 'false') {
                setFilterBy((prevFilter) => { return { ...prevFilter, archive } })
            } else {
                setFilterBy((prevFilter) => { return { ...prevFilter, archive } })
            }
         setSelectedChatId(null)
        }
        if (unRead) {
            if (unRead === 'false') {
                setFilterBy((prevFilter) => { return { ...prevFilter, unRead } })
            } else {
                setFilterBy((prevFilter) => { return { ...prevFilter, unRead } })
            }
        }
        if (txt) {
            setFilterBy((prevFilter) => { return { ...prevFilter, txt } })
        }
    }

    async function toggleChatArchive() {

        // saving the userBoard with the archived toggle 
        await chatService.toggleArchive(selectedChatId)

        // managing the board thats in store 
        const chatIdx = board.chats.findIndex(c => c.id === selectedChatId)
        let boardToSave = { ...board }
        boardToSave.chats.splice(chatIdx,1)
        
        setSelectedChatId(null)
        loadboard({ user: user, filterBy: filterBy })
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
                {selectedChat ? <ChatDetails chat={selectedChat} onAddMsg={onAddMsg} userId={user._id} onDeleteChat={onDeleteChat} toggleChatArchive={toggleChatArchive} /> : <Hero />}
            </main>
        </div>
    )
}