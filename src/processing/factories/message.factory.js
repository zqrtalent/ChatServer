const messageTypes = require('../../common/constants/messagetype.constants')

const createGroupCommand = (creatorId, name, memberIds) => {
    return {
        type: messageTypes.createGroup,
        payload: {
            name,
            creator: {
                id: creatorId
            },
            members: memberIds.map(x => {
                return {
                    id: x
                }
            })
        }
    }
}

const sendGroupTextMessageCommand = (groupId, senderId, text) => {
    return {
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
}

module.exports = {
    createGroupCommand,
    sendGroupTextMessageCommand
}