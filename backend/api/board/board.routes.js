const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
// const { getCars, getCarById, addCar, updateCar, removeCar, addCarMsg, removeCarMsg } = require('./car.controller')
const { getBoardById, getboards, addBoard, updateBoard} = require('./board.controller')
const router = express.Router()

router.get('/',log, getboards)
router.get('/:id', getBoardById)
router.post('/', requireAuth, addBoard)
router.put('/:id', requireAuth, updateBoard)

module.exports = router