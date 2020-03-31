const crypto = require('./crypto.service')
const jwttoken = require('./jwttoken.service')
const { usersdalservice } = require('../../dal')

const init = () => {
    const dalService = usersdalservice({}) 
    const cryptoService = crypto()
    const jwttokenService = jwttoken()

    const getUserByEmail = async (email) => {
        const result = await dalService.getUserByEmail(email)
        if(!result.success){
            // log error here.
            return null
        }
        return result.data
    }

    const createUser = async (newUser) => {
        const passwordHash = await cryptoService.generate(`${newUser.password}_${newUser.email}`)
        const user = {
            passwordHash,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        }

        const result = await dalService.createUser(user)
        return {
            newUserId: result.data.id || '',
            success: result.success
        }
    }

    const verifyAndGenerateToken = async (email, password) => {
        const user = await getUserByEmail(email)
        if(!user){
            return null
        }

        const compareResult = await cryptoService.compare(`${password}_${email}`, user.passwordHash)
        if(!compareResult){
            return null
        }

        return jwttokenService.sign(email, {
            userId: user.id
        })
    }

    return {
        createUser,
        getUserByEmail,
        verifyAndGenerateToken
    }
}

module.exports = init