const messageTypeNames = require('./messagetype.constants')
const queues =require('./queues.constants')

const endpoints = [
    {
        queueName: queues.queue1,
        messages:[
            messageTypeNames.createUser,
            messageTypeNames.deleteUser
        ]
    },
    {
        queueName: queues.queue2,
        messages:[
            messageTypeNames.onUserCreated,
            messageTypeNames.onUserDeleted
        ]
    }
]

module.exports = endpoints