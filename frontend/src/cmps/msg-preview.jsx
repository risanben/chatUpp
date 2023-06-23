import { useEffect, useState, useRef } from 'react'
import { utilService } from '../services/util.service'

export function MsgPreview({ msg, userId, lastMsg }) {

    const [timeEra, setTimeEra] = useState('')
    const lastMsgRef = useRef(null);


    useEffect(() => {
        if (lastMsgRef?.current){
            console.log('found the last:', lastMsgRef.current)
            lastMsgRef.current.focus()}
    }, [lastMsgRef.current])

    function getMsgClass(senderId) {
        return (senderId === userId) ? 'self' : ''
    }

    if (lastMsg?.id === msg.id) {
        return (
            <section ref={lastMsgRef} className={`msg-preview flex column ${getMsgClass(msg.sender)}`}>
                <div className={"msg-txt"}>{msg.content}</div>
                <div className="msg-time">{utilService.getTimeConversion(msg.timestamp)}</div>
            </section>
        )
    }


    return (
        <section className={`msg-preview flex column ${getMsgClass(msg.sender)}`}>
            <div className={"msg-txt"}>{msg.content}</div>
            <div className="msg-time">{utilService.getTimeConversion(msg.timestamp)}</div>
        </section>
    )
}