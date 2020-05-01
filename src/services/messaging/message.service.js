const { messagedalservice } = require('../../dal')

const init = (poolingService, groupService) => {
    const dalService = messagedalservice({}) 

    const getGroupUserIds = async (groupId) => {
        const groupUsers = await groupService.getGroupUsers(groupId, 0, 10)
        return groupUsers ? groupUsers.map(x => { return x.id }) : []
    }

    const sendTextMessage = async (groupId, userId, text) => {
        const userIds = await getGroupUserIds(groupId)
        if(userIds.length == 0){
            return {
                messageId: null,
                success: false,
                errorDesc: 'Unable to retrieve users of the group!'
            }
        }

        // Create message entry.
        const result = await dalService.createMessage(groupId, userId, { text })

        // Send text message.
        if(result.success){
            const sendResult = await poolingService.sendMessage(userId, groupId, userIds, text)
            if(sendResult.success){
                // Log message here,
            }
        }

        return {
            messageId: result && result.data ? result.data.id || '' : '',
            success: result.success
        }
    }

    const getMessagesByGroup = async (groupId, userId, offset, pageSize) => {
        // Get messages by group.
        const result = await dalService.getMessagesByGroup(groupId, offset, pageSize)
        return {
            data: result.data,
            success: result.success
        }
    }

    return {
        sendTextMessage,
        getMessagesByGroup
    }
}

module.exports = init