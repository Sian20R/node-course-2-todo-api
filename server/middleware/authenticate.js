var {User} = require('./../models/user');

var authenticate = async (req, res, next) => {
    try {
        var token =  req.header('x-auth');
        var user = await User.findByToken(token);

        if (!user)
            return Promise.reject();

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send();
    }
};


module.exports = {
    authenticate
}