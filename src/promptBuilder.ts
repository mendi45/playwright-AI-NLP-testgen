import { curserRules } from '../curserrules';

export function buildPromptForPageObject(url: string, dom: string): string {
  return `
You are a senior QA automation engineer.

Your task is to generate a clean and modular **Playwright Page Object class** in **TypeScript** (not Selenium, not JavaScript, not Java).

Use Playwright's official syntax and best practices:
- Use 'page.getByRole', 'page.getByTestId', 'page.getByPlaceholder' where applicable
- Prefer semantic locators
- Follow the Page Object Model (POM) structure
- Include helper methods like: fillForm(), clickButton(), getHeaderText()

Follow these user-defined automation rules:
${JSON.stringify(curserRules, null, 2)}

The target page is:
${url}

This is the current DOM snapshot:
${dom}

Your output should be:
- A single TypeScript class with locators and helper functions
- Written in raw code format (NO markdown, NO explanations, NO triple backticks)
- Do NOT use WebDriver, Selenium, or other libraries
- Assume that the class will be used in Playwright tests later
`;
}

export function buildPromptForTest(pageClassName: string): string {
  return `
You are a Playwright automation engineer.

Generate 2 Playwright end-to-end tests in TypeScript that use the Page Object class named "${pageClassName}".

Requirements:
- Import the Page Object
- Use Playwright test runner ('test', 'expect')
- Keep the tests clean and descriptive
- Follow best practices for structure and readability

Only return raw TypeScript code. No markdown, no explanation.
`;
}
