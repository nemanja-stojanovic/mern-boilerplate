const bcrypt = require('bcryptjs');
const express = require('express');
const crypto = require('crypto');
const _ = require('lodash');
const sendResetLink = require('../utils/sendResetLink');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User with this email already registered.');

  user = new User(
    _.pick(req.body, ['name', 'email', 'password'])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        'name',
        'email',
        'password'
      ])
    },
    { new: true }
  );

  if (!user) return res.status(404).send('The user with given ID was not found.');
  res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) {
    return res.status(404).send('The user with given ID was not found.');
  }

  res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/recovery', async (req, res) => {
  const { credentials } = req.body;
  const user = isNaN(credentials)
    ? await User.findOne({ email: credentials })
    : await User.findOne({ phone: credentials });
  if (!user) {
    return res
      .status(404)
      .send(`The user with given ${isNaN(credentials) ? 'email' : 'phone'} was not found.`);
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // one hour;
  user.save();

  sendResetLink(user, token);
  res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/check-token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() }
  }).select('_id');

  if (!user) return res.status(404).send('Password reset link is invalid or has expired.');
  return res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/reset/:id', async (req, res) => {
  const { newPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword, salt);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    },
    { new: true }
  );

  if (!user) return res.status(404).send('The user with given ID was not found.');
  res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
