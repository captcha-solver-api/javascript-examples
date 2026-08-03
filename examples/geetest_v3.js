/**
 * Example: Solve a GeeTest v3 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL, gt, and challenge with values from your target page.
 *     Important: the challenge value is dynamic. Fetch a fresh one for each request.
 */

const axios = require('axios');
const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// GeeTest tasks take longer than average, so poll less often than the default.
const pollingOptions = { pollingInterval: 10000 };

/**
 * Important: the value of the 'challenge' parameter is dynamic.
 * For each request to the API you need to get a new value from the target page.
 * Below is an example of fetching it from a demo endpoint.
 * In production, extract this from the page's initGeetest call or network requests.
 *
 * This request goes to the target site, not to the Captcha Solver API,
 * so it uses axios directly instead of the shared client.
 */
async function getChallenge() {
    const resp = await axios.get("https://target-site.com/path/to/geetest/init");
    return resp.data.challenge;
}

// --- Proxyless example ---
// Solves GeeTest v3 without a proxy.
// v3 is the default version, so the version field can be omitted.
async function solveGeeTestV3Proxyless() {
    let challenge;

    try {
        challenge = await getChallenge();
    } catch (error) {
        console.error("[-] Could not fetch a fresh challenge:", error.message);
        process.exit(1);
    }

    const solution = await solveCaptcha({
        type: "GeeTestTaskProxyless",
        websiteURL: "https://example.com/login",             // Full URL of the page with GeeTest
        gt: "f2ae6cadcf7886856696c46d84d109d1",              // Public key of the GeeTest widget
        challenge: challenge,                                // Session-specific value, must be fresh
        // Optional fields:
        // geetestApiServerSubdomain: "api-na.geetest.com",  // Custom API subdomain
        // initParameters: {},                               // Extra params from initGeetest call
        // userAgent: "Mozilla/5.0 ..."                      // Browser User-Agent
    }, pollingOptions);

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"challenge": "...", "validate": "...", "seccode": "..."}
    // Pass solution.validate and solution.seccode to the page's GeeTest callback.
    console.log("result: " + JSON.stringify(solution));
}

solveGeeTestV3Proxyless();

// --- With proxy example ---
// Solves GeeTest v3 through your own proxy.
async function solveGeeTestV3WithProxy() {
    let challenge;

    try {
        challenge = await getChallenge();
    } catch (error) {
        console.error("[-] Could not fetch a fresh challenge:", error.message);
        process.exit(1);
    }

    const solution = await solveCaptcha({
        type: "GeeTestTask",
        websiteURL: "https://example.com/login",             // Full URL of the page with GeeTest
        gt: "f2ae6cadcf7886856696c46d84d109d1",              // Public key of the GeeTest widget
        challenge: challenge,                                // Session-specific value, must be fresh
        // Proxy parameters:
        proxyType: "http",         // http, socks4, or socks5
        proxyAddress: "1.2.3.4",   // Proxy IP address
        proxyPort: 8080,           // Proxy port
        proxyLogin: "user",        // Login for proxy authorization (optional)
        proxyPassword: "password"  // Password for proxy authorization (optional)
    }, pollingOptions);

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"challenge": "...", "validate": "...", "seccode": "..."}
    console.log("result: " + JSON.stringify(solution));
}

solveGeeTestV3WithProxy();
