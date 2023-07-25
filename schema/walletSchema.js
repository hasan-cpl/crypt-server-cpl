const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    accountAddress: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    tokenAddress: {
        type: String,
        required: true
    },
    
});

module.exports = walletSchema;