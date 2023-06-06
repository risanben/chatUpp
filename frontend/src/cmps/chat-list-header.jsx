import { UserAvatar } from "./user-avatar";
import image from '../assets/img/user-portrait.jpg'
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useEffect, useState } from 'react'
import { UserOptionModal } from "./user-option-modal";


export function ChatListHeader() {

    const [isUserModalOpen, setIsUserModalOpen] = useState(true)
    const [btnPos, setBtnPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setIsUserModalOpen((prev) => !prev)
    }, [btnPos])

    function toggleModal(ev) {
        const parentLoc = ev.target.parentNode.getBoundingClientRect()
        setBtnPos({ x: parentLoc.x, y: parentLoc.y })
    }

    return (
        <section className="chat-list-header flex align-center">
            <UserAvatar imgUrl={image} />
            <div className="user-btns-container pointer" onClick={toggleModal}>
                <BiDotsVerticalRounded />
            </div>
            {isUserModalOpen && <UserOptionModal pos={btnPos}/>}


        </section>
    )
}