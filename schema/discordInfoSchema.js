const mongoose = require('mongoose');

const discordInfoSchema = mongoose.Schema({
    accent_color: String,
    avatar: {
        type: String,
        required: true
    },
    avatar_decoration:String,
    banner:String,
    banner_color: String,
    discriminator: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    flags: String,
    id: {
        type: String,
        required: true
    },
    mfa_enabled: Boolean,
    public_flags:String,
    locale:String,
    username: {
        type: String,
        required: true
    },
    
    verified: Boolean,
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = discordInfoSchema;