import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Older browser uploads placed images outside public/. Recover those during
// the build, and fail before publishing if a required image is unavailable.
export function prepareMenuAssets(root, files) {
  const destination = join(root, 'public', 'menu-products');
  const sources = [destination, join(root, 'menu-products'),
    join(root, 'public', 'ramen-products'), join(root, 'public', 'snack-products')];
  const plan = [];
  const problems = [];
  for (const file of files) {
    if (basename(file) !== file || !/\.(png|svg)$/.test(file)) {
      throw new Error(`Invalid menu asset filename: ${file}`);
    }
    const source = sources.map(folder => join(folder, file)).find(existsSync);
    if (!source) {
      problems.push(`Missing ${file}`);
      continue;
    }
    const bytes = readFileSync(source);
    const valid = file.endsWith('.png')
      ? bytes.length > 24 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a'
      : bytes.toString('utf8').includes('<svg');
    if (!valid) problems.push(`Invalid image file: ${source}`);
    plan.push({ source, target: join(destination, file) });
  }
  if (problems.length) {
    throw new Error(`Menu image check failed. Add the actual files under public/menu-products (not a ZIP).\n${problems.join('\n')}`);
  }
  mkdirSync(destination, { recursive: true });
  let copied = 0;
  for (const { source, target } of plan) {
    if (source !== target) { copyFileSync(source, target); copied++; }
  }
  return { checked: files.length, copied };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const files = JSON.parse(readFileSync(new URL('./required-menu-assets.json', import.meta.url), 'utf8'));
  const result = prepareMenuAssets(root, files);
  console.log(`Menu assets verified: ${result.checked}; recovered into public/menu-products: ${result.copied}.`);
}
