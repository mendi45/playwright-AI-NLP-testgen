import { generateFromPrompt } from './openaiClient';
import { buildPromptForTestFile } from './promptBuilder';
import { extractPublicMethodNames } from './promptBuilder';
import { saveToFile } from './fileWriter';

/**
 * Main entry to generate test from a given Page Object file
 */
export async function generateTestForPageObject(domain: string, pageClassName: string, pageObjectCode: string, url: string) {
  // 1. Extract public method names
  const methodNames = extractPublicMethodNames(pageObjectCode);
  if (methodNames.length === 0) {
    console.error('❌ No public methods found. Cannot generate test file.');
    return;
  }

  // 2. Generate test prompt
  const testPrompt = buildPromptForTestFile(pageClassName, methodNames, domain, url);

  // 3. Generate test code
  const testCode = await generateFromPrompt(testPrompt);

  // 4. Create file name
  const testFileName = `${pageClassName.replace(/Page$/, '').toLowerCase()}.spec.ts`;

  // 5. Save test file
  await saveToFile(domain, 'tests', testFileName, testCode);

  console.log(`✅ Test file generated: tests/${domain}/${testFileName}`);
}