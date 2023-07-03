import { useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { FaMicrophone } from 'react-icons/fa'

export function ChatInput({onAddMsg}) {

    const [msg, setMsg] = useState('')
    const [ isRecordingMode, setIsRecordingMode] = useState(true)

    function handleChange(ev) {

        setMsg(ev.target.value)
    }

    function onSend(ev){
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
           {!isRecordingMode &&<IoMdSend className='send-icon pointer' onClick={onSend} />}
           {isRecordingMode && <FaMicrophone className='rec-icon pointer'/>}

        </section>
    )
}