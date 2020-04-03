const logger  = require('../common/logger')
const messageTypes = require('../common/constants/messagetype.constants')

const createUserHandler = require('./handlers/createUser.handler')
const deleteUserHandler = require('./handlers/deleteUser.handler')
const createGroupHandler = require('./handlers/group.create.handler')
const sendMessageHandler = require('./handlers/group.sendmessage.handler')

var handlersByType = {}

/**
 * Initializes the manager.
 */
const init = (opts) => {
    handlersByType[messageTypes.createUser] = createUserHandler
    handlersByType[messageTypes.deleteUser] = deleteUserHandler
    handlersByType[messageTypes.createGroup] = createGroupHandler
    handlersByType[messageTypes.sendGroupMessage] = sendMessageHandler
}

/*
 * Method handling incoming messages.
 * @param {*} message 
 * @param {*} oncomplete 
 */
const handleMessage = async (message, oncomplete, services) => {
    const messageType = message.type || ''
    if( typeof handlersByType[messageType] != 'function'){
        logger.info(`Unable to process message type='${messageType}'!`)
        return;
    }

    // Process message by handler.
    await handlersByType[messageType](message, oncomplete, services)
} 

module.exports = (opts) => { 
    init(opts)
    return {
        handleMessage
    }
}