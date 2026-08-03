/**
 * Example: Solve a Cloudflare Turnstile challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and websiteKey with values from your target page.
 *     Pass action, data, and pageData if the target site uses them.
 *     Always pass userAgent for complex pages like Cloudflare Challenge.
 */

const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// --- Proxyless example ---
// Solves Cloudflare Turnstile without a proxy.
// The token is tied to the User-Agent, so pass the same one your browser or bot uses.
async function solveTurnstileProxyless() {
    // Pass action, data (cData), or pageData if the site uses them.
    // For Cloudflare Challenge pages, you need to intercept turnstile.render to get these values.
    const solution = await solveCaptcha({
        type: "TurnstileTaskProxyless",
        websiteURL: "https://example.com/login",                   // Full URL of the page with Turnstile
        websiteKey: "0x4AAAAAAAVrOwQWPlm3Bnr5",                    // data-sitekey attribute value
        // Optional fields (pass only if the target site uses them):
        // action: "login",                                         // Value of data-action attribute
        // data: "custom-cdata-value",                              // Value of data-cdata attribute
        // pageData: "chl-page-data-value",                         // Value of chlPageData parameter
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..." // User-Agent your browser or bot uses
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"token": "0.zxcv..."}
    // Pass this token to the cf-turnstile-response field or widget callback.
    console.log("result: " + JSON.stringify(solution));
}

solveTurnstileProxyless();

// --- With proxy example ---
// Solves Cloudflare Turnstile through your own proxy.
// Use when the target site is geo-restricted or you need a consistent session.
async function solveTurnstileWithProxy() {
    const solution = await solveCaptcha({
        type: "TurnstileTask",
        websiteURL: "https://example.com/login",                   // Full URL of the page with Turnstile
        websiteKey: "0x4AAAAAAAVrOwQWPlm3Bnr5",                    // data-sitekey attribute value
        // Proxy parameters:
        proxyType: "http",         // http, socks4, or socks5
        proxyAddress: "1.2.3.4",   // Proxy IP address
        proxyPort: 8080,           // Proxy port
        proxyLogin: "user",        // Login for proxy authorization (optional)
        proxyPassword: "password", // Password for proxy authorization (optional)
        // Optional fields:
        // action: "login",                                         // Value of data-action attribute
        // data: "custom-cdata-value",                              // Value of data-cdata attribute
        // pageData: "chl-page-data-value",                         // Value of chlPageData parameter
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..." // User-Agent your browser or bot uses
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains the same token.
    console.log("result: " + JSON.stringify(solution));
}

solveTurnstileWithProxy();
