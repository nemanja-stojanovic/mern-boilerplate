const express = require('express');
const _ = require('lodash');
const { Test, validate } = require('../models/test');
// const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const allTests = await Test.find();
  res.send(allTests);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const test = new Test(
    _.pick(req.body, ['name'])
  );

  try {
    await test.save();
    res.send(test);
  } catch (ex) {
    for (const field in ex.errors) {
      if (Object.prototype.hasOwnProperty.call(ex.errors, field)) {
        winston.error(ex.errors[field].message);
      }
    }
  }
});

module.exports = router;
