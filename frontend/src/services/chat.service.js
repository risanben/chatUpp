import { boardService } from "./board.service.local"
import { socketService } from "./socket.service"
import { userService } from "./user.service"
// import { updateBoard } from '../store/board.actions'

export const chatService = {
  // getById,
  getChatReceiver,
  updateIsRead,
  getVisiblePreviews,
  getMsgById,
  getDefaultFilter,
  toggleArchive,
  deleteMsg
}

//   async function getById(ChatId) {
//     const user = await storageService.get('user', userId)
//     return user
// }
function getMsgById(msgId, messages) {
  let res = messages.find(m => m.id === msgId)
  return res
}

async function deleteMsg(board, chatId, msgId,isParticipant = false) {
  const updatedBoard = { ...board }
  const updatedChat = updatedBoard.chats.find(c => c.id === chatId)
  const chatIdx = updatedBoard.chats.findIndex(c => c.id === chatId)
  if (updatedChat && chatIdx !== -1) {
    const msgToDeleteIdx = updatedChat.messages.findIndex(m => m.id === msgId)
    if (msgToDeleteIdx !== -1) {
      updatedChat.messages.splice(msgToDeleteIdx, 1)
      updatedBoard.chats[chatIdx] = updatedChat

      await boardService.save(updatedBoard)
      if (isParticipant) socketService.emit('board-updated', updatedBoard)
      return updatedBoard;
    } else {
      console.error('couldnt find message to delete ')
    }
  } else {
    console.error('couldnt not find the chat to remove the msg from')
  }
}

async function toggleArchive(chatId) {
  try {
    let user = await userService.getLoggedinUser()
    let userBoard = await boardService.query(user)
    let chatIdx = userBoard.chats.findIndex(c => c.id === chatId)
    if (chatIdx === -1) return new Error('cannot find chat')

    if (userBoard.chats[chatIdx].isArchived === undefined) {
      userBoard.chats[chatIdx].isArchived = true
    } else {
      userBoard.chats[chatIdx].isArchived = !userBoard.chats[chatIdx].isArchived
    }

    return boardService.save(userBoard)

  } catch (err) {
    return new console.error(' could not toggle chat isArchive');
  }


}

function getDefaultFilter() {
  return {
    txt: '',
    unRead: 'false',
    archive: 'false'
  }
}

// async function getArchivedCount() {
//   const user = userService.getLoggedinUser()
//   const userBoard = await boardService.query(user)
//   return userBoard.chats.reduce((acc, c) => {
//     if (c.isArchived) acc++
//     return acc
//   }, 0)
// }


function getChatReceiver(chat, loggedUserId) {
  let receiver = chat.participants.filter(p => p.userId !== loggedUserId)[0]
  return userService.getById(receiver.userId)
  // const url = otherParticipant[0].imgUrl
}

function updateIsRead(chat) {
  chat.messages.forEach(m => {
    if (!m.isRead) m.isRead = true
  })
  return chat
}

function getVisiblePreviews(scrollRef) {
  const sectionElement = scrollRef.current
  const { scrollTop, clientHeight } = sectionElement
  const sectionBounds = sectionElement.getBoundingClientRect()
  const sectionTop = sectionBounds.top

  // Get all child elements within the section
  const sectionChildren = Array.from(sectionElement.children)

  // Find the topmost element with class "msg-preview" within the visible area
  const topPreviewElement = sectionChildren.find((childElement) => {
    if (!childElement.classList.contains('msg-preview')) {
      return false
    }
    const childBounds = childElement.getBoundingClientRect()
    const childTop = childBounds.top - sectionTop
    const childBottom = childBounds.bottom - sectionTop
    return childTop <= clientHeight && childBottom >= 0
  })

  return topPreviewElement

}