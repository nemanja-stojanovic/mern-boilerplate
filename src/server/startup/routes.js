const express = require('express');
const tests = require('../routes/tests');
const error = require('../middleware/error');

module.exports = (app) => {
  app.use(express.json());
  app.use('/api/tests', tests);
  app.use(error);
};
