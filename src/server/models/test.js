const Joi = require('joi');
const mongoose = require('mongoose');

const Test = mongoose.model(
  'Test',
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: true
    },
    lastUpdate: { type: Date, default: Date.now }
  })
);

function validateTest(test) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(test, schema);
}

exports.Test = Test;
exports.validate = validateTest;
