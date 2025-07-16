import promptSync from 'prompt-sync';
const prompt = promptSync();

import { scanDOM } from './src/pageScanner';
import { generateFromPrompt } from './src/openaiClient';
import { buildPromptForPageObject, extractPublicMethodNames, buildPromptForTestFile } from './src/promptBuilder';
import { saveToFile } from './src/fileWriter';

const DEFAULT_URL = 'https://example.com/login';

async function run() {
  // Prompt for URL
  const input = prompt(`🌐 Enter the target URL (default: ${DEFAULT_URL}): `);
  const targetUrl = input.trim() === '' ? DEFAULT_URL : input.trim();

  if (!targetUrl.startsWith('http')) {
    console.error('❌ Invalid URL. Please enter a valid http/https address.');
    process.exit(1);
  }

  console.log('🚀 Starting test generation for:', targetUrl);

  const domain = new URL(targetUrl).hostname.replace(/^www\./, '');
  const pageClassName = domain
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') + 'Page';

  // 1. Scan DOM
  console.log('🔍 Scanning DOM...');
  const dom = await scanDOM(targetUrl);

  // 2. Build and send Page Object prompt
  console.log('✏️ Generating Page Object...');
  const pagePrompt = buildPromptForPageObject(targetUrl, dom, pageClassName);
  const pageObjectCode = await generateFromPrompt(pagePrompt);

  // 3. Save Page Object to file
  await saveToFile(domain, 'pages', `${pageClassName}.ts`, pageObjectCode);

  // 4. Extract public method names
  const methodNames = extractPublicMethodNames(pageObjectCode);
  if (!methodNames.length) {
    console.error('❌ No public methods found. Cannot generate test file.');
    return;
  }

  // 5. Generate test code
  console.log('🧪 Generating test file...');
  const testPrompt = buildPromptForTestFile(pageClassName, methodNames, domain, targetUrl);
  const testCode = await generateFromPrompt(testPrompt);

  // 6. Save test file
  const testFileName = `${pageClassName.replace(/Page$/, '').toLowerCase()}.spec.ts`;
  await saveToFile(domain, 'tests', testFileName, testCode);

  console.log('✅ Done! Page Object and test created successfully.');
}

run().catch(err => {
  console.error('❌ Error during execution:', err);
});
