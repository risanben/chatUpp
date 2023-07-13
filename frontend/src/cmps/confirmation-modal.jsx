
export function ConfirmationModal({ onLogout, toggleModal }) {

    return (
        <section className="confirmation-modal flex align-center justify-center" onClick={(ev) => {
            ev.stopPropagation()
            toggleModal(false)
        }}>

            <div className="modal-container flex column ">
                <div className="head">Log out?</div>
                <div>Are you sure you want to log out?</div>
                <div className="options flex">
                    <button onClick={(ev) => {
                        ev.stopPropagation()
                        toggleModal(false)
                    }} className="cancel pointer">Cancel</button>
                    <button onClick={(ev) => {
                        ev.stopPropagation()
                        onLogout()
                    }} className="logout pointer">Logout</button>
                </div>
            </div>
        </section>
    )
}