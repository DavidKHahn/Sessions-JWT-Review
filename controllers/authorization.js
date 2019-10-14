const redisClient = require('./signin').redisClient();

const requireAuth = (req, res, next) => {
// checks if there is auth
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }
// if auth exists then check redis server
    return redisClient.get(authorization, (err, reply) => {
// if nothing exists then unauthorized
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        }
// otherwise move onto next phase
// console.log('moving onto next step')
        return next();
    })
}

module.exports = {
    requireAuth: requireAuth
}