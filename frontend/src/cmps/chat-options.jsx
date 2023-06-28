import { useState } from "react"
import { chatService } from "../services/chat.service"

export function ChatOption({onDeleteChat, chat, toggleArchive}){


    return (
        <section className="chat-option">
            <div className="option flex align-center pointer">Contact info</div>
            <div className="option flex align-center pointer" onClick={onDeleteChat}>Delete this chat</div>
            <div className="option flex align-center pointer">Clear messages</div>
            <div className="option flex align-center pointer" onClick={toggleArchive}>{chat.isArchived?'Unarchive this chat':'Archive this chat'}</div>
        </section>
    )
}