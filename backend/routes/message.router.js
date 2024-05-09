const { protect } = require('../middleware/authMiddleware.js');
const {sendMessage} = require('../controllers/message.controller.js')
const { allMessages } = require('../controllers/message.controller.js')

const express = require('express');

const router = express.Router();


router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

module.exports = router