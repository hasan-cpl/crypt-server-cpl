const mongoose = require('mongoose');

const tokenDisburseSchema = mongoose.Schema({

    startTime: Number,
    endTime: Number,
    disburse: Boolean,
    isMsgCount: Boolean,
    isReactionCount: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = tokenDisburseSchema;