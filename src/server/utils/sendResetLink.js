/* eslint-disable jsx-a11y/html-has-lang */
/* eslint-disable react/react-in-jsx-scope */
const nodemailer = require('nodemailer');
const winston = require('winston');
const config = require('config');

const sendResetLink = (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.get('adminEmailAddress'),
      pass: config.get('adminEmailPassword')
    }
  });

  const mailOptions = {
    from: `"MERN App" <${config.get('adminEmailAddress')}>`,
    to: user.email,
    subject: 'Link To Reset Password',
    html: `
    <html>
      <body>
        <h3>Hi, ${user.name}</h3>
        <p>You are receiving this because of you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process within <strong>one hour</strong> of receiving it:</p>
        ${config.get('appDomain')}/login/reset-password/${token}
        <p>If you did not requested this, please ignore this email and your password will remain unchanged.</p>
      </body>
    </html>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) winston.error(error.message, error);
    winston.info(`Successfully sent invitation to ${user.email}`);
  });
};

module.exports = sendResetLink;
