/**
 * examples/recaptchaV2.js
 *
 * This example demonstrates how to:
 * 1. Open a page with a Google reCAPTCHA v2 challenge.
 * 2. Extract the sitekey required for solving.
 * 3. Submit the CAPTCHA to the solving API.
 * 4. Poll the API until a solution is ready.
 * 5. Inject the solved token back into the page.
 */

const puppeteer = require('puppeteer');
const { createTask, getTaskResult } = require('../utils/client');
const config = require('../utils/config');

// Validate configuration before starting.
// This ensures required API credentials are available.
config.validateConfig();

/**
 * Solves a Google reCAPTCHA v2 challenge on the current page.
 *
 * @param {import('puppeteer').Page} page
 * @returns {Promise<string|null>} Solved reCAPTCHA token or null on failure.
 */
async function solveRecaptchaV2(page) {
    console.log(`[*] Target URL: ${page.url()}`);

    // Execute JavaScript inside the browser context in order to
    // locate the reCAPTCHA sitekey.
    //
    // First, try the simplest and most common approach:
    // search for an element with the "data-sitekey" attribute.
    //
    // If that fails, inspect Google's internal
    // ___grecaptcha_cfg object, which sometimes contains the
    // sitekey and callback information.
    const siteData = await page.evaluate(() => {
        // Standard integration:
        // <div class="g-recaptcha" data-sitekey="..."></div>
        const el = document.querySelector("[data-sitekey]");

        if (el) {
            return {
                sitekey: el.getAttribute("data-sitekey"),
                callback: null
            };
        }

        // Some websites initialize reCAPTCHA dynamically.
        // In such cases the sitekey can often be found inside
        // Google's internal configuration object.
        if (typeof ___grecaptcha_cfg !== 'undefined') {
            for (const cid in ___grecaptcha_cfg.clients) {
                const client = ___grecaptcha_cfg.clients[cid];

                for (const k1 in client) {
                    const obj = client[k1];

                    if (obj && typeof obj === "object" && obj.sitekey) {
                        return {
                            sitekey: obj.sitekey,
                            callback: obj.callback || null
                        };
                    }
                }
            }
        }

        // No sitekey was found.
        return null;
    });

    // Cannot continue without a valid sitekey.
    if (!siteData || !siteData.sitekey) {
        console.error("[-] Error: Could not find sitekey.");
        return null;
    }

    console.log("[*] Submitting task to API...");

    // Create a CAPTCHA solving task.
    // The API returns a task ID which is later used
    // to request the solving result.
    const taskId = await createTask({
        type: "RecaptchaV2TaskProxyless",
        websiteURL: page.url(),
        websiteKey: siteData.sitekey,
    });

    if (!taskId) {
        return null;
    }

    console.log("[*] Waiting for solution...");

    let token = null;

    // Poll the API until either:
    // - the solution becomes available, or
    // - the maximum number of retries is reached.
    for (let i = 0; i < config.MAX_RETRIES; i++) {

        // Wait before sending the next polling request.
        await new Promise(r => setTimeout(r, config.POLLING_INTERVAL));

        // Request the current task status.
        const result = await getTaskResult(taskId);

        // The CAPTCHA has been solved successfully.
        if (result && result.status === "ready") {
            token = result.solution.gRecaptchaResponse;

            console.log("[+] CAPTCHA solved successfully.");
            break;
        }
    }

    // The API never returned a valid token.
    if (!token) {
        return null;
    }

    // Inject the solved token into all available
    // g-recaptcha-response fields.
    //
    // Dispatch "input" and "change" events so frameworks
    // such as React, Vue, or Angular detect the update.
    //
    // If a callback function was discovered earlier,
    // invoke it as well because some websites rely on it
    // instead of reading the textarea value.
    await page.evaluate((token, callback) => {

        document.querySelectorAll('[name="g-recaptcha-response"]').forEach(el => {
            // Some websites keep this textarea hidden.
            // Making it visible is optional but can simplify debugging.
            el.style.display = 'block';

            // Insert the solved token.
            el.value = token;

            // Notify the page that the value has changed.
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Execute the callback if one exists.
        if (callback && typeof window[callback] === 'function') {
            window[callback](token);
        }

    }, token, siteData.callback);

    return token;
}

(async () => {

    // Launch a Chromium browser.
    // Set headless: false so browser actions are visible.
    const browser = await puppeteer.launch({
        headless: false
    });

    // Open a new browser tab.
    const page = await browser.newPage();

    // Navigate to Google's official reCAPTCHA demo page.
    await page.goto("https://www.google.com/recaptcha/api2/demo");

    // Solve the CAPTCHA.
    const token = await solveRecaptchaV2(page);

    // Print the beginning of the token for verification.
    if (token) {
        console.log(`[+] Final Token: ${token.substring(0, 20)}...`);
    }

    // The browser is intentionally left open so the
    // result can be inspected manually.
    // Uncomment the following line to close it automatically.
    //
    // await browser.close();

})();