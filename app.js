const user = require('./controllers/user.controller');
const auth = require("./middleware/auth");

module.exports = (app) => {
    const router = require("express").Router();
    
    router.post('/signup', (req, res) => {
        user.signup(req, res);
    });

    router.post('/signin', (req, res) => {
        user.signin(req, res);
    });

    router.post('/session', auth, (req, res) => {
        res.json({ user: req.user, accessToken: req.token });
    });

    router.post('/client/request-otp', (req, res) => {
        user.forgotPassword(req, res);
    });

    router.post('/client/recovery-otp', (req, res) => {
        user.resetPassword(req, res);
    });

    app.use('/v2/auth', router);
};