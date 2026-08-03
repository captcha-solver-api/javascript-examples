/**
 * Example: Solve a reCAPTCHA v3 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL, websiteKey, minScore, and pageAction with values from your target page.
 *     reCAPTCHA v3 does not require a proxy. It is solved from the service IP addresses.
 */

const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// --- Proxyless example ---
// Solves reCAPTCHA v3 without a proxy.
// A proxy is not required for v3. Tasks are solved from the service IP addresses.
// The higher the minScore, the harder and longer the task takes to solve.
async function solveRecaptchaV3() {
    // pageAction is the value of the action parameter the site sets when calling grecaptcha.execute().
    // Passing it increases the chance of the site accepting the token.
    const solution = await solveCaptcha({
        type: "RecaptchaV3TaskProxyless",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // Site key of the reCAPTCHA v3 widget
        minScore: 0.7,                                             // Minimum acceptable token score (0.1 to 0.9)
        pageAction: "verify",                                      // Action value from grecaptcha.execute() call
        // Optional fields:
        // isEnterprise: false,                                     // Set true for reCAPTCHA v3 Enterprise
        // apiDomain: "www.recaptcha.net"                           // Set if site loads from recaptcha.net
    }, {
        // v3 tasks take longer, especially with a high minScore. Poll less often.
        pollingInterval: 10000
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"gRecaptchaResponse": "03AGdBq..."}
    // Use this token just like a regular reCAPTCHA v3 token.
    console.log("result: " + JSON.stringify(solution));
}

solveRecaptchaV3();
