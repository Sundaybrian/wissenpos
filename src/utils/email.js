require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const apikey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(apikey);

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = 'noreply.wissensof.com' }) {
  const msg = {
    to,
    subject,
    html,
    from,
  };

  await sgMail.send(msg);
}
