
export function ChatOption({onDeleteChat}){

    return (
        <section className="chat-option">
            <div className="option flex align-center pointer">Contact info</div>
            <div className="option flex align-center pointer" onClick={onDeleteChat}>Delete this chat</div>
            <div className="option flex align-center pointer">Clear messages</div>
        </section>
    )
}