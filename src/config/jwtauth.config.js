const alg = 'HS256'
const secretKey = process.env.JWT_SECRETKEY || 'secretkey1'
const issuer = process.env.JWT_ISSUER || 'chatapp.auth.server'
const audience = process.env.JWT_AUDIENCE || 'chatusers'

module.exports = {
    secret: secretKey,
    alg,
    issuer,
    audience
}