const logger = require('../../common/logger')

const handler = async (data, completed, services) => {
    logger.info(`processing group.create message with data: ${JSON.stringify(data)}`)
    const command = data.payload 
    const result = await services.groupService.createGroup(command.creator.id, command.name, command.members.map(x => x.id))
    logger.info(`processing group.create message completed: ${JSON.stringify(result)}`)
    completed();
}

module.exports = handler