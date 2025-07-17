# 🧠 AutoTest Agent – Generate Playwright Tests with AI

This project provides a powerful CLI tool that automatically generates **Playwright Page Objects** and **test files** using live website DOM analysis or natural language instructions — powered by OpenAI.

---
דף סיכום פרוייקט בעברית:
https://docs.google.com/document/d/1tknbhK3KhRkFETfSod9D_vOvsPulytcThmFUAxalxnU/edit?usp=drive_link

סרטון הדרכה והדגמה:
https://drive.google.com/file/d/1saxPoqzSDQZmDW6eTQgHw0lMNYm6rvvx/view?usp=sharing


## 📦 Features

- ✨ Auto-generate `Page Object Model (POM)` files from any URL  
- 🧪 Create Playwright test suites using detected methods  
- 💬 Support for natural language instructions (e.g. "Test the login flow with invalid passwords")  
- ✅ Built-in `beforeAll` / `afterAll` hooks with browser setup  
- ⚙️ Smart locator generation using stable strategies (`data-testid`, roles, placeholders, etc.)  
- 🚀 Fully CLI-driven — no manual coding needed!

---

## 📁 Project Structure

```
/pages/                => Generated Page Object files  
/tests/                => Generated test files  
/src/                  => Source code of the generator  
curserRules.ts         => Custom locator & naming preferences  
index.ts               => Main CLI entry point  
promptBuilder.ts       => Prompt templates used for OpenAI requests  
```

---

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/autotest-agent.git
cd autotest-agent
```

2. **Install dependencies**

```bash
npm install
```

3. **Set your OpenAI API Key**

You must provide your own OpenAI API key. The system uses it to generate prompts and code.

Create a `.env` file:

```bash
touch .env
```

Then add this line:

```
OPENAI_API_KEY=your-openai-key-here
```

Alternatively, you can export it:

```bash
export OPENAI_API_KEY=your-openai-key-here
```

> 💡 You can get your API key from: https://platform.openai.com/account/api-keys

---

## 🚀 Usage

Run the CLI tool with:

```bash
npm start
```

You'll be guided with the following:

1. **Choose mode**  
   - DOM-based code generation from a live website  
   - Natural language instruction ("I want to test the signup flow")

2. **Choose or enter the URL**  
   - Use the default or enter a new target site.

3. **(Optional)** Provide test instructions in English  
   _(if you selected the natural language mode)_

4. ✅ Sit back and watch as the system:
   - Scans the DOM
   - Creates a `Page Object`
   - Generates matching `test.spec.ts` files
   - Stores them in the correct folders

---

## 🧪 Generated Test Example

```ts
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../../pages/example.com/LoginPage';

test.describe.serial('LoginPage Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;

  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    await page.goto('https://example.com/login');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should login with valid credentials', async () => {
    await loginPage.setEmail('user@example.com');
    await loginPage.setPassword('password123');
    await loginPage.clickLogin();
    expect(await page.url()).toContain('/dashboard');
  });
});
```

---

## ⚠️ Notes

- The generated locators prioritize semantic attributes (`getByRole`, `getByPlaceholder`, `data-testid`, etc.)
- The CLI creates new folders under `/pages` and `/tests` based on the target domain
- Natural language test generation supports English only (for now)
- Your OpenAI usage may incur costs depending on your token limits

---

## 🔮 Roadmap / Ideas

- Multi-page flows and navigation
- Support for other AI providers (Anthropic, Mistral)
- Add support for `headless = true` / CI mode
- Improve error handling and locator fallback strategies

---

## 🤝 Contributing

Pull requests are welcome! Please fork this repo and open a PR for review.

---

## 📄 License: menachem caspi caspi45@gmial.com

MIT
