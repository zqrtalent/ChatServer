const initdatabase = require('../entities')
const uuid = require('uuid')

const init = (opts) => {
    const _database = initdatabase({
        consoleLogging: opts.consoleLogging
    })

    const createUser = async (newUser) => {
        const result = {
            success: false,
            data: null
        }
        
        try{
            let createResult = await _database.User.create({
                id: uuid.v1(),
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                isEmailVerified: false,
                isLocked: false,
                isArchived: false,
                passwordHash: newUser.passwordHash,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })

            result.success = true
            result.data = {
                id: createResult.get('id').toString(),
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                passwordHash: newUser.passwordHash,
                createdAt: createResult.get('createdAt'),
            }
        }
        catch(err){
            result.errorDesc = err.toString()
        }
        return result
    }

    const getUserByEmail = async (email) => {
        const result = {
            success: false,
            data: null
        }

        try{
            const usersResult = await _database.User.findAll({
                where: { email },
                limit: 1,
                offset: 0
            })
            
            if(usersResult.length > 0){
                result.success = true
                result.data = usersResult.map(val => {
                    return {
                        id: val.get('id'),
                        firstName: val.get('firstName'),
                        lastName: val.get('lastName'),
                        email: val.get('email'),
                        passwordHash: val.get('passwordHash'),
                    }
                })[0]
            }
        }
        catch(err){
            //console.log(err)
            result.errorDesc = err.toString()
        }

        return result
    }

    return {
        createUser,
        getUserByEmail
    }
}

module.exports = init