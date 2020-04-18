const AuthError = require('../errors/authError');

const isAuth = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            next(new AuthError());
        }
}

module.exports = isAuth;
