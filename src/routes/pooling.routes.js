const init = (express, passport, poolingService) => {
    const router = express.Router()

    const auth = () => passport.authenticate('jwt', { session: false })

    /*Pooling for user messages*/
    router.get('/message/receive', auth(), async (req, res) => {
        const userId = req.user.userId
        const received = await poolingService.receiveMessage(userId, 5)
        
        res.status(200).send({
            success: true,
            data: received
        })
    })
    return router
}

module.exports = init