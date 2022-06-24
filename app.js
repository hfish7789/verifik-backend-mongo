const user = require('./controllers/user.controller');
const auth = require("./middleware/auth");

module.exports = (app) => {
    const router = require("express").Router();
    
    router.post('/v2/auth/signup', (req, res) => {
        user.signup(req, res);
    });

    router.post('/v2/auth/signin', (req, res) => {
        user.signin(req, res);
    });

    router.post('/v2/auth/session', auth, (req, res) => {
        console.log(req.user);
        res.json({ user: req.user, accessToken: req.token });
    });

    router.post('/v2/auth/client/request-otp', (req, res) => {
        user.forgotPassword(req, res);
    });

    router.post('/v2/auth/client/recovery-otp', (req, res) => {
        user.resetPassword(req, res);
    });

    app.use('', router);
};