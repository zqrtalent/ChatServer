const bcrypt = require('bcrypt')
const saltRounds = 10

const init = () => {

    const generate = async (plainText) => {
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(plainText, salt)
    }

    const compare = async (plainText, hash) => {
        return await bcrypt.compare(plainText, hash)
    }

    return {
        generate,
        compare
    }
}

module.exports = init