const paypal = require('paypal-rest-sdk');
require('dotenv').config();

paypal.configure({
  'mode': process.env.PAYPAI_TYPE,
  'client_id': process.env.PAYPAI_ID,
  'client_secret': process.env.PAYPAL_SECRET
});

module.exports = paypal;
