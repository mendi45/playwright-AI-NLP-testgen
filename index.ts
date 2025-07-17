import { scanDOM } from './src/pageScanner';
import { generateFromPrompt } from './src/openaiClient';
import {
  buildPromptForPageObject,
  buildPromptForTestFile,
  extractPublicMethodNames,
  addPlaywrightImport,
  buildPromptFromNaturalText
} from './src/promptBuilder';
import { saveToFile } from './src/fileWriter';

import promptSync from 'prompt-sync';
const prompt = promptSync();

// ברירת מחדל
const DEFAULT_URL = 'https://example.com';

async function run() {
  console.log('🎯 QA Automation Generator');

  const useDefault = prompt(`🌐 Use default URL (${DEFAULT_URL})? (y/n): `).trim().toLowerCase() === 'y';
  const url = useDefault ? DEFAULT_URL : prompt('🔗 Enter target website URL: ').trim();
  const domain = new URL(url).hostname.replace(/^www\./, '');
  const className = domain
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Page';

  const testFileName = `${className.replace(/Page$/, '').toLowerCase()}.spec.ts`;

  const mode = prompt('🧠 Choose mode: (1) DOM-based  (2) Natural Language: ').trim();

  if (mode === '2') {
    // מצב טקסט טבעי
    const naturalInstruction = prompt('💬 Describe what you want to test: ').trim();

    // סריקת DOM
    console.log('🔍 Scanning DOM...');
    const dom = await scanDOM(url);

    // יצירת Page Object
    console.log('🧩 Generating Page Object...');
    let poPrompt = buildPromptForPageObject(url, dom, className);
    let poCode = await generateFromPrompt(poPrompt);
    poCode = addPlaywrightImport(poCode);
    await saveToFile(domain, 'pages', `${className}.ts`, poCode);

    // יצירת טסט מתוך טקסט
    console.log('🧪 Generating test from your description...');
    const testPrompt = buildPromptFromNaturalText(url, naturalInstruction, className, domain);
    const generatedTest = await generateFromPrompt(testPrompt);
    await saveToFile(domain, 'tests', testFileName, generatedTest);
  } else {
    // מצב רגיל DOM
    console.log('🔍 Scanning DOM...');
    const dom = await scanDOM(url);

    console.log('🧩 Generating Page Object...');
    let pagePrompt = buildPromptForPageObject(url, dom, className);
    let poCode = await generateFromPrompt(pagePrompt);
    poCode = addPlaywrightImport(poCode);
    await saveToFile(domain, 'pages', `${className}.ts`, poCode);

    const methodNames = extractPublicMethodNames(poCode);
    if (!methodNames.length) {
      console.error('❌ No public methods found. Cannot generate test file.');
      return;
    }

    console.log('🧪 Generating Test File...');
    const testPrompt = buildPromptForTestFile(className, methodNames, domain, url);
    const testCode = await generateFromPrompt(testPrompt);
    await saveToFile(domain, 'tests', testFileName, testCode);
  }

  console.log('✅ Done! All files generated successfully.');
}

run().catch(err => {
  console.error('❌ Unexpected Error:', err);
});
