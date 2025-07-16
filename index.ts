import { scanDOM } from './src/pageScanner';
import { generateFromPrompt } from './src/openaiClient';
import {
  buildPromptForPageObject,
  extractPublicMethodNames,
  buildPromptForTestFile,
  addPlaywrightImport
} from './src/promptBuilder';
import { saveToFile } from './src/fileWriter';
import path from 'path';

const TARGET_URL = 'https://login.eprsys.com/Home/loginV3';

async function run() {
  console.log('🚀 Starting test generation for:', TARGET_URL);

  const domain = new URL(TARGET_URL).hostname.replace(/^www\./, '');
  const slug = TARGET_URL.replace(/^https?:\/\//, '').replace(/[^\w]/g, '_');
  const pageClassName = generatePageClassName(domain, TARGET_URL);

  // 1. Scan DOM
  console.log('🔍 Scanning DOM...');
  const dom = await scanDOM(TARGET_URL);

  // 2. Build prompt for Page Object
  console.log('✏️ Generating Page Object...');
  const pagePrompt = buildPromptForPageObject(TARGET_URL, dom, pageClassName);
  let pageObjectCode = await generateFromPrompt(pagePrompt);
  pageObjectCode = addPlaywrightImport(pageObjectCode);

  // 3. Save Page Object to file
  const pageFileName = `${pageClassName}.ts`;
  await saveToFile(domain, 'pages', pageFileName, pageObjectCode);

  // 4. Extract public method names
  const methodNames = extractPublicMethodNames(pageObjectCode);
  if (!methodNames.length) {
    console.error('❌ No public methods found. Cannot generate test file.');
    return;
  }

  // 5. Build prompt for test file
  console.log('🧪 Generating test file...');
  const testPrompt = buildPromptForTestFile(pageClassName, methodNames, domain, TARGET_URL);
  const testCode = await generateFromPrompt(testPrompt);

  // 6. Save test file
  const testFileName = `${slug}.spec.ts`;
  await saveToFile(domain, 'tests', testFileName, testCode);

  console.log('✅ Done! Page Object and test created successfully.');
}

function generatePageClassName(domain: string, url: string): string {
  const slug = url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${slug}Page`;
}

run().catch(err => {
  console.error('❌ Error during execution:', err);
});
