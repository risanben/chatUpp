
export const chatService = {
    getById,
  }

  async function getById(ChatId) {
    const user = await storageService.get('user', userId)
    return user
}
