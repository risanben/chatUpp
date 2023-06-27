import { useEffect, useState } from "react"
import { MessageList } from "./message-list.jsx"
import { ChatInput } from "./chat-input.jsx"
import { UserAvatar } from "./user-avatar.jsx"
import { chatService } from "../services/chat.service.js"
import { AiOutlineSearch } from 'react-icons/ai'
import { BiDotsVerticalRounded } from "react-icons/bi"
import { ChatOption } from "./chat-options.jsx"


export function ChatDetails({ chat, onAddMsg, userId , onDeleteChat}) {

    const [participant, setParticipant] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        loadParticipant()
    }, [chat])

    async function loadParticipant() {
        const participant = await chatService.getChatReceiver(chat, userId)
        setParticipant(participant)
    }

    function toggleOption() {
        setIsOpen((prev) => !prev)
    }


    return (
        <section className="chat-details flex column">
            <div className="chat-header flex align-center">
                {participant && <UserAvatar imgUrl={participant.imgUrl} dimensions={{ height: '55px', width: '55px' }} />}
                {participant && <div className="parti-container">{participant.username}</div>}
                <div className="header-actions flex align-center">
                    <AiOutlineSearch className="search-icon pointer" />
                    <div className={`option-con flex align-center ${isOpen}`} onClick={toggleOption}>
                        <BiDotsVerticalRounded className="option-icon pointer" />
                    </div>
                    {isOpen && <ChatOption onDeleteChat={onDeleteChat}/>}
                </div>
            </div>

            <MessageList
                messages={chat.messages}
                userId={userId}
            />

            <ChatInput onAddMsg={onAddMsg} />
        </section>
    )
}