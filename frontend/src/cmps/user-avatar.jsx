

export function UserAvatar({imgUrl, onToggleProfile}){

    return <div className="user-avatar pointer" onClick={onToggleProfile}>
        <img src={imgUrl} alt="user-portrait" />
    </div>
}