import { UserAvatar } from "./user-avatar";
import { userService } from '../services/user.service'
import { useEffect, useState } from "react";
import { chatService } from "../services/chat.service";
import { utilService} from "../services/util.service";



export function ChatPreview({ chat, onSelectChat, userId, selectedChatId }) {

    const [participant, setParticipant] = useState(null)
    // const [receiverName, setReceiverName] = useState(null)


    useEffect(() => {
        setChatDetails()
    }, [])

    async function setChatDetails() {
        // // img url for avatar
        // const otherParticipant = chat.participants.filter(p => p.userId !== userId)
        // const url = otherParticipant[0].imgUrl
        // setChatImg(url)

        // // userName for header
        // const username = otherParticipant[0].username
        // setReceiverName(username)

        const participant = await chatService.getChatReceiver(chat, userId)
        setParticipant(participant)
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



    return (
        <section onClick={() => onSelectChat(chat)} className={"chat-preview flex pointer" + (selectedChatId === chat.id ? " selected" : "") + getIsReadClass(chat)}>
            <div className="avatar-container flex justify-center align-center">
                {participant && <UserAvatar imgUrl={participant.imgUrl} onClickFn={onImgClick} dimensions={{ height: '60px', width: '60px' }} />}
            </div>
            <div className="txt-container">
                <div className="user-name">
                    {participant && participant.username}
                </div>
                <div className="txt-preview">
                    {chat.messages[chat.messages.length - 1].content}
                </div>
            </div>
            <div className="recent-msg-info flex column ">
                <div className="time">{utilService.getRelativeTime(chat.messages[chat.messages.length - 1].timestamp)}</div>
                {!!getUnreadMsgCount(chat) && <div className="unread-count-container flex align-center justify-center">
                    {getUnreadMsgCount(chat)}
                </div>}
            </div>

        </section>
    )
}