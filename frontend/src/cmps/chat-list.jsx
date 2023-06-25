import { ChatFilter } from "./chat-filter";
import { ChatListHeader } from "./chat-list-header";
import { ChatPreview } from "./chat-preview";
import { NotFound } from "./not-found";


export function ChatList({ chats, onSelectChat, onLogout, userId, onSetFilterby, selectedChatId }) {

    return (
        <section className="chat-list">
            <ChatListHeader
                onLogout={onLogout}
            />
            <ChatFilter onSetFilterby={onSetFilterby} />
            {chats?.length > 0 ?
                chats.map(chat => <ChatPreview chat={chat} key={chat.id} onSelectChat={onSelectChat} userId={userId} selectedChatId={selectedChatId}/>)
                :
                <NotFound />
            }
        </section>
    )
}