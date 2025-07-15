import { curserRules } from '../curserrules';

export function buildPromptForPageObject(url: string, dom: string): string {
  return `
You are a senior Playwright Automation Engineer.

Your task is to generate a clean and modular Page Object class in TypeScript, using the Page Object Model (POM) pattern, for the following webpage:
URL: ${url}

You must follow the following custom coding rules provided by the user:
${JSON.stringify(curserRules, null, 2)}

Use the provided DOM snapshot to identify relevant UI elements and create stable locators and helper methods.

DOM Snapshot:
${dom}

Your output should include:
- One single Page Object class
- Use of getByTestId, getByRole, placeholder, etc.
- Exposed helper functions (e.g., fillLoginForm(), clickSubmit())
- No actual test code yet
- No extra explanations or markdown – only valid TypeScript code
`;
}

export function buildPromptForTest(pageClassName: string): string {
  return `
Create 2 end-to-end Playwright tests in TypeScript using the following Page Object class: "${pageClassName}".

The tests should:
- Import the relevant Page Object
- Use Playwright's 'test' and 'expect'
- Be clean and readable
- Follow all coding and structure rules:
${JSON.stringify(curserRules.testStructure, null, 2)}

Output only TypeScript test code, no explanation.
`;
}
