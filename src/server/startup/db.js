const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = () => {
  mongoose
    .connect(config.get('mongoUrl'), { useNewUrlParser: true })
    .then(() => winston.info('Connected to MongoDB...'));
  mongoose.set('useCreateIndex', true);
};
