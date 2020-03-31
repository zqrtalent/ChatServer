const logger = require('../../common/logger')

const handler = async (data, completed, services) => {
    logger.info(`processing createUser message with data: ${JSON.stringify(data)}`)

    // Processing has been completed.
    completed();
}

module.exports = handler