import { useEffect, useState } from "react";
import { MsgPreview } from "./msg-preview";

export function MessageList({ messages, userId }) {

    const [lastMsg, setLastMsg] = useState(null)


    useEffect(() => {
        setLastMsg(messages[messages.length - 1])
    }, [messages])

    return (
        <section className="message-list flex column">
            <div className="time-era">time</div>
            {
                messages.map(msg => <MsgPreview msg={msg} userId={userId} key={msg.id} lastMsg={lastMsg} />)
            }
        </section>
    )
}