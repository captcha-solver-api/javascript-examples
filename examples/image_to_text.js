/**
 * Example: Solve an Image to Text challenge.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Provide a captcha image file as base64 in the body parameter.
 *     Use optional fields to give hints to the worker for faster solving.
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Load API key from environment variable or set it directly here.
const apiKey = process.env.CAPTCHA_API_KEY || "YOUR_API_KEY";

// Read and encode the captcha image to base64.
// The body must be a pure base64 string without the data:image/...;base64, prefix.
const body = fs.readFileSync("./captcha.png", { encoding: "base64" });

// --- Basic example ---
// Solves a simple image captcha with character set hints.
async function solveImageToTextBasic() {
    try {
        // Create a task to solve the image captcha.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "ImageToTextTask",
                body: body,   // Base64-encoded image (required)
                numeric: 1,   // 1 = digits only
                minLength: 4, // Minimum expected answer length
                maxLength: 6  // Maximum expected answer length
            }
        });
        const taskId = response.data.taskId;

        // Poll for the result until the task is ready.
        // Image to Text tasks are usually fast.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains {"text": "aB3fX9"}
                // Submit solution.text to the target form field.
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before polling again.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveImageToTextBasic();

// --- Advanced example ---
// Solves a math captcha with comment and instruction image.
// Read the hint image as base64.
const imgInstructions = fs.readFileSync("./captcha_hint.png", { encoding: "base64" });

async function solveImageToTextAdvanced() {
    try {
        // Create a task with optional hints for the worker.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "ImageToTextTask",
                body: body,                                          // Base64-encoded captcha image
                // Optional fields (pass only if needed by the captcha type):
                phrase: false,                                       // True if answer has multiple words
                case: true,                                          // True if answer is case-sensitive
                numeric: 0,                                          // 0 = not specified, 1 = digits, 2 = letters, 3 = any with digits, 4 = any with letters
                math: true,                                          // True if image is a math expression to solve
                minLength: 1,                                        // Minimum answer length
                maxLength: 10,                                       // Maximum answer length
                comment: "Enter the result of the equation",         // Text hint for the worker
                imgInstructions: imgInstructions                     // Optional instruction image for the worker
            }
        });
        const taskId = response.data.taskId;

        // Poll for the result until the task is ready.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                console.log("result: " + JSON.stringify(result.data.solution));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before polling again.
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

solveImageToTextAdvanced();