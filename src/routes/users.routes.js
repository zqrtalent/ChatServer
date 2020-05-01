const { Router } = require('express')
const joi = require('@hapi/joi')

const init = (express, passport, usersService) => {
    const router = express.Router()

    const signinRequestBody = joi.object({
        email: joi.string().email({}).required(),
        password: joi.string().min(4).max(32).required()
    })

    router.post('/signin', async (req, res) => {
        try{
            const body = await signinRequestBody.validateAsync(req.body, { warnings: true })

            const tokenResult = await usersService.verifyAndGenerateToken(body.value.email, body.value.password)
            res.status(200).send({
                success: tokenResult ? true : false,
                token: tokenResult || ''
            })
        }
        catch(err){
            res.status(200).send({
                success: false,
                token: err.toString()
            })
        }  
    })

    const signupRequestBody = joi.object({
        email: joi.string().email({}).required(),
        password: joi.string().min(4).max(32).required(),
        firstName: joi.string().min(2).max(32).required(),
        lastName: joi.string().min(2).max(32).required(),
    })
    
    router.post('/signup', async (req, res) => {
        try{
            const body = await signupRequestBody.validateAsync(req.body, { warnings: true })
            const result = await usersService.createUser(body.value)
            res.status(200).send({
                success: result.success,
                data: {
                    userId: result.newUserId
                }
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