const express = require("express");
const mongoose = require('mongoose');
const cron = require('node-cron');

require('dotenv').config();
const cors = require('cors');

const { Client, Events, Intents, GatewayIntentBits, Partials } = require('discord.js');


const userRouter = require('./routes/userHandler');
const proposalRouter = require('./routes/proposalHandler');
const discordMsgRouter = require('./routes/v1/messageHandler');
const tokenDisburseRouter = require('./routes/v1/tokenDisburseHandler');

const createMessage = require('./discord/createMessage');
const addMessageReaction = require("./discord/addMessageReaction");
const startScheduleTask = require("./cornjob/startScheduleTask");



const app = express();

app.use(cors())
app.use(express.json());

// send json body
//app.use(bodyParser.json());

// creating corse route

app.use("/api/v1", userRouter);
app.use("/api/v1", proposalRouter);
app.use("/api/v1", discordMsgRouter);
app.use("/api/v1", tokenDisburseRouter);

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: err
    });
};
app.use(errorHandler);



mongoose.connect(process.env.DB_CONNECTION_URL, () => {
    console.log('Connected DB at ' + process.env.DB_CONNECTION_URL);
});


app.listen(process.env.PORT, () => {
    console.log('Server is running at port', process.env.PORT);
});


const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,

        ],
        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction
        ],
    }
);

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log(`${client.user.username} is Ready!`);
});

createMessage(client);
addMessageReaction(client, Events);
client.login(process.env.DISCORD_BOT_TOKEN);
//console.log(process.env.DISCORD_BOT_TOKEN);

// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *

// 0 0 0 * * *

// cron.schedule('*/59 * * * * *', async () => {
//     await startScheduleTask();
// });

// Schedule the task to run at 11:59 PM on the last day of the month (28-31)
cron.schedule('59 23 28-31 * *', async () => {
    // Check if tomorrow is the 1st of the next month
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (tomorrow.getDate() === 1) {
        // Execute the task on the last day of the month
        await startScheduleTask();
    }
});
