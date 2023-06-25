import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdFilterList } from 'react-icons/md'
import { utilService } from '../services/util.service'
import { MdClose } from 'react-icons/md'

export function ChatFilter({ onSetFilterby }) {

    const [userSearch, setUserSearch] = useState('')
    const [isUnreadActive, setIsUnreadActive] = useState(false)

    useEffect(() => {
        onSetFilterby(userSearch)
    }, [userSearch])

    function handleChange(ev) {
        // console.log('ev.target.value:', ev.target.value)
        setUserSearch(ev.target.value)
    }

    function resetFilter() {
        setUserSearch('')
    }

    function onUnread() {
        if (isUnreadActive){
            setIsUnreadActive(false)
            onSetFilterby(false)
        } else{
            setIsUnreadActive(true)
            onSetFilterby(true)
        }
    }


    return (
        <section className="chat-filter flex align-center">
            <section className="input-container flex align-center">
                <AiOutlineSearch className='search-icon pointer' />
                <input type="text" placeholder='Search or start new chat' value={userSearch} onChange={handleChange} />
                {userSearch && <MdClose className='close-icon pointer' onClick={resetFilter} />}
            </section>
            <div className="filter-icon-container">
                <div className={`icon-circle flex ${isUnreadActive}`}>
                    <MdFilterList className="filter-icon pointer" title='Unread chats filter' onClick={onUnread} />
                </div>
            </div>
        </section>
    )
}