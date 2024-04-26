
const { protect } = require('../middleware/authMiddleware.js')
const {accessChat} = require('../controllers/chat.controller.js')

const express = require('express')
const router = express.Router();

router.route('/').post(protect, accessChat)




module.exports = router