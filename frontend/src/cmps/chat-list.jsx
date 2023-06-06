import { ChatFilter } from "./chat-filter";
import { ChatListHeader } from "./chat-list-header";
import { ChatPreview } from "./chat-preview";


export function ChatList({chats, setSelectedChat}) {

    return (
        <section className="chat-list">
            <ChatListHeader />
            <ChatFilter />
            {
                chats.map(chat => <ChatPreview chat={chat} key={chat.id} setSelectedChat={setSelectedChat} />)
            }
        </section>
    )
}