const logger = require('../../common/logger')

const handler = async (data, completed, services) => {
    logger.info(`processing group.sendmessage message with data ${JSON.stringify(data)}`)

    /*
    {
        type: messageTypes.sendGroupMessage,
        payload: {
            groupId: groupId,
            sender: {
                id: senderId
            },
            message:{
                type: 'text',
                text: text
            }
        }
    }
    */

    const groupId = data.payload.groupId
    const senderId = data.payload.sender.id
    const text = data.payload.message.text
    const groupUserIds = [senderId]

    const poolingService = services.poolingService
    const sendResult = await poolingService.sendMessage(senderId, groupId, groupUserIds, text)
    logger.info(`${data.type.toString()}: result is ${sendResult}`)

    // Processing has been completed.
    completed();
}

module.exports = handler