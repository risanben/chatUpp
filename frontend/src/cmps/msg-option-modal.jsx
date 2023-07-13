
export function MsgOptionModal({onDeleteMsg}){



    return(
        <section className="msg-option-modal">
            <div className="optn-container">
                <div className="pointer" onClick={onDeleteMsg}>Delete</div>
            </div>
        </section>
    )
}