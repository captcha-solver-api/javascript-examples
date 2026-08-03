/**
 * Example: Solve a GeeTest v4 challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and captcha_id with values from your target page.
 *     GeeTest v4 drops gt/challenge entirely. It uses captcha_id instead.
 */

const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// GeeTest v4 tasks take longer than average, so poll less often than the default.
const pollingOptions = { pollingInterval: 10000 };

// --- Proxyless example ---
// Solves GeeTest v4 without a proxy.
// v4 drops gt/challenge. The widget is identified by captcha_id inside initParameters.
async function solveGeeTestV4Proxyless() {
    const solution = await solveCaptcha({
        type: "GeeTestTaskProxyless",
        websiteURL: "https://example.com/login",                   // Full URL of the page with GeeTest v4
        version: 4,                                                // Required: must be 4 for this version
        initParameters: {                                          // Required: must contain captcha_id
            captcha_id: "e392e1d7fd421dc63325744d5a2b9c73"         // Static site identifier
        }
        // Optional fields:
        // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."  // Browser User-Agent
    }, pollingOptions);

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"captcha_id": "...", "lot_number": "...", "pass_token": "...", "gen_time": "...", "captcha_output": "..."}
    // Pass these values together into the page's GeeTest v4 callback as-is.
    console.log("result: " + JSON.stringify(solution));
}

solveGeeTestV4Proxyless();

// --- With proxy example ---
// Solves GeeTest v4 through your own proxy.
async function solveGeeTestV4WithProxy() {
    const solution = await solveCaptcha({
        type: "GeeTestTask",
        websiteURL: "https://example.com/login",                   // Full URL of the page with GeeTest v4
        version: 4,                                                // Required: must be 4 for this version
        initParameters: {                                          // Required: must contain captcha_id
            captcha_id: "e392e1d7fd421dc63325744d5a2b9c73"         // Static site identifier
        },
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

    // Solution contains {"captcha_id": "...", "lot_number": "...", "pass_token": "...", "gen_time": "...", "captcha_output": "..."}
    console.log("result: " + JSON.stringify(solution));
}

solveGeeTestV4WithProxy();
