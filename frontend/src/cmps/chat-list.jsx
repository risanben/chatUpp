import { ChatFilter } from "./chat-filter";
import { ChatListHeader } from "./chat-list-header";
import { ChatPreview } from "./chat-preview";


export function ChatList({chats, setSelectedChat,onLogout}) {

    return (
        <section className="chat-list">
            <ChatListHeader
            onLogout={onLogout}
            />
            <ChatFilter />
            {
                chats.map(chat => <ChatPreview chat={chat} key={chat.id} setSelectedChat={setSelectedChat} />)
            }
        </section>
    )
}