# Captcha Solver API JavaScript Examples

![js-examples-banner](assets/repo-banner-javascript.png)

A collection of examples for interacting with the [Captcha Solver](https://captcha-solver.com/) service using Node.js.

This project demonstrates how to send HTTP requests to the API for solving CAPTCHA challenges. You will find examples for reCAPTCHA v2, reCAPTCHA v3, and Cloudflare Turnstile. The code helps automate task creation, status polling, and result retrieval.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/captcha-solver-api/js-examples.git
cd js-examples

```

Install the required dependencies:

```bash
npm install

```

---

## Configuration

Use environment variables to store keys. Create a `.env` file in the root directory:

```text
CAPTCHA_API_KEY=your_api_key

```

Then load it in your code:

```javascript
require('dotenv').config();
const apiKey = process.env.CAPTCHA_API_KEY;

```

---

## Run

The repository contains ready-to-run scripts.

```text
examples/
├── recaptcha_v2.js
├── recaptcha_v3.js
├── turnstile.js
└── get_balance.js

```

Run an example:

```bash
node examples/recaptcha_v2.js

```

---

## Quick Start

Use your API key to access service methods.

Example request structure for solving reCAPTCHA v2:

```javascript
const axios = require('axios');

const response = await axios.post("https://api.captcha-solver.com/createTask", {
    "clientKey": "YOUR_API_KEY",
    "task": {
        "type": "RecaptchaV2TaskProxyless",
        "websiteURL": "https://example.com/login",
        "websiteKey": "6Le-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
});

const taskId = response.data.taskId;

```

---

## What is Inside

* Request examples using the Axios library.
* Working with an API key.
* Automation of task status polling using async/await.
* Support for both proxyless and proxy tasks.
* Examples for reCAPTCHA v2, reCAPTCHA v3, and Cloudflare Turnstile.
* Node.js 16+.
* Minimal dependencies.

---

## Supported Types

| CAPTCHA Type | Proxyless | Proxy |
| --- | --- | --- |
| reCAPTCHA v2 | ✅ | ✅ |
| reCAPTCHA v3 | ✅ | ❌ |
| Cloudflare Turnstile | ✅ | ✅ |

---

## Requirements

* Node.js 16+.
* Captcha Solver account.
* Valid API key.
* Internet connection.

---

## API Documentation

See the [official service documentation](https://captcha-solver.com/en/docs/captcha-types) for full descriptions of task parameters and endpoints.

---

## Contributing

Submit a Pull Request with improvements or open an Issue if you find errors.

---

## License

This project is licensed under the MIT License.