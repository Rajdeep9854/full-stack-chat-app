const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken.js')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('please fill all the details')
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        res.status(400);
        throw new Error('user already exists')
    }

    const user = await User.create({
        name,
        email,
        password,
        image
    })

    if (!user) {
        res.send(400);
        throw new Error('something went wrong : failed to create user')
    } else {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            token : generateToken(user._id),
        })
    }

})


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email });
    //console.log(user.schema.methods.matchPassword());
    //console.log("jkjkjkjk"+user.password);
    if (user &&  ( await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token : generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})


module.exports = {registerUser,authUser}