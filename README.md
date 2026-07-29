# Captcha Solver API JavaScript Examples

![js-examples-banner](assets/repo-banner-javascript.png)

A collection of examples for interacting with the [Captcha Solver](https://captcha-solver.com/) service using Node.js.

This project demonstrates how to send HTTP requests to the API for solving CAPTCHA challenges. You will find examples for reCAPTCHA v2, reCAPTCHA v3, Cloudflare Turnstile, Yandex SmartCaptcha, GeeTest, Tencent, and image-based tasks. The code helps automate task creation, status polling, and result retrieval.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported CAPTCHA Types](#supported-types)
- [Usage Examples](#usage-examples)
  - [reCAPTCHA v2](#recaptcha-v2)
  - [reCAPTCHA v2 Enterprise](#recaptcha-v2-enterprise)
  - [reCAPTCHA v3](#recaptcha-v3)
  - [Cloudflare Turnstile](#cloudflare-turnstile)
  - [Yandex SmartCaptcha](#yandex-smartcaptcha)
  - [Image to Text](#image-to-text)
  - [Coordinates](#coordinates)
  - [GeeTest v3](#geetest-v3)
  - [GeeTest v4](#geetest-v4)
  - [Tencent](#tencent)
  - [Check Balance](#check-balance)
  - [Custom Timeout and Polling](#custom-timeout-and-polling)
  - [Error Handling](#error-handling)
- [Requirements](#requirements)
- [API Documentation](#api-documentation)
- [License](#license)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/captcha-solver-api/js-examples.git
cd js-examples
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```text
CAPTCHA_API_KEY=your_api_key
```

Run an example:

```bash
node examples/recaptcha_v2.js
```

---

## Quick Start

This single example solves a reCAPTCHA v2. It creates a task, polls for the result, and prints the solution token.

```javascript
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.CAPTCHA_API_KEY;

async function solveRecaptchaV2() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: API_KEY,
        task: {
            type: "RecaptchaV2TaskProxyless",
            websiteURL: "https://example.com/login",
            websiteKey: "SITE_KEY"
        }
    });

    const taskId = response.data.taskId;

    while (true) {
        const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
            clientKey: API_KEY,
            taskId: taskId
        });

        if (result.data.status === "ready") {
            console.log(result.data.solution.gRecaptchaResponse);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

solveRecaptchaV2();
```

---

## Supported Types

| Type | Proxyless | With Proxy |
|---|---|---|
| reCAPTCHA v2 | ✅ | ✅ |
| reCAPTCHA v2 Enterprise | ✅ | ✅ |
| reCAPTCHA v3 | ✅ | ❌ |
| Cloudflare Turnstile | ✅ | ✅ |
| Yandex SmartCaptcha (token) | ✅ | ✅ |
| Yandex SmartCaptcha (image) | ✅ | ❌ |
| Image to Text | ✅ | ❌ |
| Coordinates | ✅ | ❌ |
| GeeTest v3 | ✅ | ✅ |
| GeeTest v4 | ✅ | ✅ |
| Tencent | ✅ | ✅ |

---

## Usage Examples

### reCAPTCHA v2

Uses `RecaptchaV2TaskProxyless`. Add `isInvisible`, `userAgent`, or `cookies` if your target page requires them. Use `RecaptchaV2Task` for your own proxy. See the official docs for reCAPTCHA v2 parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#recaptcha-v2).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveRecaptchaV2() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "RecaptchaV2TaskProxyless",
            websiteURL: "https://example.com",
            websiteKey: "SITE_KEY",
            isInvisible: false
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveRecaptchaV2();
```

### reCAPTCHA v2 Enterprise

Uses `RecaptchaV2EnterpriseTaskProxyless`. Pass `enterprisePayload` if the site uses `grecaptcha.enterprise.render` with extra parameters. Use `RecaptchaV2EnterpriseTask` for your own proxy. See the official docs for reCAPTCHA v2 Enterprise parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#recaptcha-v2-enterprise).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveRecaptchaV2Enterprise() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "RecaptchaV2EnterpriseTaskProxyless",
            websiteURL: "https://example.com",
            websiteKey: "SITE_KEY",
            enterprisePayload: { s: "SITE_SPECIFIC_DATA" }
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveRecaptchaV2Enterprise();
```

### reCAPTCHA v3

Uses `RecaptchaV3TaskProxyless`. Set `minScore` to the required threshold. Pass `pageAction` if known. Set `isEnterprise` to `true` for reCAPTCHA v3 Enterprise. See the official docs for reCAPTCHA v3 parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#recaptcha-v3).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveRecaptchaV3() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "RecaptchaV3TaskProxyless",
            websiteURL: "https://example.com",
            websiteKey: "SITE_KEY",
            minScore: 0.3,
            pageAction: "login"
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveRecaptchaV3();
```

### Cloudflare Turnstile

Uses `TurnstileTaskProxyless`. Pass `action`, `data` (cData), or `pageData` if the site uses them. Always pass `userAgent` for complex pages like Cloudflare Challenge. Use `TurnstileTask` for your own proxy. See the official docs for Cloudflare Turnstile parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#cloudflare-turnstile).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveTurnstile() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "TurnstileTaskProxyless",
            websiteURL: "https://example.com",
            websiteKey: "SITE_KEY"
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveTurnstile();
```

### Yandex SmartCaptcha

Token-based solving uses `YandexSmartCaptchaTaskProxyless` or `YandexSmartCaptchaTask`. Image-based solving uses `CoordinatesTask` with `imgType` set to `smart_captcha` or `pazl_smart_captcha`. See the Coordinates section for image examples. See the official docs for Yandex SmartCaptcha parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#yandex-smartcaptcha).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveYandexSmartCaptcha() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "YandexSmartCaptchaTaskProxyless",
            websiteURL: "https://example.com",
            websiteKey: "Y5Lh0ti..."
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveYandexSmartCaptcha();
```

### Image to Text

Uses `ImageToTextTask`. Set `numeric`, `minLength`, `maxLength`, or `case` to improve accuracy. Add `comment` for worker instructions. See the official docs for Image to Text parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#image-to-text).

```javascript
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function solveImageToText() {
    const imageBase64 = fs.readFileSync("captcha.png", { encoding: "base64" });

    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "ImageToTextTask",
            body: imageBase64,
            numeric: 1,
            minLength: 4,
            maxLength: 6
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveImageToText();
```

### Coordinates

Uses `CoordinatesTask`. Works for click-based captchas and Yandex SmartCaptcha image challenges. Set `imgType` to `smart_captcha` or `pazl_smart_captcha` for Yandex. Always pass `imgInstructions` for `smart_captcha`. See the official docs for Coordinates parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#coordinates).

```javascript
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function solveCoordinates() {
    const imageBase64 = fs.readFileSync("captcha.png", { encoding: "base64" });

    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "CoordinatesTask",
            body: imageBase64,
            comment: "click on the green apple"
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveCoordinates();
```

### GeeTest v3

Uses `GeeTestTaskProxyless` or `GeeTestTask`. Requires fresh `gt` and `challenge` values from the target page on each request. Version defaults to 3. See the official docs for GeeTest v3 parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#geetest-v3).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveGeeTestV3() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "GeeTestTaskProxyless",
            websiteURL: "https://example.com",
            gt: "f2ae6cadcf7886856696c46d84d109d1",
            challenge: "12345678abc90123d45678e90123f45g6"
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveGeeTestV3();
```

### GeeTest v4

Uses `GeeTestTaskProxyless` or `GeeTestTask`. Set `version` to 4. Pass `initParameters` with `captcha_id` from the target page. See the official docs for GeeTest v4 parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#geetest-v4).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveGeeTestV4() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "GeeTestTaskProxyless",
            websiteURL: "https://example.com",
            version: 4,
            initParameters: { captcha_id: "e392e65f912c780f2c3ebac7702651de" }
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveGeeTestV4();
```

### Tencent

Uses `TencentTaskProxyless` or `TencentTask`. Requires `appId` from the page source. Pass `captchaScript` if the site uses a non-default script URL. See the official docs for Tencent parameters and response format [here](https://captcha-solver.com/en/docs/captcha-types#tencent).

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveTencent() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "TencentTaskProxyless",
            websiteURL: "https://example.com",
            appId: "190014885"
        }
    });

    const taskId = response.data.taskId;
    console.log("Task ID:", taskId);
}

solveTencent();
```

### Check Balance

```javascript
const axios = require('axios');
require('dotenv').config();

async function checkBalance() {
    const response = await axios.post("https://api.captcha-solver.com/getBalance", {
        clientKey: process.env.CAPTCHA_API_KEY
    });

    console.log(response.data.balance);
}

checkBalance();
```

### Custom Timeout and Polling

```javascript
const axios = require('axios');
require('dotenv').config();

async function solveWithTimeout(taskId) {
    const timeout = 120;
    const startTime = Date.now();

    while (true) {
        if ((Date.now() - startTime) / 1000 > timeout) {
            console.log("Timeout reached");
            break;
        }

        const result = await axios.post("https://api.captcha-solver.com/getTaskResult", {
            clientKey: process.env.CAPTCHA_API_KEY,
            taskId: taskId
        });

        if (result.data.status === "ready") {
            console.log(result.data.solution);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

solveWithTimeout("YOUR_TASK_ID");
```

### Error Handling

```javascript
const axios = require('axios');
require('dotenv').config();

async function handleErrors() {
    const response = await axios.post("https://api.captcha-solver.com/createTask", {
        clientKey: process.env.CAPTCHA_API_KEY,
        task: {
            type: "RecaptchaV2TaskProxyless",
            websiteURL: "https://example.com",
            websiteKey: "INVALID_KEY"
        }
    });

    if (response.data.errorId !== 0) {
        console.log(`Error: ${response.data.errorDescription}`);
    }
}

handleErrors();
```

---

## Requirements

* Node.js 16+
* [Captcha Solver](https://captcha-solver.com/) account and API key
* `axios` and `dotenv` libraries (included in package.json)

---

## API Documentation

See the [official service documentation](https://captcha-solver.com/en/docs/captcha-types) for full descriptions of task parameters and endpoints.

---

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.