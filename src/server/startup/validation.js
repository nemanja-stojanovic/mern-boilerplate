const Joi = require('joi');

module.exports = () => {
  /* eslint-disable global-require */
  Joi.objectId = require('joi-objectid')(Joi);
};
