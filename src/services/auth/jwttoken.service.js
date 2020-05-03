const jwtoken = require('jsonwebtoken')
const { jwtauth } = require('../../config')

const init = () => {
    /**
     * Signs/Generates jwt token.
     * @param {*} subject 
     * @param {*} payload 
     */
    const sign = async (subject, payload) => {
        return jwtoken.sign(
            payload || {}, 
            jwtauth.secret, 
            {
                subject,
                algorithm: jwtauth.alg,
                audience: jwtauth.audience,
                issuer: jwtauth.issuer,
                expiresIn: 86400
            })
    }

    return {
        sign
    }
}

module.exports = init