const { messagefactory } = require('../processing/factories')
const { queues } = require('../common/constants/queues.constants')

const init = (express, passport, messagingService, groupService, poolingService) => {
    const router = express.Router()

    const auth = () => passport.authenticate('jwt', { session: false })
    
    /*Create group*/
    router.post('/', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupName = req.body.name || ''
        const memberIds = req.body.memberIds
        
        const groupResult = await groupService.createGroup(userId, groupName, memberIds)
        res.status(200).send(groupResult)

        // const command = messagefactory.createGroupCommand(userId, groupName, memberIds)
        // const sendResult = messagingService.sendMessage(queues.createGroup, command)
        // res.status(200).send({
        //     success: sendResult
        // })
    })

    /*Get groups*/
    router.get('/', auth(), async (req, res) => {
        const userId = req.user.userId
        var groups = await groupService.getUserGroups(userId, 0, 20)

        res.status(200).send({
            data: groups,
            success: groups ? true : false
        })
    })

    /*Get group users*/
    router.get('/:groupId/users', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupId = req.params.groupId

        // TODO: check if current user has access to the group.
        var users = await groupService.getGroupUsers(groupId, 0, 20)

        res.status(200).send({
            data: users,
            success: users ? true : false
        })
    })

    /*Send group message*/
    router.post('/:groupId/send/text', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupId = req.params.groupId
        const text = req.body.text
        const groupUsers = await groupService.getGroupUsers(groupId, 0, 10)
        if(groupUsers == null || groupUsers.length == 0){
            res.status(200).send({
                errorDesc: 'No group members found!',
                success: false
            })
        }
        else{
            const groupUserIds = groupUsers.map(x => { return x.id });
            const sendResult = await poolingService.sendMessage(userId, groupId, groupUserIds, text)
            res.status(200).send({
                success: sendResult
            })
        }

        // const command = messagefactory.sendGroupMessageCommand(groupId, userId, text)
        // const sendResult = messagingService.sendMessage(queues.sendMessage, command)
        // res.status(200).send({
        //     success: sendResult
        // })
    })
    
    return router
}

module.exports = init