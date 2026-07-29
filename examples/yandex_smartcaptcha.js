/**
 * Example: Solve a Yandex SmartCaptcha challenge (token-based).
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and websiteKey with values from your target page.
 *     This example uses the token-based method. For image-based solving, see the Coordinates example.
 */

const axios = require('axios');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// --- Proxyless example ---
// Solves Yandex SmartCaptcha without a proxy.
// The service proxies are used to solve the captcha.
async function solveYandexSmartCaptchaProxyless() {
    try {
        // Step 1: Create a task to solve the Yandex SmartCaptcha.
        // websiteKey is the sitekey value from the page code or captcha iframe.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "YandexSmartCaptchaTaskProxyless",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                websiteKey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxK4OoR",   // sitekey from page code or iframe
                // Optional fields:
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
                // Solution contains {"token": "dV9xNjYyNTU3NjkxO4k9OTQuNVMuMjkuMjM9..."}
                // Use solution.token in the smart-token field or pass to your site's backend.
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

solveYandexSmartCaptchaProxyless();

// --- With proxy example ---
// Solves Yandex SmartCaptcha through your own proxy.
// Note: this is the only captcha type where https proxy is accepted.
async function solveYandexSmartCaptchaWithProxy() {
    try {
        // Step 1: Create a task with proxy parameters.
        // Your proxy IP will be used to access the target site and solve the captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "YandexSmartCaptchaTask",
                websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
                websiteKey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxK4OoR",   // sitekey from page code or iframe
                // Proxy parameters:
                proxyType: "http",       // http, https, socks4, or socks5 (https is accepted only for this type)
                proxyAddress: "1.2.3.4", // Proxy IP address
                proxyPort: 8080,         // Proxy port
                proxyLogin: "user",      // Login for proxy authorization (optional)
                proxyPassword: "password", // Password for proxy authorization (optional)
                // Optional fields:
                // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",  // Browser User-Agent
                // cookies: "session=abc123; token=xyz789"                   // Session cookies if needed
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
                // Solution contains the same token.
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

solveYandexSmartCaptchaWithProxy();