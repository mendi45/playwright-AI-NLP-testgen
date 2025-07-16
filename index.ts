import { scanDOM } from './src/pageScanner';
import { generateFromPrompt } from './src/openaiClient';
import { buildPromptForPageObject } from './src/promptBuilder';
import { saveToFile } from './src/fileWriter';

//run this test function using this command in the terminal: npx ts-node index.ts
//expecting to get a new file inside pages folder

(async () => {
  const url = 'https://example.com';
  const dom = await scanDOM(url);

  const prompt = buildPromptForPageObject(url, dom);
  const code = await generateFromPrompt(prompt);

  console.log("✅ Page Object Code:\n", code);

  // save new files by this stracture: /pages/example.com/ExamplePage.ts
  saveToFile(url, 'pages', 'ExamplePage.ts', code);
})();