const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware.js')
const { registerUser, authUser , allUsers } = require('../controllers/user.controller.js')


// Router.post('/', registerUser)
//     .get('/login', loginUser);
//console.log(typeof protect);
router.route('/').get(protect,allUsers)
router.route('/').post(registerUser)
router.post('/login', authUser)


module.exports = router


