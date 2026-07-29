/**
 * Example: Solve a GeeTest v3 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL, gt, and challenge with values from your target page.
 *     Important: the challenge value is dynamic. Fetch a fresh one for each request.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

/**
 * Important: the value of the 'challenge' parameter is dynamic.
 * For each request to the API you need to get a new value from the target page.
 * Below is an example of fetching it from a demo endpoint.
 * In production, extract this from the page's initGeetest call or network requests.
 */
async function getChallenge() {
    const resp = await axios.get("https://target-site.com/path/to/geetest/init");
    return resp.data.challenge;
}

// --- Proxyless example ---
// Solves GeeTest v3 without a proxy.
// v3 is the default version, so the version field can be omitted.
async function solveGeeTestV3Proxyless() {
    try {
        const challenge = await getChallenge();

        // Create a task to solve the GeeTest v3 captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "GeeTestTaskProxyless",
                websiteURL: "https://example.com/login",          // Full URL of the page with GeeTest
                gt: "f2ae6cadcf7886856696c46d84d109d1",           // Public key of the GeeTest widget
                challenge: challenge,                              // Session-specific value, must be fresh
                // Optional fields:
                // geetestApiServerSubdomain: "api-na.geetest.com", // Custom API subdomain
                // initParameters: {},                               // Extra params from initGeetest call
                // userAgent: "Mozilla/5.0 ..."                      // Browser User-Agent
            }
        });
        const taskId = response.data.taskId;

        // Poll for the result until the task is ready.
        // GeeTest tasks may take longer. Increase timeout if needed.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains {"challenge": "...", "validate": "...", "seccode": "..."}
                // Pass solution.validate and solution.seccode to the page's GeeTest callback.
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before polling again.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveGeeTestV3Proxyless();

// --- With proxy example ---
// Solves GeeTest v3 through your own proxy.
async function solveGeeTestV3WithProxy() {
    try {
        const challenge = await getChallenge();

        // Create a task with proxy parameters.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "GeeTestTask",
                websiteURL: "https://example.com/login",          // Full URL of the page with GeeTest
                gt: "f2ae6cadcf7886856696c46d84d109d1",           // Public key of the GeeTest widget
                challenge: challenge,                              // Session-specific value, must be fresh
                // Proxy parameters:
                proxyType: "http",       // http, socks4, or socks5
                proxyAddress: "1.2.3.4", // Proxy IP address
                proxyPort: 8080,         // Proxy port
                proxyLogin: "user",      // Login for proxy authorization (optional)
                proxyPassword: "password" // Password for proxy authorization (optional)
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
                // Solution contains {"challenge": "...", "validate": "...", "seccode": "..."}
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before polling again.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveGeeTestV3WithProxy();