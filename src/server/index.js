if (!process.env.NODE_CONFIG_DIR) process.env.NODE_CONFIG_DIR = './src/server/config';

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const rateLimiterRedisMiddleware = require('./middleware/rateLimiterRedis');

const app = express();
app.use(rateLimiterRedisMiddleware);
app.use(express.static('dist'));
app.use(helmet());
app.use(cors());
if (app.get('env') === 'development') app.use(morgan('tiny'));

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 8080;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
