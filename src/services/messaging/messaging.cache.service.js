const { cachingService } = require('../index')

const init = (opts) => {
    const client = cachingService(opts);

    const addGroup = (sessionId, groupId, creator, members) => {
        client.setValue(`group-${groupId}`, {
            groupId,
            creator,
            members
        })
    }

    const addGroupMessage = (sessionId, groupId, sender, message) => {
        // Validate group existance
        // Validate session user's access

        // Push list item.
        client.pushListItems(`group-${groupId}-messages`, [{
            groupId,
            sender,
            message
        }])
    }

    const getGroupUnreadMessages = (sessionId, groupId) => {
         // Push list item.
         client.getListItems(`group-${groupId}-messages`, {
            groupId,
            sender,
            message
        })
    }
    
    const updateMessageStatus = (sessionId, messageId, messageStatus) => {
    }

    const getMessageStatus = (sessionId, messageId) => {
    }

    return {
        group:{
            add: addGroup,
            addMessage: addGroupMessage,
            getUnreadMessages: getGroupUnreadMessages
        },
        message: {
            add: addGroupMessage
        },
        messageStatus: {
            update: updateMessageStatus,
            get: getMessageStatus
        }
    }
}

module.exports = init