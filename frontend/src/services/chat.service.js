import { boardService } from "./board.service.local"
import { userService } from "./user.service"

export const chatService = {
  // getById,
  getChatReceiver,
  updateIsRead,
  getVisiblePreviews,
  getMsgById,
  getDefaultFilter,
  getArchivedCount
}

//   async function getById(ChatId) {
//     const user = await storageService.get('user', userId)
//     return user
// }
function getMsgById(msgId, messages) {
  let res = messages.find(m => m.id === msgId)
  return res
}

function getDefaultFilter() {
  return {
    txt: '',
    unRead: 'false',
    archive: 'false'
  }
}

async function getArchivedCount() {
  const user = userService.getLoggedinUser()
  const userBoard = await boardService.query({ user })
  return userBoard.chats.reduce((acc, c) => {
    if (c.isArchived) acc++
    return acc
  }, 0)
}


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