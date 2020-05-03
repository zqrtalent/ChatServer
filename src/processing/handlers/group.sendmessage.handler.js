const logger = require('../../common/logger')

const handler = async (data, completed, services) => {
    logger.info(`processing group.sendmessage message with data ${JSON.stringify(data)}`)
    const payload = data.payload
    const sendResult = await services.messageService1.sendTextMessage(payload.groupId, payload.sender.id, payload.message.text)
    logger.info(`${data.type.toString()}: result is ${JSON.stringify(sendResult)}`)

    // Processing has been completed.
    completed();
}

module.exports = handler