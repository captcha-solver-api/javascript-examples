/**
 * Example: Solve a click-based image captcha using CoordinatesTask.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Provide the captcha image as base64 in the body parameter.
 *     Use comment to tell the worker what to click on the image.
 *     No proxy is required. The image is submitted directly to the service.
 */

const fs = require('fs');
const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// Read and encode the captcha image to base64.
// The body must be a pure base64 string without the data:image/...;base64, prefix.
const body = fs.readFileSync("./captcha.png", { encoding: "base64" });

// --- Basic example ---
// Solves a simple click-based captcha with a hint for the worker.
// The worker will click on the specified points on the image.
async function solveCoordinatesBasic() {
    const solution = await solveCaptcha({
        type: "CoordinatesTask",
        body: body,                              // Base64-encoded captcha image (required)
        comment: "click on the green apple"      // Text hint for the worker
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"coordinates": [{"x": 358, "y": 268}]}
    // Click on each coordinate in order. Coordinates are pixel positions.
    console.log("result: " + JSON.stringify(solution));
}

solveCoordinatesBasic();

// --- Advanced example ---
// Solves a captcha with instruction image and click count limits.
async function solveCoordinatesAdvanced() {
    // Read and encode an optional instruction image.
    // This image helps the worker understand what to click.
    const imgInstructions = fs.readFileSync("./instruction.png", { encoding: "base64" });

    const solution = await solveCaptcha({
        type: "CoordinatesTask",
        body: body,                              // Base64-encoded captcha image
        comment: "click on all traffic lights",  // Text hint for the worker
        imgInstructions: imgInstructions,        // Optional instruction image
        minClicks: 1,                            // Minimum number of clicks (default 1)
        maxClicks: 3                             // Maximum number of clicks allowed
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains coordinates for all requested clicks.
    console.log("result: " + JSON.stringify(solution));
}

solveCoordinatesAdvanced();
