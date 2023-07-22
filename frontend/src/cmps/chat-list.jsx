import { useEffect, useState } from "react";
import { Archive } from "./archive";
import { ChatFilter } from "./chat-filter";
import { ChatListHeader } from "./chat-list-header";
import { ChatPreview } from "./chat-preview";
import { NotFound } from "./not-found";


export function ChatList({ chats, onSelectChat, onLogout, userId, onSetFilterby, selectedChatId, filterBy }) {
    const [chatsToDisplay, setChats] = useState([])

    useEffect(() => {
        setChatsToDisplay()
    }, [filterBy, chats])

    function setChatsToDisplay() {
        // debugger
        let filteredChats = [...chats]

        if (filterBy.txt) {
            const searchText = filterBy.txt.toLowerCase();
            filteredChats = filteredChats.filter(chat => {
                const messageContentRegex = new RegExp(searchText, 'i')
                const hasMatchingMessage = chat.messages.some(message => messageContentRegex.test(message.content))

                const participantUsernameRegex = new RegExp(searchText, 'i')
                const hasMatchingParticipant = chat.participants.some(participant => participantUsernameRegex.test(participant.username))

                return hasMatchingMessage || hasMatchingParticipant
            })
        }

        if (filterBy.unRead === 'true') {
            filteredChats = filteredChats.filter(c =>
                c.messages.some(m => !m.isRead))
        }

        if (filterBy.archive === 'true') {
            filteredChats = filteredChats.filter(c => c.isArchived)
        }
        if (filterBy.archive === 'false') {
            filteredChats = filteredChats.filter(c => !c.isArchived)
        }

        setChats(filteredChats)
    }

    return (
        <section className="chat-list">
            <ChatListHeader
                onLogout={onLogout}
            />
            <ChatFilter onSetFilterby={onSetFilterby} />
            <Archive onSetFilterby={onSetFilterby} chats={chats} />
            {chatsToDisplay?.length > 0 ?
                chatsToDisplay.map(chat => <ChatPreview chat={chat} key={chat.id} onSelectChat={onSelectChat} userId={userId} selectedChatId={selectedChatId} />)
                :
                <NotFound />
            }
        </section>
    )
}