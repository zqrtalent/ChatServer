const { db  } = require('../../config')
const initdatabase = require('../entities')
const uuid = require('uuid')

const init = (opts) => {
    const _database = initdatabase({
        consoleLogging: opts.consoleLogging
    })

    const createGroup = async (newGroup) => {
        const result = {
            success: false,
            data: null
        }
        
        try{
            const newGroupId = uuid.v1()
            let members = newGroup.memberIds.map(x => {
                return {
                    id: uuid.v1(),
                    groupId: newGroupId,
                    userId: x,
                }
            })
            members.push({
                id: uuid.v1(),
                groupId: newGroupId,
                userId: newGroup.userId,
            })

            let createResult = await _database.Group.create({
                id: newGroupId,
                name: newGroup.name,
                userId: newGroup.userId,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                Members: members
            },{
                //include:[_database.Group.Members] // passsing Assiated
                include:[{model: _database.Member}] // passing Model
            })

            result.success = true
            result.data = {
                id: createResult.get('id').toString(),
                name: newGroup.name,
                userId: newGroup.userId,
                createdAt: createResult.get('createdAt'),
            }
        }
        catch(err){
            result.errorDesc = err.toString()
        }
        return result
    }

    const getUserGroups = async (userId, offset, pageSize) => {
        const result = {
            success: false,
            data: null
        }

        try{
            const groupsResult = await _database.Member.findAll({
                include: { model: _database.Group },
                where: { userId },
                limit: Math.min(pageSize || 50, 50),
                offset: offset || 0
            })

            result.success = true;
            result.data = groupsResult.map(val => {
                const group = val.get('Group')
                return {
                    id: group.id,
                    userId: group.userId,
                    name: group.name,
                    createdAt: group.createdAt
                }
            })
        }
        catch(err){
            result.errorDesc = err.toString()
        }
        return result
    }

    return {
        createGroup,
        getUserGroups
    }
}

module.exports = init