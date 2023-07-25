const jwt = require('jsonwebtoken');
const checkLogin = (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const { id, username } = decode;
        req.id = id;
        req.username = username;
        next();
    } catch (err) {
        console.log(err);
        next("Authentication Failed!");
    }
};

module.exports = checkLogin;