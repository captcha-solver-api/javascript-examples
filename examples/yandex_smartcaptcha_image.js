/**
 * Example: Solve a Yandex SmartCaptcha image challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Provide the captcha image and instruction image as base64.
 *     Use imgType to specify smart_captcha (select objects) or pazl_smart_captcha (puzzle).
 *     For smart_captcha, imgInstructions is required.
 */

const fs = require('fs');
const { solveCaptcha } = require('../utils/client');
const { validateConfig } = require('../utils/config');

// Fail early with a clear message if the API key is missing.
validateConfig();

// --- Option 1: Selecting objects by instruction (smart_captcha) ---
// The worker selects objects on the captcha image following the instruction image.
// imgInstructions is required. Without it, the worker may misunderstand the task.
async function solveYandexSmartCaptchaObjects() {
    // Read and encode the captcha image to base64.
    // The body must be a pure base64 string without the data:image/...;base64, prefix.
    const body = fs.readFileSync("./captcha.png", { encoding: "base64" });

    // Read and encode the instruction image to base64.
    // This image shows the worker what objects to click and in what order.
    const imgInstructions = fs.readFileSync("./instruction.png", { encoding: "base64" });

    const solution = await solveCaptcha({
        type: "CoordinatesTask",
        body: body,                                                   // Base64-encoded captcha image (required)
        imgType: "smart_captcha",                                     // smart_captcha for object selection
        imgInstructions: imgInstructions,                             // Instruction image (required for smart_captcha)
        comment: "select objects in the order of the instruction"     // Text hint for the worker (recommended)
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains {"coordinates": [{"x": 57, "y": 82}, {"x": 239, "y": 75}, ...]}
    // Click on each coordinate in order as the instruction indicates.
    console.log("result: " + JSON.stringify(solution));
}

solveYandexSmartCaptchaObjects();

// --- Option 2: Puzzle captcha (pazl_smart_captcha) ---
// The worker solves a puzzle by dragging a slider to the correct position.
// Only body and imgType are required. No instruction image is needed.
async function solveYandexSmartCaptchaPuzzle() {
    // Read and encode the puzzle captcha image to base64.
    const body = fs.readFileSync("./puzzle.png", { encoding: "base64" });

    const solution = await solveCaptcha({
        type: "CoordinatesTask",
        body: body,                    // Base64-encoded puzzle image (required)
        imgType: "pazl_smart_captcha"  // pazl_smart_captcha for puzzle solving
    });

    if (!solution) {
        process.exit(1);
    }

    // Solution contains coordinates with the slider position.
    console.log("result: " + JSON.stringify(solution));
}

solveYandexSmartCaptchaPuzzle();
