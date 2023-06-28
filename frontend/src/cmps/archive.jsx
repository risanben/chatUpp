import { useEffect, useState } from 'react'
import { MdOutlineArchive } from 'react-icons/md'
import { chatService } from '../services/chat.service'

export function Archive({ onSetFilterby, chats }) {
    const [isArchive, setIsArchive] = useState(false)
    const [archiveCount, setArchiveCount] = useState(0)

    useEffect(() => {
        getArchiveCount()
    }, [chats, chats.length])

    function toggleArchive() {
        if (!isArchive) {
            setIsArchive(true)
            onSetFilterby({ archive: 'true' })
        } else {
            setIsArchive(false)
            onSetFilterby({ archive: 'false' })
        }
    }

    async function getArchiveCount() {
        const count = await chatService.getArchivedCount()
        setArchiveCount(count)
    }

    return (
        <section className="archive flex pointer" onClick={toggleArchive}>
            <div className="archive-icon-container flex align-center justify-center">
                <div className={`circle flex align-center justify-center  ${isArchive}`}>
                    <MdOutlineArchive />
                </div>
            </div>
            <div className="container flex align-center">
                <div className='title'>
                    Archived
                </div>
                <div className='number'>
                    {archiveCount}
                </div>
            </div>
        </section>
    )
}