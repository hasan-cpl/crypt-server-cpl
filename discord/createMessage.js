const mongoose = require('mongoose');

const messageSchema = require('../schema/messageSchema');
const DiscordMsg = new mongoose.model('DiscordMsg', messageSchema);
const createMessage = (client) => {

    client.on('messageCreate', async (message) => {

        // console.log(
        //     `Channel: ${message.channel.name} 
        //     Server: ${message.guild.name} 
        //     Sender: ${message.author.username}
        //     Message: ${message.content} 
        //     CreatedTimestamp: ${message.createdTimestamp} 
        //     CreatedAt: ${message.createdAt}`);

        const msg = new DiscordMsg({
            messageId: message.id,
            server: message.guild.name,
            channel: message.channel.name,
            sender: message.author.username,
            senderDiscordId: message.author.id,
            message: message.content,
            createdTimestamp: message.createdTimestamp,
            createdAt: message.createdAt,
        });

        try {
            const discordMsg = await msg.save();
            console.log(discordMsg);

        } catch (error) {
            console.error(error);
        }


    });
}

module.exports = createMessage;