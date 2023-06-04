import { MsgPreview } from "./msg-preview";

export function MessageList({messages}){

    return (
        <section className="message-list">
            {
                messages.map(msg => <MsgPreview msg={msg} key={msg.id}/>)
            }
        </section>
    )
}