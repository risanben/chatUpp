

export function UserAvatar({ imgUrl, onClickFn, dimensions }) {


    return <div className="user-avatar pointer" onClick={onClickFn} style={{width:dimensions.width, height:dimensions.height, backgroundImage:`url(${imgUrl})`}}>
        {/* <img src={imgUrl} alt="user-portrait" /> */}
    </div>
}