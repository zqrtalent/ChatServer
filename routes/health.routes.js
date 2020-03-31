const init = (express) => {
    const router = express.Router()
    router.get('/', (req, res) => {
        // Check messaging queue service connectivity.
        // Check cache service connectivity.
        
        res.status(200).send('OK')
    })
    return router
}

module.exports = init