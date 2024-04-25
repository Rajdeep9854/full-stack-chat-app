const express = require('express');

const router = express.Router();

const { registerUser } = require('../controllers/user.controller.js')
const {authUser} = require('../controllers/user.controller.js')

// Router.post('/', registerUser)
//     .get('/login', loginUser);

router.route('/').post(registerUser);
router.post('/login', authUser)

module.exports = router


