import { useEffect, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { FaMicrophone } from 'react-icons/fa'
import { socketService } from '../services/socket.service'
import { useRef } from 'react'

export function ChatInput({ onAddMsg, userId, participant }) {

    const [msg, setMsg] = useState('')
    const [isRecordingMode, setIsRecordingMode] = useState(true)
    const timeoutId = useRef(null)

    useEffect(() => {
        if (!msg) setIsRecordingMode(false)

        // return () => {
        //     clearTimeout(timeoutId.current)
        // }

    }, [msg])

    function handleChange(ev) {
        setMsg(ev.target.value)

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

    return (
        <section className="chat-input flex align-center">
            <div className="buttons-container">
                <button>button1</button>
                <button>button2</button>
            </div>
            <form onSubmit={onSend}>
                <input type="text" className="chat-input" onInput={handleChange} value={msg} />
            </form>
            {!isRecordingMode && <IoMdSend className='send-icon pointer' onClick={onSend} />}
            {isRecordingMode && <FaMicrophone className='rec-icon pointer' />}

        </section>
    )
}