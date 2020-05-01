const { messagequeueconfig } = require('../config')
const { messagingservice } = require('../services')

const execute = (emitter, logger) => {
    // Create and connect to messaging/queue instance and then start listening to the port. 
    const opts = { 
        amqpUrl: messagequeueconfig.serviceUrl, 
        queues: messagequeueconfig.queues.map( x => {
            return {
                queueName: x,
                onMessageCallback: (queue, msg, oncomplete) => {
                    oncomplete(msg)
                },
                noAck: false,
                persistMessages: true,
            }
        }) 
    }

    messagingservice(opts).then(queueService => {
        emitter.emit('messagequeue.done', queueService)
    },
    (error) => {
        emitter.emit('onerror', `messagequeue: ${error.toString()}`)
    })
}

module.exports = execute