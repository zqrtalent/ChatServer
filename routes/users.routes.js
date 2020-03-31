const { Router } = require('express')

const init = (express, passport, usersService) => {
    const router = express.Router()

    router.post('/signin', async (req, res) => {
        const email = req.body.email || ''
        const password = req.body.password || ''
        
        // TODO: use joi validator.
        if(!email || !password){
            res.status(404).send()
            return
        }

        const result = await usersService.verifyAndGenerateToken(email, password)
        if(!result){
            res.status(404).send()
            return
        }

        res.status(200).send({
            success: true,
            token: result || ''
        })
    })
    
    router.post('/signup', async (req, res) => {
        // TODO: use joi validator.
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }

        const result = await usersService.createUser(newUser)
        res.status(200).send({
            success: result.success,
            data: {
                userId: result.newUserId
            }
        })
    })
    return router
}

module.exports = init