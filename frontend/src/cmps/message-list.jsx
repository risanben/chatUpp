import { MsgPreview } from "./msg-preview";

export function MessageList({messages, userId}){

    return (
        <section className="message-list flex column">
            {
                messages.map(msg => <MsgPreview msg={msg} userId={userId} key={msg.id}/>)
            }
        </section>
    )
}