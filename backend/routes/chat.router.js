
const { protect } = require('../middleware/authMiddleware.js')
const {accessChat,fetchChats} = require('../controllers/chat.controller.js')

const express = require('express')
const router = express.Router();

router.route('/').post(protect, accessChat)
router.route('/').get(protect,fetchChats)



module.exports = router