const initdatabase = require('../entities')
const uuid = require('uuid')

const init = (opts) => {
    const _database = initdatabase({
        consoleLogging: opts.consoleLogging
    })

    const createMessage = async (groupId, userId, message) => {
        const result = {
            success: false,
            data: null
        }
        
        try{
            let createResult = await _database.Message.create({
                id: uuid.v1(),
                text: message.text,
                groupId,
                userId,
                createdAt: Date.now(),
            })

            result.success = true
            result.data = {
                id: createResult.get('id').toString()
            }
        }
        catch(err){
            result.errorDesc = err.toString()
        }
        return result
    }

    const getMessagesByGroup = async (groupId, offset, pageSize) => {
        const result = {
            success: false,
            data: null
        }

        try{
            const messagesResult = await _database.Message.findAll({
                include: { model: _database.User },
                where: { groupId },
                limit: Math.min(pageSize || 50, 50),
                offset: offset || 0,
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            result.success = true;
            result.data = messagesResult.map(val => {
                const user = val.get('User')
                return {
                    name: `${user.firstName} ${user.lastName}`,
                    userId: val.get('userId'),
                    text: val.get('text'),
                    createdAt: val.get('createdAt')
                }
            })
        }
        catch(err){
            result.errorDesc = err.toString()
        }
        return result
    }

    return {
        createMessage,
        getMessagesByGroup
    }
}

module.exports = init