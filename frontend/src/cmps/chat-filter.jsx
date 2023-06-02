import { AiOutlineSearch } from 'react-icons/ai'
import { MdFilterList } from 'react-icons/md'

export function ChatFilter() {


    return (
        <section className="chat-filter flex align-center">
            <section className="input-container flex align-center">
                <AiOutlineSearch className='search-icon pointer' />
                <input type="text" placeholder='Search or start new chat'/>
            </section>
            <MdFilterList className="filter-icon pointer" />
        </section>
    )
}