
const loggingService = (opts) => {
    
    const error = (...args) => {
        console.error(args[0])
    }

    const warning = (...args) => {
        console.warn(args[0])
    }

    const info = (...args) => {
        console.info(args[0])
    }

    const debug = (...args) => {
        console.debug(args[0])
    }
    
    return {
        error,
        info,
        debug,
        warning
    }
}

module.exports = loggingService