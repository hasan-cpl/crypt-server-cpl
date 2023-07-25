const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require("../schema/userSchema");

require('dotenv').config();
const router = express.Router();
const web3 = new Web3('https://sepolia.infura.io/v3/81f3882a93c44d1381517241c631230d');



// Creating Model for object mapping
const User = new mongoose.model("User", userSchema);

router.get("/hello", async (req, res) => {

    res.json("Hello Hasan");

});

// SIGNUP

router.post("/signup", async (req, res) => {

    //console.log(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        const wallet = await getWallet();
        console.log("wallet: ", wallet);
        let newUser;
        if (wallet != null) {
            newUser = new User({
                name: req.body.name,
                username: req.body.username,
                password: hashedPassword,
                status: req.body.status,
                date: req.body.date,
                wallet: wallet
            });
        }
        const user = await newUser.save();
        res.json({
            code: 201,
            "data": user,
            "message": "Signup Successful"
        });
    } catch (error) {
        res.json({
            code: 400,
            "data": error,
            "message": "Signup failed!"
        });
    }
});

const getWallet = async () => {
    let createAccount = await web3.eth.accounts.create(web3.utils.randomHex(32));

    let tokenAddress = process.env.TOKEN_ADDRESS;
    let fromAddress = process.env.FROM_ADDRESS;
    const privateKey = process.env.FROM_ADDRESS_PRIVATE_KEY;


    let toAddress = createAccount.address;
    let wallet = null;

    let contractABI = [
        // transfer
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "type": "function"
        }
    ];

    let contract = new web3.eth.Contract(contractABI, tokenAddress, { from: fromAddress })
    let amount = web3.utils.toHex(web3.utils.toWei("10")); //10 DEMO Token
    let data = contract.methods.transfer(toAddress, amount).encodeABI();

    let txObj = {
        gas: web3.utils.toHex(100000),
        "to": tokenAddress,
        "value": "0x00",
        "data": data,
        "from": fromAddress

    };

    try {
        const signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
        const sendSignedTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);


        if (sendSignedTx) {
            wallet = {
                accountAddress: toAddress,
                privateKey: createAccount.privateKey,
                tokenAddress: tokenAddress
            }
        }
    } catch (error) {
        console.log(error);
    }

    return wallet;

}

// LOGIN

router.post("/signin", async (req, res) => {

    try {
        // at first find user by username
        const user = await User.findOne({ username: req.body.username });

        if (user) {
            // check password is valid or not
            const isValid = await bcrypt.compare(req.body.password, user.password);
            if (isValid) {
                // generate token *** jwt(payload, secret, options)
                const token = jwt.sign({
                    id: user._id,
                    username: user.username,
                    role: user.role
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    });

                res.status(200).json({
                    "access_token": token,
                    "user_id": user._id,
                    "username": user.username,
                    "message": "Login Successful"
                })


            } else {
                res.status(401).json({
                    "error": "Authentication failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authentication failed!"
            });
        }

    } catch (error) {
        res.json(error);
    }
});

// GET USER BY ID
router.get("/user/:id", async (req, res) => {

    const id = req.params.id;
    //console.log(id);
    try {
        const user = await User.findOne({ _id: id });
        res.json(user);

    } catch (err) {
        res.json(err);
    }
});

// GET ALL USER

router.get('/users', async (req, res) => {

    let page = req.query.page ? parseInt(req.query.page) : 0;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;


    if (page > 0) {
        page = page - 1;
    }

    try {
        //console.log(pageSize, page);
        const totalPosts = await User.countDocuments().exec();
        const userList = await User.find({})
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ date: -1 });
        res.json({ 'total': totalPosts, data: userList });
    } catch (error) {
        res.json(error);
    }
});

// GET ALL DISCORD USER
router.get('/discord-user', async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 0;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;


    if (page > 0) {
        page = page - 1;
    }

    try {
        //console.log(pageSize, page);
        const totalPosts = await User.countDocuments({
            discordInfo: { $ne: null }
        }).exec();

        const userList = await User.find({
            discordInfo: { $ne: null }
        })
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ date: -1 });
        res.json({ 'total': totalPosts, data: userList });
    } catch (error) {
        res.json(error);
    }
});



// update by id (discord Information)
router.put('/discord-info/:id', async (req, res) => {
    const id = req.params.id;
    //console.log(id);

    const discordInfo = req.body;
    console.log(discordInfo);
    try {
        const result = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                "$set": {
                    discordInfo: discordInfo
                }
            },
            { new: true },

        );

        console.log(result);

        res.json(result);

    } catch (error) {
        console.log(error);
    }

});

module.exports = router;