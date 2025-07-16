import * as fs from 'fs';
import * as path from 'path';

export function saveToFile(domain: string, subfolder: 'pages' | 'tests', fileName: string, code: string): void {
  const basePath = path.join(subfolder, sanitizeDomain(domain));
  const fullPath = path.join(basePath, fileName);

  fs.mkdirSync(basePath, { recursive: true });
  fs.writeFileSync(fullPath, code, 'utf-8');

  console.log(`✅ Saved code to: ${fullPath}`);
}
//mapping new docs according to website domain
function sanitizeDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, '') // remove protocol
               .replace(/\/.*$/, '')         // remove path
               .replace(/[^a-zA-Z0-9.-]/g, '_'); // clean characters
}
