
export function MsgPreview({ msg, userId }) {

    function getTimeConversion(timestamp) {
        const date = new Date(1685883214493)
        const hours = date.getHours()
        const minutes = date.getMinutes()

        return `${hours}:${minutes}`
    }

    function getMsgClass(senderId) {
        return (senderId === userId) ? 'self' : ''
    }


    return (
        <section className={`msg-preview flex column ${getMsgClass(msg.sender)}`}>
            <div className={"msg-txt"}>{msg.content}</div>
            <div className="msg-time">{getTimeConversion(msg.timestamp)}</div>
        </section>
    )
}