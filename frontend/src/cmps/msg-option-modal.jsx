
export function MsgOptionModal({onDeleteMsg}){



    return(
        <section className="msg-option-modal">
            <div className="optn-container">
                <div onClick={onDeleteMsg}>Delete</div>
            </div>
        </section>
    )
}