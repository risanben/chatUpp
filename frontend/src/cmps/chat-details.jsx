import { useEffect, useState } from "react"
import { MessageList } from "./message-list.jsx"
import { ChatInput } from "./chat-input.jsx"

export function ChatDetails({ chat, onAddMsg }) {


console.log('chat:', chat)
    return (
        <section className="chat-details flex column">
            <div className="chat-header">
                chat - header 
            </div>
            <MessageList
            messages = {chat.messages}
            />
            <ChatInput onAddMsg={onAddMsg}/>
        </section>
    )
}