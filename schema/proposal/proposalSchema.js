const mongoose = require('mongoose');
const voterSchema = require('./voterSchema');

const proposalSchema = mongoose.Schema({
    proposalNumber: String,
    voters : [voterSchema],
   
});

module.exports = proposalSchema;