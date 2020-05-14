const bunyan = require('bunyan')
const seq = require('bunyan-seq')
const { logging } = require('../config')

const seqLoggingService = (opts) => {
    const _log = bunyan.createLogger({
        name: 'testapp',
        streams: [
            // {
            //     stream: process.stdout,
            //     level: 'warn', // 
            // },
            seq.createStream({
                serverUrl: logging.serviceUrl,
                level: logging.level
            })
        ]
    });

// log.info('Hi!');
// log.warn({lang: 'fr'}, 'Au revoir');

    const error = (...args) => {
        _log.error(args[0])
    }

    const warning = (...args) => {
        _log.warn(args[0])
    }

    const info = (...args) => {
        _log.info(args[0])
    }

    const debug = (...args) => {
        _log.debug(args[0])
    }
    
    return {
        error,
        info,
        debug,
        warning
    }
}

module.exports = seqLoggingService