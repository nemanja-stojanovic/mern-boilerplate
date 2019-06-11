const winston = require('winston');
require('express-async-errors');
// const config = require('config');
// require('winston-mongodb');

const { format } = winston;

module.exports = () => {
  winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple())
      })
    );
  }
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  // Uncomment next line for saving logging messages in db (also uncomment 2 dependency imports).
  // winston.add(new winston.transports.MongoDB({ db: config.get('mongoUrl') }));
};
