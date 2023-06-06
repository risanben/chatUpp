

export function UserOptionModal({ pos }) {
    const modalPos = { x: pos.x - 260, y: pos.y + 25 }

    return (
        <div className="user-option-modal flex column" style={{ left: `${modalPos.x}px`, top: `${modalPos.y}px` }}>
           <div className="optn-container pointer">
            Logout
           </div>
           <div className="optn-container pointer">
            Settings
           </div>
        </div>
    )
}