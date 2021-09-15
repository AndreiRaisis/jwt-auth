const express = require('express');
const routes = require('./routes');
const passportInstance = require('./config/passport');
const passport = require('passport');

const port = process.env.PORT | 3000;

const app = express();

app.use(express.json());

app.use(passportInstance(passport).initialize());

app.use('/', routes);

app.listen(port, () => console.log(`ヾ(-_- )ゞ Server started at http://localhost:${port}`));
