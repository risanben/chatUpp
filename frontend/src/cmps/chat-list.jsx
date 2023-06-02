import { ChatFilter } from "./chat-filter";
import { ChatListHeader } from "./chat-list-header";


export function ChatList() {


    return (
        <section className="chat-list">
           <ChatListHeader/>
           <ChatFilter/>
        </section>
    )
}