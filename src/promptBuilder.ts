import { curserRules } from '../curserRules';

/**
 * Builds a prompt for generating a Playwright Page Object class
 */
export function buildPromptForPageObject(url: string, dom: string, pageClassName: string): string {
  return `
You are a senior QA automation engineer.

Your task is to generate a Playwright Page Object class in TypeScript, named exactly "${pageClassName}".

Structure and Coding Guidelines:
- The file must start with:
  import { Locator, Page } from '@playwright/test';

- The class must begin with:
  export class ${pageClassName} {

- Inside the class, define:
  - private page: Page;
  - At least 3 private locators of type Locator, initialized in the constructor.
    For example:
      private header: Locator;
      private emailInput: Locator;

- The constructor must initialize 'page' and all locators using:
      this.page = page;
      this.emailInput = this.page.locator('...');
  
- All public methods must:
  - Be declared as async
  - Use only the private locators defined in the constructor
  - Return correct Promise types (e.g. Promise<string>, Promise<void>)
  - Use textContent() ?? '' when retrieving text

Locator Strategy Rules:
- YOU MUST use actual selectors from the DOM snapshot provided below.
- DO NOT use placeholder selectors like '...'.
- You MUST prioritize robust and semantic locators in this order:
  1. getByRole() with accessible name — most preferred
     Example: this.page.getByRole('textbox', { name: 'Email' })
  2. getByLabelText(), getByPlaceholder(), getByTestId()
     Example: this.page.getByPlaceholder('Enter your email')
  3. this.page.locator('[data-testid="..."]')
- DO NOT use locators like: input#id, div.class, :nth-child
- Only use this.page.locator('...') as a last resort AND with a stable attribute (e.g. name, aria-label)
- Do not use ID-based selectors (e.g. input#username) unless no better option exists
- Avoid using unstable CSS selectors like class names or :nth-child
- If necessary, use .filter() or .nth() to narrow down locator results
- Avoid using this.page.locator(...) directly in methods — always use the initialized private locators
- Consider mapping components to generic types such as: tableComponent, formComponent, modalComponent, navbarComponent
- Prioritize these HTML attributes when selecting elements:
  ${JSON.stringify(curserRules.locatorStrategy.targetAttributes)}

Additional Constraints:
- DO NOT include any extra import statements
- DO NOT use markdown formatting (no \`\`\`)
- DO NOT include explanations, comments, or descriptions

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
export function buildPromptForTestFile(pageClassName: string, methodNames: string[], domain: string, url: string): string {
  return `
You are a QA automation engineer writing Playwright tests.

Create a TypeScript test file that uses the Page Object class "${pageClassName}" located at:
'../../pages/${domain}/${pageClassName}'

Use ONLY these public methods from the Page Object:
${methodNames.map(name => `- ${name}()`).join('\n')}

Requirements:
- Use these imports at the top:
  import { test, expect } from '@playwright/test';
  import { ${pageClassName} } from '../../pages/${domain}/${pageClassName}';
- Instantiate the class in each test using:
  const pageObj = new ${pageClassName}(page);
- Write at least 2 valid test cases
- Do NOT use markdown, comments, or explanations
- Output only valid TypeScript test code
- Add 'beforeAll' to launch browser, create context, and navigate to '${url}'.
- Add 'afterAll' to close the browser context.
- Inside 'beforeAll', instantiate the Page Object using:
    pageObj = new ${pageClassName}(page);
- Define 'let pageObj: ${pageClassName};' outside the tests.
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
 * Injects the missing import statement, replacing any existing Page/Locator imports
 */
export function addPlaywrightImport(code: string): string {
  const cleanCode = code
    .replace(/^import\s+\{[^}]*Page[^}]*}[^\n]*\n?/gm, '')
    .replace(/^import\s+\{[^}]*Locator[^}]*}[^\n]*\n?/gm, '')
    .trim();

  const importStatement = `import { Locator, Page } from '@playwright/test';\n\n`;
  return importStatement + cleanCode;
}
