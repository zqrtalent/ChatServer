const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { 
    healthroutes, 
    usersroutes, 
    grouproutes, 
    poolingroutes 
} = require('./routes')

const init = (services) => {
    const app = express()

    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(services.passport.initialize())

    app.use('/hc', healthroutes(express, app))
    app.use('/user', usersroutes(express, services.passport, services.usersService))
    app.use('/group', grouproutes(express, services.passport, services.queueService, services.groupService, services.poolingService))
    app.use('/pooling', poolingroutes(express, services.passport, services.poolingService))

    app.use((req, res, next) => {
        res.status(404).send();
    });

    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('Unauthorized')
            return
        }
        else{
            if(process.env.NODE_ENV != 'production'){
                console.error(err.stack)
            }
            res.status(501).send('Internal error occured.')
        }
    });
    
    const port = process.env.NODE_PORT || 3000
    app.listen(port, () => services.logger.info(`->Start listening on port ${port}`))
    return app
}

module.exports = init