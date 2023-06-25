import { useEffect, useState, useRef } from 'react'
import { utilService } from '../services/util.service'

export function MsgPreview({ msg, userId, lastMsg }) {


    function getMsgClass(senderId) {
        return (senderId === userId) ? 'self ' : ''
    }

    if (lastMsg?.id === msg.id) {
        return (
            <section className={`msg-preview flex column ${getMsgClass(msg.sender)}`}  data-msg-id={msg.id}>
                <div className={"msg-txt"}>{msg.content}</div>
                <div className="msg-time">{utilService.getTimeConversion(msg.timestamp)}</div>
            </section>
        )
    }


    return (
        <section className={`msg-preview flex column ${getMsgClass(msg.sender)}`} data-msg-id={msg.id}>
            <div className={"msg-txt"}>{msg.content}</div>
            <div className="msg-time">{utilService.getTimeConversion(msg.timestamp)}</div>
        </section>
    )
}