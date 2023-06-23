import { useEffect, useState } from "react"
import { MessageList } from "./message-list.jsx"
import { ChatInput } from "./chat-input.jsx"
import { UserAvatar } from "./user-avatar.jsx"
import { chatService } from "../services/chat.service.js"

export function ChatDetails({ chat, onAddMsg, userId }) {

    const [participant, setParticipant] = useState(null)
    useEffect(() => {
        loadParticipant()
    }, [chat])

    async function loadParticipant() {
        const participant = await chatService.getChatReceiver(chat, userId)
        setParticipant(participant)
    }

    return (
        <section className="chat-details flex column">
            <div className="chat-header flex align-center">
                {participant && <UserAvatar imgUrl={participant.imgUrl} dimensions={{height:'55px', width:'55px'}}/>  }
                {participant && <div className="parti-container">{participant.username}</div>}
            </div>

            <MessageList
                messages={chat.messages}
                userId={userId}
            />
            
            <ChatInput onAddMsg={onAddMsg} />
        </section>
    )
}