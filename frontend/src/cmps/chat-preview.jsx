import { UserAvatar } from "./user-avatar";
import { userService } from '../services/user.service'
import { useEffect, useState } from "react";
import { chatService } from "../services/chat.service";
import { utilService } from "../services/util.service";
import { socketService } from "../services/socket.service";



export function ChatPreview({ chat, onSelectChat, userId, selectedChatId }) {

    const [participant, setParticipant] = useState(null)
    const [isUserTyping, setIsUserTyping] = useState(false)


    useEffect(() => {
        setChatDetails()
        socketService.on('user-typing', (data) => {
            handleIsTyping(data)
        })
        socketService.on('user-stopped-typing', (data) => {
            handleIsTyping(data, false)
        })

        return () => {
            socketService.off('user-typing')
            // socketService.off('user-stopped-typing')
        }
    }, [])

    function handleIsTyping(typingUserId, display = true) {
        setParticipant(prevParticipant => {
            if (prevParticipant._id === typingUserId && display) setIsUserTyping(true)
            else if (prevParticipant._id === typingUserId && !display) setIsUserTyping(false)
            return prevParticipant;
        })
    }

    async function setChatDetails() {
        const fetchedParticipant = await chatService.getChatReceiver(chat, userId)
        setParticipant(fetchedParticipant)
    }

    function onImgClick() {
        console.log('img clicked')
    }

    function getIsReadClass(chat) {
        return (chat.messages[chat.messages.length - 1].isRead) ? '' : ' unread'
    }

    function getUnreadMsgCount(chat) {
        return chat.messages.reduce((acc, msg) => {
            if (!msg.isRead) acc++
            return acc
        }, 0)
    }

    function getIsReadClass(chat) {
        return (chat.messages[chat.messages.length - 1].isRead ? '' : ' green')

    }

    return (
        <section onClick={() => onSelectChat(chat)} className={"chat-preview flex pointer" + (selectedChatId === chat.id ? " selected" : "") + getIsReadClass(chat)}>
            <div className="avatar-container flex justify-center align-center">
                {participant && <UserAvatar imgUrl={participant.imgUrl} onClickFn={onImgClick} dimensions={{ height: '60px', width: '60px' }} />}
            </div>
            <div className="border-btm flex justify-center align-center">


                <div className="txt-container flex column">
                    <div className="user-name">
                        {participant && participant.username}
                    </div>
                    {!isUserTyping && <div className="txt-preview">
                        {chat.messages[chat.messages.length - 1].content}
                    </div>}
                    {isUserTyping && <div className="txt-preview">
                        Typing...
                    </div>}
                </div>
                <div className="recent-msg-info flex column ">
                    <div className={`time ${getIsReadClass(chat)}`}>{utilService.getRelativeTime(chat.messages[chat.messages.length - 1].timestamp)}</div>
                    {!!getUnreadMsgCount(chat) && <div className="unread-count-container flex align-center justify-center">
                        {getUnreadMsgCount(chat)}
                    </div>}
                </div>
            </div>

        </section>
    )
}