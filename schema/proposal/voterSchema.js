const mongoose = require('mongoose');

const voterSchema = mongoose.Schema({
    address: String,
    username: String,
    voterName: String,
    voteType: String,
    votedAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = voterSchema;