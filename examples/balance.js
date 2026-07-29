/**
 * Example: Get account balance.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Returns the current available balance of your account.
 */

const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

async function getBalance() {
    try {
        const response = await axios.post("https://api.captcha-solver.com/getBalance", {
            clientKey: apiKey
        });
        const data = response.data;
        if (data.errorId !== 0) {
            console.error(data.errorDescription || "Unknown error");
            process.exit(1);
        }
        console.log("Balance: " + data.balance);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

getBalance();