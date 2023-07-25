const mongoose = require('mongoose');
const wallet = require('./walletSchema');
const discordInfo = require('./discordInfoSchema');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAgree: {
        type: Boolean,
        default: true

    },
    role: {
        type: String,
        default: "User",
        enum: ['User', 'Admin', 'Guest'],
    },
    date: {
        type: Date,
        default: Date.now
    },
    wallet: wallet,
    discordInfo: discordInfo,

});

module.exports = userSchema;