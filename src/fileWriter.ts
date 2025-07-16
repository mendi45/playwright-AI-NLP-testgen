import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

/**
 * Clean and normalize domain string (e.g., remove www.)
 */
function sanitizeDomain(domain: string): string {
  return domain.replace(/^www\./, '').replace(/[^a-zA-Z0-9.-]/g, '');
}

/**
 * Ask user if they want to overwrite a file
 */
async function askUserOverwrite(filePath: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`❓ File already exists: ${filePath}\n   Overwrite? (y/N): `, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

/**
 * Save a code file under src/pages/[domain]/ or src/tests/[domain]/
 * Asks user before overwriting existing files.
 */
export async function saveToFile(
  domain: string,
  subfolder: 'pages' | 'tests',
  fileName: string,
  code: string
): Promise<void> {
  const sanitizedDomain = sanitizeDomain(domain);
  const basePath = path.join(subfolder, sanitizedDomain);
  const fullPath = path.join(basePath, fileName.endsWith('.ts') ? fileName : `${fileName}.ts`);

  fs.mkdirSync(basePath, { recursive: true });

  if (fs.existsSync(fullPath)) {
    const shouldOverwrite = await askUserOverwrite(fullPath);
    if (!shouldOverwrite) {
      console.warn('⏭️ Skipping file...');
      return;
    }
  }

  fs.writeFileSync(fullPath, code.trim());
  console.log(`✅ File saved: ${fullPath}`);
}
