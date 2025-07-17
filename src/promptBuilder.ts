import { curserRules } from '../curserRules';

/**
 * Builds a prompt for generating a Playwright Page Object class
 */
export function buildPromptForPageObject(url: string, dom: string, pageClassName: string): string {
  return `
You are a senior QA automation engineer.

Your task is to generate a Playwright Page Object class in TypeScript, named exactly "${pageClassName}".

Structure and Requirements:
- The file must start with:
  import { Locator, Page } from '@playwright/test';
- The class must start with:
  export class ${pageClassName} {
- Include class properties:
  private page: Page;
  private header: Locator; // and others
- In the constructor, initialize the page and all locators using real, valid selectors from the DOM snapshot.
  For example:
    this.header = this.page.getByRole('heading', { name: 'Welcome' });
    this.usernameInput = this.page.getByPlaceholder('Email');

Locator Strategy:
- Prefer stable, semantic selectors:
  - Use getByRole(), getByLabel(), getByPlaceholder() when applicable
  - Otherwise use data-testid, aria-label, name, placeholder, id
- Avoid unstable selectors like CSS classes or nth-child
- If needed, use .filter() or .nth() to stabilize selectors
- Avoid "this.page.locator('...')" — always resolve to a real value

Method Guidelines:
- Create at least 3 meaningful public async methods:
  - Use the defined locators
  - Perform actions like .fill(), .click(), or return textContent() ?? ''
  - Use correct return types: Promise<string>, Promise<void>, etc.
- Use only the locators defined in the constructor
- DO NOT use this.page.locator(...) inside methods
- DO NOT include markdown formatting (no \`\`\`, no explanations, no comments)
- Output only clean, valid TypeScript code — no surrounding text

Custom automation rules:
${JSON.stringify(curserRules, null, 2)}

Target URL:
${url}

DOM snapshot:
${dom}
`;
}

/**
 * Builds a prompt for generating a test file that uses only known methods from the Page Object
 */
export function buildPromptForTestFile(
  pageClassName: string,
  methodNames: string[],
  domain: string,
  url: string
): string {
  return `
You are a QA automation engineer writing Playwright tests.

Create a TypeScript test file that uses the Page Object class "${pageClassName}" located at:
'../../pages/${domain}/${pageClassName}'

Use ONLY these public methods from the Page Object:
${methodNames.map(name => `- ${name}()`).join('\n')}

Requirements:
- Use these imports at the top:
  import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
  import { ${pageClassName} } from '../../pages/${domain}/${pageClassName}';
- Instantiate the class in each test using:
  const pageObj = new ${pageClassName}(page);
- Wrap the tests with:
  test.describe.serial('${pageClassName} Tests', () => { ... });
- Use 'beforeAll' to launch browser, context and navigate to '${url}'
- Use 'afterAll' to close the context
- Write at least 2 valid test cases
- Add expect() validations for key actions
- DO NOT invent methods – use ONLY the listed ones
- DO NOT use markdown, comments, or explanations
- DO NOT include markdown formatting of any kind (no triple backticks, no ֿ3 Apostrophe)
- Output only valid TypeScript test code
- Use only functions from the imported pageObj
- DO NOT use functions that are not exist
`;
}

/**
 * Extracts public async method names from generated Page Object code
 */
export function extractPublicMethodNames(pageObjectCode: string): string[] {
  const methodRegex = /public\s+async\s+(\w+)\s*\(/g;
  const names: string[] = [];
  let match;
  while ((match = methodRegex.exec(pageObjectCode)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/**
 * Injects the correct import statement at top of Page Object file
 */
export function addPlaywrightImport(code: string): string {
  const cleanCode = code
    .replace(/^import\s+\{[^}]*Page[^}]*}[^\n]*\n?/gm, '')
    .replace(/^import\s+\{[^}]*Locator[^}]*}[^\n]*\n?/gm, '')
    .trim();
  return `import { Locator, Page } from '@playwright/test';\n\n${cleanCode}`;
}

/**
 * Builds a prompt from user natural language input
 */
export function buildPromptFromNaturalText(
  url: string,
  instruction: string,
  pageClassName: string,
  domain: string
): string {
  return `
You are a QA automation expert using Playwright with TypeScript.

Target website: ${url}

Based on the following instruction, generate a test suite using the "${pageClassName}" Page Object:

Instruction:
"${instruction}"

Requirements:
- Use these imports at the top:
  import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
  import { ${pageClassName} } from '../../pages/${domain}/${pageClassName}';
- Instantiate the class in each test using:
  const pageObj = new ${pageClassName}(page);
- Wrap the tests with:
  test.describe.serial('${pageClassName} Tests', () => { ... });
- Use 'beforeAll' to launch browser, context and navigate to '${url}'
- Use 'afterAll' to close the context
- Write at least 2 valid test cases
- Add expect() assertions for each step
- Use only methods defined in the Page Object
- DO NOT include markdown, comments or explanations
- DO NOT include markdown formatting of any kind (no triple backticks, no ֿ3 Apostrophe)
- Output only plain, valid TypeScript code
- Use only functions from the imported pageObj
- DO NOT use functions that are not exist
`;
}
