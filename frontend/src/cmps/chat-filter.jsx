import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdFilterList } from 'react-icons/md'
import { utilService } from '../services/util.service'
import { MdClose } from 'react-icons/md'

export function ChatFilter({ setFilterBy }) {

    const [userSearch, setUserSearch] = useState('')

    useEffect(() => {
        setFilterBy(userSearch)
    }, [userSearch])

    function handleChange(ev) {
        // console.log('ev.target.value:', ev.target.value)
        setUserSearch(ev.target.value)
    }

    function resetFilter() {
        setUserSearch('')
    }

    return (
        <section className="chat-filter flex align-center">
            <section className="input-container flex align-center">
                <AiOutlineSearch className='search-icon pointer' />
                <input type="text" placeholder='Search or start new chat' value={userSearch} onChange={handleChange} />
                {userSearch && <MdClose className='close-icon pointer' onClick={resetFilter} />}
            </section>
            <MdFilterList className="filter-icon pointer" />
        </section>
    )
}