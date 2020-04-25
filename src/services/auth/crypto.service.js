const bcrypt = require('bcrypt')
const saltRounds = 10

const init = () => {
    const generateAsync = async (plainText) => {
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(plainText, salt)
    }

    const compareAsync = async (plainText, hash) => {
        return await bcrypt.compare(plainText, hash)
    }

    return {
        generateAsync,
        compareAsync
    }
}

module.exports = init