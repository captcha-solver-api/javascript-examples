/**
 * Example: solve the image-based Yandex SmartCaptcha with CoordinatesTask.
 */

import 'dotenv/config';
import fs from 'fs';
import { CaptchaClient, Tasks } from 'captcha-sdk';

const apiKey = process.env.CAPTCHA_API_KEY || 'YOUR_API_KEY';
const captchaSolver = new CaptchaClient({ clientKey: apiKey });
const body = fs.readFileSync(
  new URL('../assets/yandex-smartcaptcha-sample.jpg', import.meta.url)
).toString('base64');

try {
  const task = new Tasks.CoordinatesTask({
    body,
    imgType: 'smart_captcha',
    imgInstructions: body,
    comment: 'select objects in the order of the instruction'
  });
  const result = await captchaSolver.solve(task);
  console.log('result:', result);
} catch (error) {
  console.error(error);
}