

export function UserAvatar({ imgUrl, onToggleProfile, dimensions }) {


    return <div className="user-avatar pointer" onClick={onToggleProfile} style={{width:dimensions.width, height:dimensions.height, backgroundImage:`url(${imgUrl})`}}>
        {/* <img src={imgUrl} alt="user-portrait" /> */}
    </div>
}