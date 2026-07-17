/**
 * utils/config.js
 * Configuration settings for the Captcha Solver API.
 */

require('dotenv').config();

module.exports = {
    // API base URL
    API_BASE: "https://api.captcha-solver.com",

    // API Key loaded from environment variables
    API_KEY: process.env.CAPTCHA_API_KEY,

    // Polling configuration (time in milliseconds)
    POLLING_INTERVAL: 5000,
    MAX_RETRIES: 20,

    // Helper to check if API key is present
    validateConfig: () => {
        if (!process.env.CAPTCHA_API_KEY) {
            console.error("[-] Error: CAPTCHA_API_KEY is not defined in .env file.");
            process.exit(1);
        }
    }
};