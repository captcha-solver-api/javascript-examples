/**
 * utils/client.js
 * Helper module for interacting with the Captcha Solver API.
 *
 * The examples import these helpers instead of calling axios directly,
 * so the request, error checking and polling logic lives in one place.
 */

const axios = require('axios');
const config = require('./config');

/**
 * Creates a new task via the Captcha Solver API.
 * @param {Object} taskData - The task configuration object.
 * @returns {Promise<string|null>} The task ID, or null on error.
 */
async function createTask(taskData) {
    try {
        const response = await axios.post(`${config.API_BASE}/createTask`, {
            clientKey: config.API_KEY,
            task: taskData
        });

        // Always check errorId: 0 indicates success
        if (response.data.errorId !== 0) {
            console.error("[-] API Error during task creation:", response.data);
            return null;
        }

        console.log(`[+] Task created. ID: ${response.data.taskId}`);
        return response.data.taskId;
    } catch (error) {
        console.error("[-] Connection error:", error.message);
        return null;
    }
}

/**
 * Polls the API to retrieve the result of a specific task.
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Promise<Object|null>} The full response body, or null on error.
 */
async function getTaskResult(taskId) {
    try {
        const response = await axios.post(`${config.API_BASE}/getTaskResult`, {
            clientKey: config.API_KEY,
            taskId: taskId
        });

        if (response.data.errorId !== 0) {
            console.error("[-] API Error during polling:", response.data);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("[-] Polling error:", error.message);
        return null;
    }
}

/**
 * Polls getTaskResult until the task is ready or the retry limit is reached.
 * The API solves captchas asynchronously, so the status has to be checked periodically.
 * @param {string} taskId - The ID of the task to wait for.
 * @param {Object} [options] - Overrides for the polling defaults in config.js.
 * @param {number} [options.pollingInterval] - Delay between polls, in milliseconds.
 * @param {number} [options.maxRetries] - Maximum number of polls before giving up.
 * @returns {Promise<Object|null>} The solution object, or null on error/timeout.
 */
async function waitForResult(taskId, options = {}) {
    const pollingInterval = options.pollingInterval || config.POLLING_INTERVAL;
    const maxRetries = options.maxRetries || config.MAX_RETRIES;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await getTaskResult(taskId);

        // An API or connection error was already logged, retrying will not help.
        if (result === null) {
            return null;
        }

        if (result.status === "ready") {
            return result.solution;
        }

        // Status is "processing": wait before checking again.
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
    }

    console.error(`[-] Timeout: task ${taskId} was not solved after ${maxRetries} polls.`);
    return null;
}

/**
 * Creates a task and waits for its solution. This is the entry point the examples use.
 * @param {Object} taskData - The task configuration object.
 * @param {Object} [options] - Polling overrides, see waitForResult.
 * @returns {Promise<Object|null>} The solution object, or null on error/timeout.
 */
async function solveCaptcha(taskData, options) {
    const taskId = await createTask(taskData);

    if (!taskId) {
        return null;
    }

    return waitForResult(taskId, options);
}

/**
 * Retrieves the current account balance.
 * @returns {Promise<number|null>} The balance, or null on error.
 */
async function getBalance() {
    try {
        const response = await axios.post(`${config.API_BASE}/getBalance`, {
            clientKey: config.API_KEY
        });

        if (response.data.errorId !== 0) {
            console.error("[-] API Error during balance check:", response.data);
            return null;
        }

        return response.data.balance;
    } catch (error) {
        console.error("[-] Connection error:", error.message);
        return null;
    }
}

module.exports = {
    createTask,
    getTaskResult,
    waitForResult,
    solveCaptcha,
    getBalance
};
