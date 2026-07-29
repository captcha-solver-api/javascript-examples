/**
 * Example: Solve a GeeTest v4 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and captcha_id with values from your target page.
 *     GeeTest v4 drops gt/challenge entirely. It uses captcha_id instead.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// --- Proxyless example ---
// Solves GeeTest v4 without a proxy.
// v4 drops gt/challenge. The widget is identified by captcha_id inside initParameters.
async function solveGeeTestV4Proxyless() {
    try {
        // Create a task to solve the GeeTest v4 captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "GeeTestTaskProxyless",
                websiteURL: "https://example.com/login",                   // Full URL of the page with GeeTest v4
                version: 4,                                                // Required: must be 4 for this version
                initParameters: {                                          // Required: must contain captcha_id
                    captcha_id: "e392e1d7fd421dc63325744d5a2b9c73"         // Static site identifier
                }
                // Optional fields:
                // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."  // Browser User-Agent
            }
        });
        const taskId = response.data.taskId;

        // Poll for the result until the task is ready.
        // GeeTest v4 tasks may take longer. Increase timeout if needed.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains {"captcha_id": "...", "lot_number": "...", "pass_token": "...", "gen_time": "...", "captcha_output": "..."}
                // Pass these values together into the page's GeeTest v4 callback as-is.
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

solveGeeTestV4Proxyless();

// --- With proxy example ---
// Solves GeeTest v4 through your own proxy.
async function solveGeeTestV4WithProxy() {
    try {
        // Create a task with proxy parameters.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "GeeTestTask",
                websiteURL: "https://example.com/login",                   // Full URL of the page with GeeTest v4
                version: 4,                                                // Required: must be 4 for this version
                initParameters: {                                          // Required: must contain captcha_id
                    captcha_id: "e392e1d7fd421dc63325744d5a2b9c73"         // Static site identifier
                },
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
                // Solution contains {"captcha_id": "...", "lot_number": "...", "pass_token": "...", "gen_time": "...", "captcha_output": "..."}
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

solveGeeTestV4WithProxy();