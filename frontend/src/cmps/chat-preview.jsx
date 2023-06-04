

export function ChatPreview({ chat, setSelectedChat }) {
    return (
        <section onClick={()=>setSelectedChat(chat)} className="chat-preview flex pointer">
            <div className="avatar-container">
                avater
            </div>
            <div className="txt-container">
                <div className="user-name">
                    {chat.participants[0]}
                </div>
                <div className="txt-preview">
                    {chat.messages[0].content}
                </div>
            </div>
        </section>
    )
}