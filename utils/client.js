/**
 * utils/client.js
 * Helper module for interacting with the Captcha Solver API.
 */

const axios = require('axios');
require('dotenv').config();

const API_BASE = "https://api.captcha-solver.com";
const API_KEY = process.env.CAPTCHA_API_KEY;

/**
 * Creates a new task via the Captcha Solver API.
 * @param {Object} taskData - The task configuration object.
 */
async function createTask(taskData) {
    try {
        const response = await axios.post(`${API_BASE}/createTask`, {
            clientKey: API_KEY,
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
 */
async function getTaskResult(taskId) {
    try {
        const response = await axios.post(`${API_BASE}/getTaskResult`, {
            clientKey: API_KEY,
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

module.exports = {
    createTask,
    getTaskResult
};