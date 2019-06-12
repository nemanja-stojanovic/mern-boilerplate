const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Number
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
    },
    config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string()
      .min(1)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(1)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
exports.userSchema = userSchema;
