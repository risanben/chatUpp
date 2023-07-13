
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadChats, addCar, updateCar, removeCar, addToCart } from '../store/car.actions.js'
import { login, logout, signup } from '../store/user.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { carService } from '../services/car.service.js'
import { loadboard, setBoard, setSelectedChatIdx, updateBoard } from '../store/board.actions.js'
import { ChatList } from '../cmps/chat-list.jsx'
import { Hero } from '../cmps/hero.jsx'
import { ChatDetails } from '../cmps/chat-details.jsx'
import { utilService } from '../services/util.service.js'
import { boardService } from '../services/board.service.local.js'
import { LoginSignup } from '../cmps/login-signup.jsx'
import { chatService } from '../services/chat.service.js'
import { socketService } from '../services/socket.service.js'
import { storageService } from '../services/async-storage.service.js'
import { store } from '../store/store.js'
import { Loader } from './loader.jsx'

export function ChatIndex() {
    const user = useSelector(storeState => storeState.userModule.user)
    const board = useSelector(storeState => storeState.boardModule.board)
    const selectedChatIdx = useSelector(storeState => storeState.boardModule.selectedChatIdx)
    const [isCredentialMatched, setIsCredentialMatched] = useState(true)
    const [filterBy, setFilterBy] = useState(chatService.getDefaultFilter())
    const [isArchive, setIsArchive] = useState(false)



    useEffect(() => {
        if (user) {
            loadboard(user)
            socketService.on('board-updated', (newBoard) => {
                setBoard(newBoard)
            })
        }

        return ()=>{
            socketService.off('board-updated')
        }
    }, [user])

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

        let boardToSave = await boardService.addMsg(board, board.chats[selectedChatIdx], msgToSave)
        const participant = await chatService.getChatReceiver(board.chats[selectedChatIdx], user._id)
        const participantBoard = await boardService.query(participant)
        await boardService.addMsg(participantBoard, board.chats[selectedChatIdx], msgToSave, false)

        try {
            setBoard(boardToSave)
        } catch (err) {
            console.error('unable to save board', err)
        }
    }

    async function onDeleteChat() {
        let boardToSave = boardService.deleteChat(board, board.chats[selectedChatIdx].id)
        const receiver = await chatService.getChatReceiver(board.chats[selectedChatIdx], user._id)
        const receiverId = receiver._id

        try {
            updateBoard(boardToSave)
            boardService.deleteChatFromUser(receiverId, board.chats[selectedChatIdx].id)
        } catch (err) {
            console.error('unable to save board', err)
        } finally {
            try {
                setSelectedChatIdx(null)
            } catch (err) {
                console.error('cannot remove selected chat from store', err)
            }
        }
    }

    async function onLogout() {
        try {
            await logout()
            await setSelectedChatIdx(null)
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
        const selectedChatIdx = board.chats.findIndex(c => c.id === chat.id)
        if (selectedChatIdx !== -1) {
            setSelectedChatIdx(selectedChatIdx)
        } else {
            console.error(`cannot find specific chat with id ${chat.id}`)
        }

        readAll(chat)
    }

    async function readAll(chat){
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
            setSelectedChatIdx(null)
            return
        }
        if (unRead) {
            if (unRead === 'false') {
                setFilterBy((prevFilter) => { return { ...prevFilter, unRead } })
            } else {
                setFilterBy((prevFilter) => { return { ...prevFilter, unRead } })
            }
            return
        }

        setFilterBy((prevFilter) => { return { ...prevFilter, txt } })
    }

    async function toggleChatArchive() {
        await chatService.toggleArchive(board.chats[selectedChatIdx].id)
        setSelectedChatIdx(null)
        loadboard(user)
    }

    async function onRemoveMsg(msgId) {
        const boardToSave = await chatService.deleteMsg(board, board.chats[selectedChatIdx].id, msgId)
        const participant = await chatService.getChatReceiver(board.chats[selectedChatIdx], user._id)
        const participantBoard = await boardService.query(participant)
        await chatService.deleteMsg(participantBoard, board.chats[selectedChatIdx].id, msgId, true)
        try {
            setBoard(boardToSave)
        } catch (err) {
            console.error('unable to save board', err)
        }
    }



    if (!user) return <LoginSignup onSignup={onSignup} onLogin={onLogin} isCredentialMatched={isCredentialMatched} setIsCredentialMatched={setIsCredentialMatched} />
    if (!board) return <Loader />

    return (
        <div className='chat-index'>
            <div className='green-background'></div>
            <div className='grey-background'></div>
            <main className='flex'>
                {!!board && <ChatList
                    filterBy={filterBy}
                    onSetFilterby={onSetFilterby}
                    chats={board.chats}
                    selectedChatId={board.chats[selectedChatIdx]?.id}
                    onSelectChat={onSelectChat}
                    onLogout={onLogout}
                    userId={user._id}
                />}
                {selectedChatIdx !== null ? <ChatDetails readAll={readAll} chat={board.chats[selectedChatIdx]} onAddMsg={onAddMsg} userId={user._id} onDeleteChat={onDeleteChat} toggleChatArchive={toggleChatArchive} onRemoveMsg={onRemoveMsg} /> : <Hero />}
            </main>
        </div>
    )
}