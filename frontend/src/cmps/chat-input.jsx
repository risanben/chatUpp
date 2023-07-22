import { useEffect, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { FaMicrophone } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi'
import { socketService } from '../services/socket.service'
import { useRef } from 'react'
import { Recording } from './recording'

export function ChatInput({ onAddMsg, userId, participant }) {

    const [msg, setMsg] = useState('')
    const [isRecordingMode, setIsRecordingMode] = useState(true)
    const [isDisplayRec, displayRec] = useState(false)
    const timeoutId = useRef(null)

    useEffect(() => {
        if (!msg) setIsRecordingMode(true)

        // return () => {
        //     clearTimeout(timeoutId.current)
        // }

    }, [msg])

    function handleChange(ev) {
        setMsg(ev.target.value)
        if (ev.target.value) setIsRecordingMode(false)

        if (!timeoutId.current) socketService.emit('user-typing', { from: userId, to: participant._id })
        if (timeoutId.current) clearTimeout(timeoutId.current)
        timeoutId.current = setTimeout(() => {
            socketService.emit('user-stopped-typing', { from: userId, to: participant._id })
            timeoutId.current = null
        }, 2000)
    }


    function onSend(ev) {
        if (ev) ev.preventDefault()
        else console.error('no event was fired to onSend')
        onAddMsg(msg)
        setMsg('')
    }

    function onRecord() {
        displayRec(true)
    }

    return (
        <section className="chat-input flex align-center">
            <div className="buttons-container">
                <button className='flex justify-center align-center'>
                    <HiPlus className='plus-icon pointer' />
                </button>
            </div>
            <form onSubmit={onSend} className='flex'>
                {!isDisplayRec && <input type="text" className="chat-input" onInput={handleChange} value={msg} />}
                {isDisplayRec && <Recording/>}
            </form>
            {!isRecordingMode && <IoMdSend className='send-icon pointer' onClick={onSend} />}
            {isRecordingMode && <FaMicrophone className='rec-icon pointer' onClick={onRecord} />}

        </section>
    )
}