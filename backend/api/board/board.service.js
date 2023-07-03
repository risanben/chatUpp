const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ userId:userId })
        return board
    } catch (err) {
        logger.error(`while finding car ${boardId}`, err)
        throw err
    }
}



async function query(filterBy={txt:''}) {
    try {
        const criteria = {
            userId: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('board')
        console.log('**********collection:', collection)
        var boards = await collection.find(criteria).toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = {...board }
        delete boardToSave._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: ObjectId(board._id) }, { $set: boardToSave })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

module.exports = {
    getById,
    query,
    add,
    update
}
