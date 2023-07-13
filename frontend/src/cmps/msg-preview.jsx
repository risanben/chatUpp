import { useEffect, useState, useRef } from 'react'
import { utilService } from '../services/util.service'
import { IoIosArrowDown } from 'react-icons/io'
import { MsgOptionModal } from './msg-option-modal'

export function MsgPreview({ msg, userId, lastMsg, onRemoveMsg }) {

    const [isModalOpen, toggleMODAL] = useState(false)

    function toggleModal(ev) {
        if (ev) ev.stopPropagation()
        toggleMODAL(prev => !prev)
    }

    function onDeleteMsg() {
        onRemoveMsg(msg.id)
    }

    function getMsgClass(senderId) {
        return (senderId === userId) ? 'self ' : ''
    }

    if (lastMsg?.id === msg.id) {
        return (
            <section className={`msg-preview flex column ${getMsgClass(msg.sender)}`} data-msg-id={msg.id}>
                <div className="msg-optn-container flex align-center justify-center pointer" onClick={toggleModal}><IoIosArrowDown className='down-arrow' /></div>
                <div className={"msg-txt"}>{msg.content}</div>
                <div className="msg-time">{utilService.getTimeConversion(msg.timestamp)}</div>
                {isModalOpen && <MsgOptionModal onDeleteMsg={onDeleteMsg} />}
            </section>
        )
    }


    return (
        <section className={`msg-preview flex column ${getMsgClass(msg.sender)}`} data-msg-id={msg.id}>
            <div className="msg-optn-container flex align-center justify-center pointer" onClick={toggleModal}><IoIosArrowDown className='down-arrow' /></div>
            <div className={"msg-txt"}>{msg.content}</div>
            <div className="msg-time">{utilService.getTimeConversion(msg.timestamp)}</div>
            {isModalOpen && <MsgOptionModal onDeleteMsg={onDeleteMsg} />}
        </section>
    )
}