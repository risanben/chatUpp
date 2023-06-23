
export const chatService = {
    // getById,
    getChatReceiver,
    updateIsRead
  }

//   async function getById(ChatId) {
//     const user = await storageService.get('user', userId)
//     return user
// }

function getChatReceiver(chat,loggedUserId){
  return chat.participants.filter(p => p.userId !== loggedUserId)[0]
  // const url = otherParticipant[0].imgUrl
}

function updateIsRead(chat){
  chat.messages.forEach(m=>{
    if (!m.isRead) m.isRead = true
  })
  return chat 
}