const logServiceUrl = process.env.LOGGING_SERVICEURL || 'http://localhost:8089'
const logProvider = process.env.LOGGING_PROVIDER || 'seq'
const logLevel = process.env.LOGGING_LEVEL || 'debug'

module.exports = {
    serviceUrl: logServiceUrl,
    provider: logProvider,
    level: logLevel
}