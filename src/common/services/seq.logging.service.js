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

    const error = (format, ...args) => {
        _log.error(format, args)
    }

    const warning = (format, ...args) => {
        _log.warn(format, args)
    }

    const info = (format, ...args) => {
        _log.info(format, args)
    }

    const debug = (format, ...args) => {
        _log.debug(format, args)
    }
    
    return {
        error,
        info,
        debug,
        warning
    }
}

module.exports = seqLoggingService