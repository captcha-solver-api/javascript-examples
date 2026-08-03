/**
 * Example: Solve a reCAPTCHA v2 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and websiteKey with values from your target page.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// --- Proxyless example ---
// Solves reCAPTCHA v2 without a proxy.
async function solveRecaptchaV2Proxyless() {
    try {
        // Step 1: Create a task to solve the reCAPTCHA v2 captcha.
        // The API returns a taskId that you use to poll for the result.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "RecaptchaV2TaskProxyless",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // data-sitekey attribute value
                isInvisible: false,                                        // Set True for invisible reCAPTCHA
                // Optional fields (pass only if the target site requires them):
                // recaptchaDataSValue: "value-from-page",                  // Value of the data-s attribute (Google Search, YouTube)
                // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",  // Browser User-Agent
                // cookies: "session=abc123; token=xyz789"                   // Session cookies if needed
            }
        });
        const taskId = response.data.taskId;

        // Step 2: Poll for the result until the task is ready.
        // The API processes the captcha asynchronously. Check the status periodically.
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

solveRecaptchaV2Proxyless();

// --- With proxy example ---
// Solves reCAPTCHA v2 through your own proxy.
// Use when the target site is geo-restricted or you need a consistent session.
async function solveRecaptchaV2WithProxy() {
    try {
        // Step 1: Create a task with proxy parameters.
        // Your proxy IP will be used to access the target site and solve the captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "RecaptchaV2Task",
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
                // recaptchaDataSValue: "value-from-page",                  // Value of the data-s attribute (Google Search, YouTube)
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...", // Browser User-Agent
                cookies: "foo=bar; baz=1"                                  // Session cookies if needed
            }
        });
        const taskId = response.data.taskId;

        // Step 2: Poll for the result until the task is ready.
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

solveRecaptchaV2WithProxy();
