const routes = require("express").Router();

const user = require('./user');

routes.use('/api/', user);

module.exports = routes;
