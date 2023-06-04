
export function MsgPreview({ msg }) {

    function getTimeConversion(timestamp) {
        const date = new Date(1685883214493)
        const hours =  date.getHours()
        const minutes =  date.getMinutes()

        return `${hours}:${minutes}`
    }


    return (
        <section className="msg-preview flex column">
            <div className="msg-txt">{msg.content}</div>
            <div className="msg-time">{getTimeConversion(msg.timestamp)}</div>
        </section>
    )
}