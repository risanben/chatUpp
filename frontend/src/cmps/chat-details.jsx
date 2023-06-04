import { useEffect, useState } from "react"
import { MessageList } from "./message-list.jsx"

export function ChatDetails({ chat }) {


console.log('chat:', chat)
    return (
        <section className="chat-details">
            <div className="chat-header">
                chat - header 
            </div>
            <MessageList
            messages = {chat.messages}
            />
        </section>
    )
}