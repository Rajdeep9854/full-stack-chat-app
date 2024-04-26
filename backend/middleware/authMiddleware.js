const jwt = require("jsonwebtoken")
const User = require('../models/userModel.js')
const asyncHandler = require('express-async-handler');


const protect = asyncHandler(async (req,res,next) => {
    //console.log("in protect");
    let token;
    
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        
        
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(token);
            // console.log(decoded);
            // console.log(req.user);

            req.user = await User.findById(decoded.id).select("-password");
            //console.log(req.user);
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
        }
        if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
        }
})

module.exports = {protect}