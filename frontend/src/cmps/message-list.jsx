import { useEffect, useRef, useState } from "react"
import { MsgPreview } from "./msg-preview"
import { utilService } from "../services/util.service"
import { chatService } from "../services/chat.service"

export function MessageList({ messages, userId }) {

    const [lastMsg, setLastMsg] = useState(null)
    const [timeEra, setTimeEra] = useState(null)
    let scrollRef = useRef(null)
    let timeEraRef = useRef(null)
    let timeoutId = null


    useEffect(() => {
        setLastMsg(messages[messages.length - 1])
        
        // responsible of scrolling down to bottom
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        addScrollListener()

        return () => {
            removeScrollListener()
        }
    }, [messages.length])


    // responsible of setting time era (without scroll)
    useEffect(() => {
        if (lastMsg) {
            setTimeEra(utilService.getTimeEra(lastMsg.timestamp))
        }
    }, [lastMsg])

    //hides/shows time era 
    useEffect(() => {
        displayTimeEra()

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [timeEra])

    function displayTimeEra() {
        if (timeEra) {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }

            timeEraRef.current.style.opacity = 1

            timeoutId = setTimeout(() => {
                timeEraRef.current.style.opacity = 0
                timeoutId = null
            }, 4000)
        }
    }

    function onScroll() {
        const topMsgEl = chatService.getVisiblePreviews(scrollRef)
        const msgId = extractElData(topMsgEl)
        const msg = chatService.getMsgById(msgId, messages)
        if (msg) {
            setTimeEra(utilService.getTimeEra(msg.timestamp))
        } else {
            console.error('no msg was found')
        }
    }

    function extractElData(element) {
        return element.dataset.msgId
    }

    function addScrollListener() {
        scrollRef.current.addEventListener('scroll', onScroll)
    }


    function removeScrollListener() {
        console.log('removed listener')
        if (scrollRef.current) scrollRef.current.removeEventListener('scroll', onScroll)
    }

    return (
        <section className="message-list flex column" ref={scrollRef}>
            {timeEra && <div className="time-era" ref={timeEraRef}>{timeEra}</div>}
            {
                messages.map(msg => <MsgPreview msg={msg} userId={userId} key={msg.id} lastMsg={lastMsg} />)
            }
        </section>
    )
}