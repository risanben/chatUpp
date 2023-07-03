const boardService = require('./board.service.js')
const logger = require('../../services/logger.service')
const { log } = require('../../middlewares/logger.middleware.js')

async function getBoardById(req, res) {

  try {
    const userId = req.params.id
    const board = await boardService.getById(userId)
    const filteredBoard = filterBoard(board, req.query)
    res.json(filteredBoard)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

async function getboards(req, res) {
  try {
    logger.debug('Getting Boards')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const boards = await boardService.query(filterBy)
    res.json(boards)
  } catch (err) {
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

function filterBoard(board, filterby) {
  console.log('*****filterby.archive:', filterby.archive)
  let filteredBoard = {...board}
  if (filterby.txt) {
    const searchText = filterby.txt.toLowerCase();
    const regex = new RegExp(searchText, 'i')
    filteredBoard.chats = filteredBoard.chats.filter(chat =>
      chat.messages.some(message =>
        regex.test(message.content)
      )
    )
  }

  if (filterby.unRead === 'true') {
    filteredBoard.chats = filteredBoard.chats.filter(c =>
      c.messages.some(m => !m.isRead))
  }

  if (filterby.archive === 'true') {
    filteredBoard.chats = filteredBoard.chats.filter(c => c.isArchived)
  }
  if (filterby.archive === 'false') {
    filteredBoard.chats = filteredBoard.chats.filter(c => !c.isArchived)
  }

  filteredBoard.chats.sort((chatA, chatB) => {
    const latestTimestampA = chatA.messages[chatA.messages.length - 1].timestamp
    const latestTimestampB = chatB.messages[chatB.messages.length - 1].timestamp
    return latestTimestampB - latestTimestampA
  })

  return filteredBoard
}

async function addBoard(req, res) {

  try {
    const board = req.body
    const addedCar = await boardService.add(board)
    res.json(addedCar)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

async function updateBoard(req, res) {
  try {
    const board = req.body
    const updatedBoard = await boardService.update(board)
    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })
  }
}

module.exports = {
  getBoardById,
  getboards,
  addBoard,
  updateBoard
}
