/**
 * Example: Solve a Yandex SmartCaptcha challenge (token-based).
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Replace websiteURL and websiteKey with values from your target page.
 *     This example uses the token-based method. For image-based solving, see the Coordinates example.
 */

const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// --- Proxyless example ---
// Solves Yandex SmartCaptcha without a proxy.
// The service proxies are used to solve the captcha.
async function solveYandexSmartCaptchaProxyless() {
    // websiteKey is the sitekey value from the page code or captcha iframe.
    const solution = await solveCaptcha({
        type: "YandexSmartCaptchaTaskProxyless",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        websiteKey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxK4OoR",    // sitekey from page code or iframe
        // Optional fields:
        // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",  // Browser User-Agent
        // cookies: "session=abc123; token=xyz789"                  // Session cookies if needed
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"token": "dV9xNjYyNTU3NjkxO4k9OTQuNVMuMjkuMjM9..."}
    // Use solution.token in the smart-token field or pass to your site's backend.
    console.log("result: " + JSON.stringify(solution));
}

solveYandexSmartCaptchaProxyless();

// --- With proxy example ---
// Solves Yandex SmartCaptcha through your own proxy.
// Note: this is the only captcha type where https proxy is accepted.
async function solveYandexSmartCaptchaWithProxy() {
    const solution = await solveCaptcha({
        type: "YandexSmartCaptchaTask",
        websiteURL: "https://example.com/login",                   // Full URL of the page with captcha
        websiteKey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxK4OoR",    // sitekey from page code or iframe
        // Proxy parameters:
        proxyType: "http",         // http, https, socks4, or socks5 (https is accepted only for this type)
        proxyAddress: "1.2.3.4",   // Proxy IP address
        proxyPort: 8080,           // Proxy port
        proxyLogin: "user",        // Login for proxy authorization (optional)
        proxyPassword: "password", // Password for proxy authorization (optional)
        // Optional fields:
        // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",  // Browser User-Agent
        // cookies: "session=abc123; token=xyz789"                  // Session cookies if needed
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains the same token.
    console.log("result: " + JSON.stringify(solution));
}

solveYandexSmartCaptchaWithProxy();
