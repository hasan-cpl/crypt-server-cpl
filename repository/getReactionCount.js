
const mongoose = require('mongoose');
const messageSchema = require('./schema/messageSchema');
const reactionSchema = require('./schema/reactionSchema');
const tokenDisburseSchema = require('./schema/token-disburse/TokenDisburseSchema');

const DiscordMsg = new mongoose.model('DiscordMsg', messageSchema);
const DiscordReaction = new mongoose.model('DiscordReaction', reactionSchema);
const TokenDisburse = new mongoose.model('TokenDisburse', tokenDisburseSchema);

const getReactionCount = async (element) => {
    let reactionCount;
    try {

        reactionCount = await DiscordMsg.aggregate([
            { $unwind: '$messageReactions' },
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
                {
                    'messageReactions.createdTimestamp': {
                        $gte: element.startTime,
                        $lte: element.endTime
                    }
                }
            },
            {
                $group:
                {
                    _id: '$messageReactions.senderDiscordId',
                    name: { $first: '$messageReactions.sender' },
                    address: { $first: '$user-info.wallet.accountAddress' },
                    count: { $sum: 1 }
                }
            },
            { "$sort": { 'messageReactions.createdTimestamp': -1 } },


        ]);

        //resultCount = resultCount.concat(reactionCount);

        //console.log(reactionCount);

    } catch (error) {
        console.error(error);

    }

    return reactionCount;
}

module.exports = getReactionCount;