const joi = require('@hapi/joi')
const { messagefactory } = require('../processing/factories')
const { queues } = require('../common/constants/queues.constants')

const init = (express, passport, messageService, groupService) => {
    const router = express.Router()
    const auth = () => passport.authenticate('jwt', { session: false })
    
    const createGroupRequestBody = joi.object({
        name: joi.string().alphanum().min(2).required(),
        memberIds: joi.array().min(1).required()
    })

    /*Create group*/
    router.post('/', auth(), async (req, res) => {
        const userId = req.user.userId

        try{
            const body = await createGroupRequestBody.validateAsync(req.body, { warnings: true })
            const groupResult = await groupService.createGroup(userId, body.value.name, body.value.memberIds)
            res.status(200).send(groupResult)
        }
        catch(err){
            res.status(200).send({
                success: false,
                token: err.toString()
            })
        }
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

    const sendTextRequestBody = joi.object({
        text: joi.string().alphanum().min(1).max(255).required(),
    })

    /*Send group message*/
    router.post('/:groupId/send/text', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupId = req.params.groupId
        
        try{
            const body = await sendTextRequestBody.validateAsync(req.body, { warnings: true })
            const sendResult = await messageService.sendTextMessage(groupId, userId, body.value.text)
            res.status(200).send({
                success: sendResult
            })
        }
        catch(err){
            res.status(200).send({
                success: false,
                token: err.toString()
            })
        }
    })

    const getGroupMessagesParams = joi.object({
        offset: joi.number().min(0),
        pageSize: joi.number().min(0),
    })

    /*Get group message*/
    router.get('/:groupId/messages/offset/:offset/page/:pageSize', auth(), async (req, res) => {
        const userId = req.user.userId
        const groupId = req.params.groupId

        try{
            const params = await getGroupMessagesParams.validateAsync({
                offset: req.params.offset,
                pageSize: req.params.pageSiz
            }, { warnings: true })

            const sendResult = await messageService.getMessagesByGroup (groupId, userId, 
                params.value.offset, params.value.pageSize)
            res.status(200).send({
                success: sendResult
            })
        }
        catch(err){
            res.status(200).send({
                success: false,
                token: err.toString()
            })
        }
    })
    
    return router
}

module.exports = init