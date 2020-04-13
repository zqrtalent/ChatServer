const { groupdalservice } = require('../../dal')

const init = () => {
    const dalService = groupdalservice({}) 

    const getUserGroups = async (userId, offset, pageSize) => {
        const result = await dalService.getUserGroups(userId, offset, pageSize)
        if(!result.success){
            // log error here.
            return null
        }
        return result.data
    }

    const createGroup = async (userId, name, memberIds) => {
        const group = {
            name: name,
            userId: userId,
            memberIds
        }

        const result = await dalService.createGroup(group)
        return {
            newGroupId: result && result.data ? result.data.id || '' : '',
            success: result.success
        }
    }

    const getGroupUsers = async (groupId, offset, pageSize) => {
        const result = await dalService.getGroupUsers(groupId, offset, pageSize)
        if(!result.success){
            // log error here.
            return null
        }
        return result.data
    }
    
    return {
        createGroup,
        getUserGroups,
        getGroupUsers
    }
}

module.exports = init