const router = require('express').Router();
const passport = require('passport');

const login = require('./login');
const register = require('./register');
const getUser = require('./getUser');
const logOut = require('./logout');

router.post('/login', login);
router.post('/register', register);
router.post('/logout', passport.authenticate('jwt', { session: false }), logOut);

router.get('/me', passport.authenticate('jwt', { session: false }), getUser);

module.exports = router;

