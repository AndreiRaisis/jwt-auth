const { Strategy, ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const userServices = require('../services/user');
const database = require('../config/database');

const pathToKey = 'id_rsa_pub.pem'
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new Strategy(options, async (jwt_payload, done) => {
    const connection = await database.connection();
    console.log("Hello: ", jwt_payload)
    try {
        const user = await userServices.getUserById(connection, jwt_payload.sub);

        if (user.length > 0) {
            return done(null, user[0]);
        } else {
            return done(null, false);
        }
    } catch (e) {
        return done(e, false);
    } finally {
        await connection.release();
    }
});

module.exports = (passport) => {
    return passport.use(strategy);
};
