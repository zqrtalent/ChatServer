if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: './dotenv/web'})
}

const createServer = require('./server')

const { 
    passportjwt, 
    poolingservice,
    usersservice,
    groupservice,
    messageservice
} = require('./services')
const logger  = require('./common/logger')

const { 
    migrationtask, 
    cachetask, 
    messagequeuetask 
} = require('./startup')

const { EventEmitter } = require('events')
const emitter = new EventEmitter()

const startup = async () => {
    const services = {
        usersService: null,
        groupService: null,
        cacheClient: null,
        queueService: null,
        passport: null,
        poolingService: null,
        messageService: null,
        logger
    }

    // 1)
    emitter.on('cache.start', () => {
        logger.info(`->Starting cache service.`)
        cachetask(emitter, logger)
    })

    // 2)
    emitter.on('messagequeue.start', () => {
        logger.info(`->Starting message queue service.`)
        messagequeuetask(emitter, logger)
    })

    // Error
    emitter.on('onerror', errorDesc => {
        logger.error(errorDesc)
    })

    emitter.on('migration.done', () => {
        logger.info(`->Database migration is up.`)
        emitter.emit('cache.start')
    })

    emitter.on('cache.done', cacheClient => {
        logger.info(`->Caching service is up.`)
        services.cacheClient = cacheClient
        emitter.emit('messagequeue.start')
    })

    emitter.on('messagequeue.done', queueService => {
        logger.info(`->Message queue service is up.`)
        services.queueService = queueService
        emitter.emit('start')
    })

    emitter.on('start', () => {
        services.groupService = groupservice()
        services.usersService = usersservice()
        services.passport = passportjwt({}, services.usersService)
        services.poolingService = poolingservice(services.cacheClient)
        services.messageService = messageservice(services.poolingService, services.groupService)

        const app = createServer(services)
    })

    // Execute migration task.
    await migrationtask(emitter, logger, {consoleLogging: false})
}
startup()