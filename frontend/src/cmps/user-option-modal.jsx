import { useState } from "react"
import { ConfirmationModal } from "./confirmation-modal"


export function UserOptionModal({ pos, onLogout }) {
    const modalPos = { x: pos.x - 260, y: pos.y + 25 }
    const [isConfirmModalOpen, toggleModal] = useState(false)

    return (
        <div className="user-option-modal flex column" style={{ left: `${modalPos.x}px`, top: `${modalPos.y}px` }}>
            <div className="optn-container pointer" onClick={() => { toggleModal(prev => !prev) }}>
                Logout
            </div>
            <div className="optn-container pointer">
                Settings
            </div>
            {isConfirmModalOpen && <ConfirmationModal onLogout={onLogout} toggleModal={toggleModal}/>}
        </div>
    )
}