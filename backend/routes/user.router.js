const express = require('express');

const router = express.Router();

const { registerUser, authUser , allUsers } = require('../controllers/user.controller.js')


// Router.post('/', registerUser)
//     .get('/login', loginUser);

router.route('/').post(registerUser);
router.post('/login', authUser)
router.route('/').get(allUsers)

module.exports = router


