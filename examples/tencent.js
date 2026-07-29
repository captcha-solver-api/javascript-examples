/**
 * Example: Solve a Tencent captcha challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and appId with values from your target page.
 *     Pass captchaScript if the site uses a non-default script URL.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// --- Proxyless example ---
// Solves Tencent captcha without a proxy.
// The service proxies are used to solve the captcha.
async function solveTencentProxyless() {
    try {
        // Step 1: Create a task to solve the Tencent captcha.
        // appId is found in the page source code. captchaScript is optional if the site uses the default.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "TencentTaskProxyless",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                appId: "190014885",                                        // appId from page source code (required)
                // Optional fields:
                // captchaScript: "https://turing.captcha.qcloud.com/TCaptcha.js"  // Custom script URL if non-default
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
                // Solution contains {"appid": "...", "ret": 0, "ticket": "...", "randstr": "..."}
                // Pass all four values together into the page's captcha callback as-is.
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

solveTencentProxyless();

// --- With proxy example ---
// Solves Tencent captcha through your own proxy.
// Use when the target site is geo-restricted or you need a consistent session.
async function solveTencentWithProxy() {
    try {
        // Step 1: Create a task with proxy parameters.
        // Your proxy IP will be used to access the target site and solve the captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "TencentTask",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                appId: "190014885",                                        // appId from page source code (required)
                // Proxy parameters:
                proxyType: "http",       // http, socks4, or socks5
                proxyAddress: "1.2.3.4", // Proxy IP address
                proxyPort: 8080,         // Proxy port
                proxyLogin: "user",      // Login for proxy authorization (optional)
                proxyPassword: "password" // Password for proxy authorization (optional)
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
                // Solution contains the same appid, ret, ticket, and randstr values.
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

solveTencentWithProxy();