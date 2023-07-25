const mongoose = require('mongoose');
const reactionSchema = require('../schema/reactionSchema');
const DiscordReaction = new mongoose.model('DiscordReaction', reactionSchema);
const messageSchema = require('../schema/messageSchema');
const DiscordMsg = new mongoose.model('DiscordMsg', messageSchema);
const addMessageReaction = (client, Events) => {
    // Add reaction to db
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        // When a reaction is received, check if the structure is partial

        //console.log(user);
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        var today = new Date();
        //console.log(today);
        //today.setHours(0, 0, 0, 0);

        const messageReaction = new DiscordReaction({
            //id: reaction.message.id,
            messageId: reaction.message.id,
            server: reaction.message.guild.name,
            channel: reaction.message.channel.name,
            sender: user.username,
            senderDiscordId: user.id,
            emoji: reaction.emoji.name,
            reactionCount: reaction.count,
            createdTimestamp: today,
            createdAt: today,
        })

        //console.log(reaction);
        try {
            const result = await DiscordMsg.findOneAndUpdate(
                { messageId: reaction.message.id },
                { $push: { messageReactions: messageReaction } },
                { new: true }
            );

            // console.log(result);

        } catch (error) {
            console.error(error);
        }

        /* try {
            const discordReaction = await messageReaction.save();
            console.log(discordReaction);
        } catch (error) {
            console.error(error);
        } */



        // Now the message has been cached and is fully available
        //console.log(`${reaction.message.author}'s message "${reaction.emoji.name}" gained a reaction!`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        //console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    });

}

module.exports = addMessageReaction;