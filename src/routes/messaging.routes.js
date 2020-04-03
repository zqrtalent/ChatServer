const { messagefactory } = require('../processing/factories')
const { queues } = require('../common/constants/queues.constants')

const init = (express, passport, messagingService, poolingService) => {
    const router = express.Router()

    const auth = () => passport.authenticate('jwt', { session: false })
    
    /*Create group*/
    router.post('/', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupName = req.body.name || 'Noname'
        const memberIds = req.body.memberIds

        const command = messagefactory.createGroupCommand(userId, groupName, memberIds)
        const sendResult = messagingService.sendMessage(queues.createGroup, command)
        res.status(200).send({
            success: sendResult
        })
    })

    /*Send group message*/
    router.post('/:groupId/send/text', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupId = req.params.groupId
        const text = req.body.text

        const command = messagefactory.sendGroupMessageCommand(groupId, userId, text)
        const sendResult = messagingService.sendMessage(queues.sendMessage, command)
        res.status(200).send({
            success: sendResult
        })
    })
    
    return router
}

module.exports = init