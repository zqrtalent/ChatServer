if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: './dotenv/web'})
}

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const { 
    healthroutes, 
    usersroutes, 
    messagingroutes, 
    poolingroutes 
} = require('./routes')

const { 
    passportjwt, 
    poolingservice,
    usersservice
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
        cacheClient: null,
        queueService: null
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
        const usersService = usersservice()
        const passport = passportjwt({}, usersService)
        services.usersService = usersService

        app.use(cors())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        app.use(passport.initialize())

        app.use('/hc', healthroutes(express, services.queueService, services.cacheClient))
        app.use('/user', usersroutes(express, passport, usersService))
        app.use('/api/group', messagingroutes(express, passport, services.queueService, poolingservice(services.cacheClient)))
        app.use('/pooling', poolingroutes(express, passport, poolingservice(services.cacheClient)))

        app.use((err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                res.status(401).send('Unauthorized');
            }
        });
        
        const port = process.env.NODE_PORT || 3000
        app.listen(port, () => logger.info(`->Start listening on port ${port}`))
    })

    // Execute migration task.
    await migrationtask(emitter, logger, {consoleLogging: false})
}
startup()