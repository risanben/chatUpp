import { useEffect } from "react"
import { BiArrowBack } from 'react-icons/bi'


export function UserProfile({ currDimensions, toggleUserProfile, user }) {


    return (
        <div className="user-profile flex column" style={{ width: `${currDimensions.width}px`, height: `${currDimensions.height}px` }}>
            <header className="flex align-end">
                <BiArrowBack className="arrow-icon pointer" onClick={() => toggleUserProfile((prev) => !prev)} />
                <section className="head">Profile</section>
            </header>
            <section className="main-user-section flex column align-center">
                <img src={user.imgUrl} alt="userImg" className="user-img"/>
            </section>
        </div>
    )
}