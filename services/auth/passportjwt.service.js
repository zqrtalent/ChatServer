const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const { jwtauth } = require('../../config')

const init = (opts, userService) => {
    const jwtStrategy = new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtauth.secret,
        issuer: jwtauth.issuer,
        audience: jwtauth.audience,
        ignoreExpiration: true
    }, 
    async (payload, done) => {
        // User.findOne({id: jwt_payload.sub}, function(err, user) {
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //         // or you could create a new account
        //     }
        // });

        const user = await userService.getUserByEmail(payload.sub)
        if(user){
            return done(null, {userId: payload.sub})
        }
        return done(null, false)
    })

    passport.use(jwtStrategy)
    return passport
}

module.exports = init