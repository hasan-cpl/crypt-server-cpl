const mongoose = require('mongoose');
const messageSchema = require('../schema/messageSchema');
const reactionSchema = require('../schema/reactionSchema');
const tokenDisburseSchema = require('../schema/token-disburse/TokenDisburseSchema');
const DiscordMsg = new mongoose.model('DiscordMsg', messageSchema);
const DiscordReaction = new mongoose.model('DiscordReaction', reactionSchema);
const TokenDisburse = new mongoose.model('TokenDisburse', tokenDisburseSchema);

const getMessageCount = async (element) => {
    //console.log(element);
    let msgCount;

    // message count
    try {

        msgCount = await DiscordMsg.aggregate([
            //{ $unwind: '$messageReactions' },
            {
                $lookup:
                {
                    from: "users", //another collection name
                    localField: "senderDiscordId", // order collection field
                    foreignField: "discordInfo.id", // inventory collection field
                    as: "user-info"
                }
            },
            {
                $match:
                    { 'createdTimestamp': { $gte: element.startTime, $lte: element.endTime } }
            },
            {
                $group:
                {
                    _id: '$senderDiscordId',
                    name: { $first: '$sender' },
                    address: { $first: '$user-info.wallet.accountAddress' },
                    count: { $sum: 1 }
                }
            },
            { "$sort": { createdTimestamp: -1 } },


        ]);

        //console.log(msgCount);

       await TokenDisburse.findOneAndUpdate(
            { _id: element._id },
            { disburse: true },
            { new: true },
        ).then(res => {
            console.log(res);
        }).catch(err => console.error(err));
    } catch (error) {
        console.error(error);
    }


    return msgCount;
}

module.exports = getMessageCount