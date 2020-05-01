const logger = require('../../common/logger')

const handler = async (data, completed, services) => {
    logger.info(`processing group.create message with data: ${JSON.stringify(data)}`)
    // Processing has been completed.
    completed();
}

module.exports = handler