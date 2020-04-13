const { createTerminus } = require('@godaddy/terminus')

const init = (express, server) => {
    const onSignal = () => {
        console.log('server is starting cleanup')
        // start cleanup of resource, like databases or file descriptors
    }

    const onHealthCheck = async () => {
        // checks if the system is healthy, like the db connection is live
        // resolves, if health, rejects if not
    }

    createTerminus(server, {
        signal: 'SIGINT',
        healthChecks: { '/healthcheck': onHealthCheck },
        onSignal
    })
    

    const router = express.Router()
    // router.get('/ready', (req, res) => {
    //     // Check messaging queue service connectivity.
    //     // Check cache service connectivity.
    //     res.status(200).send('OK')
    // })

    // router.get('/live', (req, res) => {
    //     // Check messaging queue service connectivity.
    //     // Check cache service connectivity.
    //     res.status(200).send('OK')
    // })
    return router
}

module.exports = init