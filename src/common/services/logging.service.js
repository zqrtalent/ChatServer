
const loggingService = (options) => {
    
    const error = (message) => {
        console.log(message)
    }

    const info = (message) => {
        console.log(message)
    }

    const debug = (message) => {
        console.debug(message)
    }
    
    return {
        error,
        info,
        debug
    }
}

module.exports = loggingService