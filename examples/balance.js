/**
 * Example: Get account balance.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Returns the current available balance of your account.
 */

const client = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

async function showBalance() {
    const balance = await client.getBalance();

    if (balance === null) {
        process.exit(1);
    }

    console.log("Balance: " + balance);
}

showBalance();
