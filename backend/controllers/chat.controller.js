const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel')

const accessChat = asyncHandler(async (req,res) => {
    
    const { userId } = req.body;

    if (!userId) {
        console.log('userId param not sent with request');
        return res.sendStatus(400);
        
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            {users : {$elemMatch : {$eq : req.user._id}}}
        ]
    }).populate("users","-password")
        .populate("latestMessage")
    
    
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select :'name image email'
    })

    if(isChat.length>0){
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users : [req.user._id,userId]
        }

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            )

            res.status(200).send(FullChat);
        } catch (error) {
            res.send(400);
            throw new Error(error.message)
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
   console.log("in fetch chats");
    try {
        Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        }).populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select : "name pic email"
                })
                //console.log(results);
                res.status(200).send(results)
            })


    } catch (error) {
        res.send(error)
    }
   
})
// create new group chat 
const createGroup = asyncHandler(async (req,res) => {
    if (!req.body.users && !req.body.name) {
        return res.status(400).send({ message: 'please fill all the details' });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400)
            .send('more than two members are required to create a group chat');

    }

    users.push(req.user);


    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin : req.user
        })


        const fullGroupChat = await Chat.findOne({
            _id: groupChat._id
        }).populate('users', '-password')
            .populate('groupAdmin', "-password");
        
        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})
// rename group name 
const renameGroup = asyncHandler(async(req,res)=> {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName : chatName
    },
        {
            new: true
        }).populate('users', '-password')
        .populate('groupAdmin', '-password')
    
    if (!updatedChat) {
        res.status(400);
        throw new Error('chat not found');

    } else {
        res.json(updatedChat)
    }
})
// add new membeer to group

const addMember = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push : {users : userId}},{new : true
    }).populate('users', '-password')
        .populate('groupAdmin', '-password')
    
    
    if (!added) {
        res.status(400);
        throw new Error("chat not found")
    } else {
        res.json(added)
    }
})

const removeMember = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    //console.log("in remove member controller",chatId,userId);

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, {
        new: true
    }).populate('users', '-password')
        .populate('groupAdmin', '-password')


    if (!removed) {
        res.status(400);
        throw new Error("chat not found")
    } else {
        res.json(removed)
    }
})


    module.exports = { accessChat, fetchChats, createGroup ,renameGroup,addMember,removeMember}