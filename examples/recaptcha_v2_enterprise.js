/**
 * Example: Solve a reCAPTCHA v2 Enterprise challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and websiteKey with values from your target page.
 *     If the site uses enterprisePayload, extract and pass it or the token may be rejected.
 */

const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// --- Proxyless example ---
// Solves reCAPTCHA v2 Enterprise without a proxy.
// Enterprise captchas are loaded via the reCAPTCHA Enterprise API.
// If the site passes extra parameters to grecaptcha.enterprise.render(),
// you must pass them as enterprisePayload or the token will be rejected.
async function solveRecaptchaV2EnterpriseProxyless() {
    const solution = await solveCaptcha({
        type: "RecaptchaV2EnterpriseTaskProxyless",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // data-sitekey attribute value
        isInvisible: false,                                        // Set true for invisible reCAPTCHA
        // Optional fields (pass only if the target site requires them):
        // enterprisePayload: {"s": "value-from-page"},             // Extra params from grecaptcha.enterprise.render()
        // apiDomain: "recaptcha.net",                              // Set if site loads captcha from recaptcha.net
        // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",  // Browser User-Agent
        // cookies: "session=abc123; token=xyz789"                  // Session cookies if needed
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"gRecaptchaResponse": "03AGdBq..."}
    // Pass this token to the g-recaptcha-response field or widget callback.
    console.log("result: " + JSON.stringify(solution));
}

solveRecaptchaV2EnterpriseProxyless();

// --- With proxy example ---
// Solves reCAPTCHA v2 Enterprise through your own proxy.
// Use when the target site is geo-restricted or you need a consistent session.
async function solveRecaptchaV2EnterpriseWithProxy() {
    const solution = await solveCaptcha({
        type: "RecaptchaV2EnterpriseTask",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        websiteKey: "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",            // data-sitekey attribute value
        // Proxy parameters:
        proxyType: "http",         // http, socks4, or socks5
        proxyAddress: "1.2.3.4",   // Proxy IP address
        proxyPort: 8080,           // Proxy port
        proxyLogin: "user",        // Login for proxy authorization (optional)
        proxyPassword: "password", // Password for proxy authorization (optional)
        // Optional fields:
        isInvisible: false,
        // enterprisePayload: {"s": "value-from-page"},             // Extra params from grecaptcha.enterprise.render()
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...", // Browser User-Agent
        cookies: "foo=bar; baz=1"                                  // Session cookies if needed
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains the same gRecaptchaResponse token.
    console.log("result: " + JSON.stringify(solution));
}

solveRecaptchaV2EnterpriseWithProxy();
