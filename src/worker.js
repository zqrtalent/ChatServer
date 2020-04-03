if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: './dotenv/worker'})
}

const express = require('express')
const app = express()
const { healthroutes } = require('./routes')
const { cachingconfig, messagequeueconfig } = require('./config')
const { messagingservice, cacheservice, poolingservice } = require('./services')
const processingManager = require('./processing/processing.manager')()
const logger  = require('./common/logger')

const services = {
    usersService: null,
    cacheClient: null,
    queueService: null,
    poolingService: null
}

/* Initialize cache client. */
const cacheClient = cacheservice({
    host: cachingconfig.host,
    port: cachingconfig.port
})
services.cacheClient = cacheClient

const queues = messagequeueconfig.queues.map(x =>  {
    return {
        queueName: x,
        onMessageCallback: async (queue, msg, oncomplete) => {
            const message = JSON.parse(msg.content.toString())
            logger.info(`Received: [${queue}]: ${message.type || 'UnknownType'}`);
            await processingManager.handleMessage(message, () => oncomplete(msg), services)
        },
        noAck: false,
        persistMessages: true,
    }
})

const opts = { 
    queues,
    amqpUrl: messagequeueconfig.serviceUrl, 
}

messagingservice(opts).then((queueService) => {
    services.queueService = queueService
    services.poolingService = poolingservice(services.cacheClient)

    app.use('/', healthroutes(express, queueService, cacheClient))

    const port = process.env.NODE_PORT || 3001
    app.listen(port, () => console.log(`Start listening on port ${port}`))
},
(error) => {
    logger.error(error)
})