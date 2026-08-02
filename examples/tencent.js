/**
 * Example: Solve a Tencent captcha challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and appId with values from your target page.
 *     Pass captchaScript if the site uses a non-default script URL.
 */

const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// --- Proxyless example ---
// Solves Tencent captcha without a proxy.
// The service proxies are used to solve the captcha.
async function solveTencentProxyless() {
    // appId is found in the page source code. captchaScript is optional if the site uses the default.
    const solution = await solveCaptcha({
        type: "TencentTaskProxyless",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        appId: "190014885",                                        // appId from page source code (required)
        // Optional fields:
        // captchaScript: "https://turing.captcha.qcloud.com/TCaptcha.js"  // Custom script URL if non-default
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"appid": "...", "ret": 0, "ticket": "...", "randstr": "..."}
    // Pass all four values together into the page's captcha callback as-is.
    console.log("result: " + JSON.stringify(solution));
}

solveTencentProxyless();

// --- With proxy example ---
// Solves Tencent captcha through your own proxy.
// Use when the target site is geo-restricted or you need a consistent session.
async function solveTencentWithProxy() {
    const solution = await solveCaptcha({
        type: "TencentTask",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        appId: "190014885",                                        // appId from page source code (required)
        // Proxy parameters:
        proxyType: "http",         // http, socks4, or socks5
        proxyAddress: "1.2.3.4",   // Proxy IP address
        proxyPort: 8080,           // Proxy port
        proxyLogin: "user",        // Login for proxy authorization (optional)
        proxyPassword: "password"  // Password for proxy authorization (optional)
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains the same appid, ret, ticket, and randstr values.
    console.log("result: " + JSON.stringify(solution));
}

solveTencentWithProxy();
