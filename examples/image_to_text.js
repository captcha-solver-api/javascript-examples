/**
 * Example: Solve an Image to Text challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Provide a captcha image file as base64 in the body parameter.
 *     Use optional fields to give hints to the worker for faster solving.
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
// Solves a simple image captcha with character set hints.
// Image to Text tasks are usually fast.
async function solveImageToTextBasic() {
    const solution = await solveCaptcha({
        type: "ImageToTextTask",
        body: body,   // Base64-encoded image (required)
        numeric: 1,   // 1 = digits only
        minLength: 4, // Minimum expected answer length
        maxLength: 6  // Maximum expected answer length
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"text": "aB3fX9"}
    // Submit solution.text to the target form field.
    console.log("result: " + JSON.stringify(solution));
}

solveImageToTextBasic();

// --- Advanced example ---
// Solves a math captcha with comment and instruction image.
// Read the hint image as base64.
const imgInstructions = fs.readFileSync("./captcha_hint.png", { encoding: "base64" });

async function solveImageToTextAdvanced() {
    const solution = await solveCaptcha({
        type: "ImageToTextTask",
        body: body,                                          // Base64-encoded captcha image
        // Optional fields (pass only if needed by the captcha type):
        phrase: false,                                       // true if answer has multiple words
        case: true,                                          // true if answer is case-sensitive
        numeric: 0,                                          // 0 = not specified, 1 = digits, 2 = letters, 3 = any with digits, 4 = any with letters
        math: true,                                          // true if image is a math expression to solve
        minLength: 1,                                        // Minimum answer length
        maxLength: 10,                                       // Maximum answer length
        comment: "Enter the result of the equation",         // Text hint for the worker
        imgInstructions: imgInstructions                     // Optional instruction image for the worker
    });

    if (!solution) {
        process.exit(1);
    }

    console.log("result: " + JSON.stringify(solution));
}

solveImageToTextAdvanced();
