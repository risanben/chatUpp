import { useEffect, useState } from "react"
import { MessageList } from "./message-list.jsx"
import { ChatInput } from "./chat-input.jsx"

export function ChatDetails({ chat, onAddMsg, userId }) {


console.log('chat:', chat)
    return (
        <section className="chat-details flex column">
            <div className="chat-header">
                chat - header 
            </div>
            <MessageList
            messages = {chat.messages}
            userId={userId}
            />
            <ChatInput onAddMsg={onAddMsg}/>
        </section>
    )
}