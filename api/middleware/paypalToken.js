const axios = require('axios');

/**
 * Fetches the PayPal access token using client credentials.
 *
 * @async
 * @function getPaypalAccessToken
 * @returns {Promise<string>} The PayPal access token.
 * @throws Will throw an error if the request fails.
 */
async function getPaypalAccessToken() {
  let clientId = process.env.PAYPAI_ID;
  let clientSecret = process.env.PAYPAL_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post('https://api-m.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials&scope=financial:reporting',
      {
          headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });

  return response.data.access_token;
}

module.exports = { getPaypalAccessToken };