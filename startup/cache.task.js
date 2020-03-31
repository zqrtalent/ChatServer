const { cachingconfig } = require('../config')
const { cacheservice } = require('../services')

const execute = (emitter, logger) => {
    /* Initialize cache client. */
    const cacheClient = cacheservice({
        host: cachingconfig.host,
        port: cachingconfig.port
    })
    emitter.emit('cache.done', cacheClient)
}

module.exports = execute