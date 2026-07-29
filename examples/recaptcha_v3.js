/**
 * Example: Solve a reCAPTCHA v3 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL, websiteKey, minScore, and pageAction with values from your target page.
 *     reCAPTCHA v3 does not require a proxy. It is solved from the service IP addresses.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// --- Proxyless example ---
// Solves reCAPTCHA v3 without a proxy.
// A proxy is not required for v3. Tasks are solved from the service IP addresses.
// The higher the minScore, the harder and longer the task takes to solve.
async function solveRecaptchaV3() {
    try {
        // Step 1: Create a task to solve the reCAPTCHA v3 captcha.
        // pageAction is the value of the action parameter the site sets when calling grecaptcha.execute().
        // Passing it increases the chance of the site accepting the token.
        // Set isEnterprise to True if the site uses reCAPTCHA v3 Enterprise.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "RecaptchaV3TaskProxyless",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // Site key of the reCAPTCHA v3 widget
                minScore: 0.7,                                             // Minimum acceptable token score (0.1 to 0.9)
                pageAction: "verify",                                      // Action value from grecaptcha.execute() call
                // Optional fields:
                // isEnterprise: false,                                     // Set True for reCAPTCHA v3 Enterprise
                // apiDomain: "www.recaptcha.net"                           // Set if site loads from recaptcha.net
            }
        });
        const taskId = response.data.taskId;

        // Step 2: Poll for the result until the task is ready.
        // The API processes the captcha asynchronously. Check the status periodically.
        // Higher minScore values will take longer to solve.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains {"gRecaptchaResponse": "03AGdBq..."}
                // Use this token just like a regular reCAPTCHA v3 token.
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before polling again. v3 tasks take longer.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveRecaptchaV3();