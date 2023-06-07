

export function UserOptionModal({ pos, onLogout }) {
    const modalPos = { x: pos.x - 260, y: pos.y + 25 }

    return (
        <div className="user-option-modal flex column" style={{ left: `${modalPos.x}px`, top: `${modalPos.y}px` }}>
           <div className="optn-container pointer" onClick={onLogout}>
            Logout
           </div>
           <div className="optn-container pointer">
            Settings
           </div>
        </div>
    )
}