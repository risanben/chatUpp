import { UserAvatar } from "./user-avatar";
import image from '../assets/img/user-portrait.jpg'
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useEffect, useState } from 'react'
import { UserOptionModal } from "./user-option-modal";
import { useSelector } from 'react-redux'
import { UserProfile } from "./user-profile";

export function ChatListHeader({ onLogout }) {

    const [isUserModalOpen, setIsUserModalOpen] = useState(true)
    const [btnPos, setBtnPos] = useState({ x: 0, y: 0 })
    const [isProfileOpen, toggleUserProfile] = useState(false)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const [currDimensions, setDimensions] = useState({width:0,height:0})

    useEffect(() => {
        setIsUserModalOpen((prev) => !prev)
    }, [btnPos])

    function toggleModal(ev) {
        const parentLoc = ev.target.parentNode.getBoundingClientRect()
        setBtnPos({ x: parentLoc.x, y: parentLoc.y })
    }

    function onToggleProfile(ev) {
        const width = ev.target.parentNode.parentNode.getBoundingClientRect().width
        const height = ev.target.parentNode.parentNode.parentNode.getBoundingClientRect().height
        setDimensions({width,height})
        toggleUserProfile((prev) => !prev)
    }

    function getProfileStatus() {
        return isProfileOpen ? 'open' : ''
    }

    return (
        <section className="chat-list-header flex align-center">
            <UserAvatar imgUrl={loggedInUser.imgUrl} onToggleProfile={onToggleProfile} />
            <div className="user-btns-container pointer" onClick={toggleModal}>
                <BiDotsVerticalRounded />
            </div>
            {isUserModalOpen && <UserOptionModal pos={btnPos} onLogout={onLogout} />}

            <section className={`profile-container ${getProfileStatus()}`}>
                <UserProfile currDimensions={currDimensions} toggleUserProfile={toggleUserProfile} user={loggedInUser}/>
            </section>

        </section>
    )
}