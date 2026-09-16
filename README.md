# Captcha Solver API JavaScript Examples

![js-examples-banner](assets/repo-banner-javascript.png)

Runnable examples prepared for the official Captcha Solver JavaScript SDK.

The JavaScript SDK is not published yet. Until it is available from npm, keep its repository next to this project and install it locally.

## Installation before SDK publication

Expected directories:

```text
Work/
  javascript-examples/
  SDK/javascript-skd/
```

```bash
git clone https://github.com/captcha-solver-api/javascript-examples.git
cd javascript-examples
npm install
npm install --no-save ../SDK/javascript-skd
```

After the SDK is published, the local installation command will be replaced with:

```bash
npm install captcha-sdk
```

Set the API key in `.env`:

```text
CAPTCHA_API_KEY=your_api_key
```

## Run examples

```bash
node examples/recaptcha_v2.js
node examples/turnstile.js
node examples/image_to_text.js
node examples/coordinates.js
node examples/balance.js
```

Replace placeholder URLs, site keys, application IDs, dynamic values, and proxy credentials before running token captcha examples. GeeTest v3 requires a fresh `challenge` value for every request.

Image examples use files from `assets/`.

## Included examples

| File | Task |
|---|---|
| `recaptcha_v2.js` | reCAPTCHA v2, proxyless and proxy |
| `recaptcha_v2_enterprise.js` | reCAPTCHA v2 Enterprise, proxyless and proxy |
| `recaptcha_v3.js` | reCAPTCHA v3 proxyless |
| `turnstile.js` | Cloudflare Turnstile, proxyless and proxy |
| `yandex_smartcaptcha.js` | Yandex SmartCaptcha token, proxyless and proxy |
| `yandex_smartcaptcha_image.js` | Yandex SmartCaptcha image mode |
| `image_to_text.js` | Image to Text |
| `coordinates.js` | Click coordinates |
| `geetest_v3.js` | GeeTest v3, proxyless and proxy |
| `geetest_v4.js` | GeeTest v4, proxyless and proxy |
| `tencent.js` | Tencent, proxyless and proxy |
| `balance.js` | Account balance |

Each example creates a task through `Tasks` and calls `CaptchaClient.solve()`. Polling and API errors are handled by the SDK.

## Requirements

- Node.js 18+
- Local JavaScript SDK until npm publication
- Captcha Solver account and API key

API documentation: https://captcha-solver.com/en/docs/captcha-types

## License

MIT. See [LICENSE.md](LICENSE.md).