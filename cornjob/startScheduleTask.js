const mongoose = require('mongoose');
const getMessageCount = require('../repository/getMessageCount');
const tokenDisburseSchema = require('../schema/token-disburse/TokenDisburseSchema');
const TokenDisburse = new mongoose.model('TokenDisburse', tokenDisburseSchema);
const sendTokenForMessage = require('../token/sendTokenForMessage');

const startScheduleTask = async () => {
    console.log('running a task every day');
    console.log(Date.now());
    let startTime = 0;
    let endTime2 = Date.now();

    await TokenDisburse.find({
        "disburse": false,
        "endTime": {
            "$lte": endTime2
        }
    }).then(res => {
        //console.log(res);
        res.forEach(async (element) => {
            //console.log(element);
            if (element.isMsgCount && element.isReactionCount) {

                /* const msgCount = await getMsgCount(element);
                console.log(msgCount); */

                await getMessageCount(element)
                    .then(msgCount => {
                        //console.log(res);
                        sendTokenForMessage(msgCount);
                    }).catch(err => console.error(err))

                /* const reactionCount = await getReactionCount(element);
                console.log(reactionCount);
 */

            }
        })
    }).catch(err => {
        console.error(err);
    })

}

module.exports = startScheduleTask;