/**
 * Example: Solve a click-based image captcha using CoordinatesTask.
 *
 * Prerequisites:
 *     Set the CAPTCHA_API_KEY environment variable in a .env file.
 *     Provide the captcha image as base64 in the body parameter.
 *     Use comment to tell the worker what to click on the image.
 *     No proxy is required. The image is submitted directly to the service.
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
// Solves a simple click-based captcha with a hint for the worker.
async function solveCoordinatesBasic() {
    try {
        // Step 1: Create a task to solve the click-based captcha.
        // The worker will click on the specified points on the image.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "CoordinatesTask",
                body: body,                              // Base64-encoded captcha image (required)
                comment: "click on the green apple"      // Text hint for the worker
            }
        });
        const taskId = response.data.taskId;

        // Step 2: Poll for the result until the task is ready.
        // The API processes the captcha asynchronously. Check the status periodically.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains {"coordinates": [{"x": 358, "y": 268}]}
                // Click on each coordinate in order. Coordinates are pixel positions.
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

solveCoordinatesBasic();

// --- Advanced example ---
// Solves a captcha with instruction image and click count limits.
async function solveCoordinatesAdvanced() {
    try {
        // Read and encode an optional instruction image.
        // This image helps the worker understand what to click.
        const imgInstructions = fs.readFileSync("./instruction.png", { encoding: "base64" });

        // Step 1: Create a task with more options.
        const response = await axios.post("https://api.captcha-solver.com/createTask", {
            clientKey: apiKey,
            task: {
                type: "CoordinatesTask",
                body: body,                              // Base64-encoded captcha image
                comment: "click on all traffic lights",  // Text hint for the worker
                imgInstructions: imgInstructions,        // Optional instruction image
                minClicks: 1,                            // Minimum number of clicks (default 1)
                maxClicks: 3                             // Maximum number of clicks allowed
            }
        });
        const taskId = response.data.taskId;

        // Step 2: Poll for the result until the task is ready.
        while (true) {
            const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
                clientKey: apiKey,
                taskId: taskId
            });
            if (result.data.status === "ready") {
                // Solution contains coordinates for all requested clicks.
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

solveCoordinatesAdvanced();