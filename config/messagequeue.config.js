const serviceUrl = process.env.MSG_SERVICE_URL || 'amqp://localhost'
const queueNames = (process.env.MSG_QUEUES || '').split(',')
module.exports = {
    serviceUrl,
    queues: queueNames
}