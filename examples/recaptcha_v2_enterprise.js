/**
 * Example: Solve a reCAPTCHA v2 Enterprise challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and websiteKey with values from your target page.
 *     If the site uses enterprisePayload, extract and pass it or the token may be rejected.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// --- Proxyless example ---
// Solves reCAPTCHA v2 Enterprise without a proxy.
// Enterprise captchas are loaded via the reCAPTCHA Enterprise API.
// If the site passes extra parameters to grecaptcha.enterprise.render(),
// you must pass them as enterprisePayload or the token will be rejected.
async function solveRecaptchaV2EnterpriseProxyless() {
    try {
        // Create a task to solve the reCAPTCHA v2 Enterprise captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "RecaptchaV2EnterpriseTaskProxyless",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // data-sitekey attribute value
                isInvisible: false,                                        // Set True for invisible reCAPTCHA
                // Optional fields (pass only if the target site requires them):
                // enterprisePayload: {"s": "value-from-page"},             // Extra params from grecaptcha.enterprise.render()
                // apiDomain: "recaptcha.net",                               // Set if site loads captcha from recaptcha.net
                // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",  // Browser User-Agent
                // cookies: "session=abc123; token=xyz789"                   // Session cookies if needed
            }
        });
        const taskId = response.data.taskId;

        // Poll for the result until the task is ready.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains {"gRecaptchaResponse": "03AGdBq..."}
                // Pass this token to the g-recaptcha-response field or widget callback.
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before polling again.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveRecaptchaV2EnterpriseProxyless();

// --- With proxy example ---
// Solves reCAPTCHA v2 Enterprise through your own proxy.
// Use when the target site is geo-restricted or you need a consistent session.
async function solveRecaptchaV2EnterpriseWithProxy() {
    try {
        // Create a task with proxy parameters.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "RecaptchaV2EnterpriseTask",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // data-sitekey attribute value
                // Proxy parameters:
                proxyType: "http",       // http, socks4, or socks5
                proxyAddress: "1.2.3.4", // Proxy IP address
                proxyPort: 8080,         // Proxy port
                proxyLogin: "user",      // Login for proxy authorization (optional)
                proxyPassword: "password", // Password for proxy authorization (optional)
                // Optional fields:
                isInvisible: false,
                // enterprisePayload: {"s": "value-from-page"},             // Extra params from grecaptcha.enterprise.render()
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...", // Browser User-Agent
                cookies: "foo=bar; baz=1"                                  // Session cookies if needed
            }
        });
        const taskId = response.data.taskId;

        // Poll for the result until the task is ready.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains the same gRecaptchaResponse token.
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before polling again.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveRecaptchaV2EnterpriseWithProxy();