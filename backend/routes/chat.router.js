
const { protect } = require('../middleware/authMiddleware.js')
const { accessChat
    ,fetchChats
    , createGroup,
    renameGroup} = require('../controllers/chat.controller.js')

const express = require('express')
const router = express.Router();

router.route('/').post(protect, accessChat)
router.route('/').get(protect,fetchChats)
router.route('/group').post(protect, createGroup)
router.route('/group/rename').put(protect,renameGroup)


module.exports = router