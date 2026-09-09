import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareMenuAssets } from './prepare-menu-assets.mjs';

const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(25)]);
function fixture() { return mkdtempSync(join(tmpdir(), 'menu-assets-test-')); }
function put(root, path, bytes = png) {
  const parts = path.split('/');
  mkdirSync(join(root, ...parts.slice(0, -1)), { recursive: true });
  writeFileSync(join(root, path), bytes);
}
test('recovers misplaced browser uploads and both legacy folders', () => {
  const root = fixture();
  put(root, 'menu-products/a.png');
  put(root, 'public/ramen-products/b.png');
  put(root, 'public/snack-products/c.png');
  assert.deepEqual(prepareMenuAssets(root, ['a.png', 'b.png', 'c.png']), { checked: 3, copied: 3 });
  for (const file of ['a.png', 'b.png', 'c.png']) assert.deepEqual(readFileSync(join(root, 'public/menu-products', file)), png);
  assert.equal(prepareMenuAssets(root, ['a.png', 'b.png', 'c.png']).copied, 0);
});
test('preserves canonical images over older duplicates', () => {
  const root = fixture();
  put(root, 'public/menu-products/a.png');
  put(root, 'menu-products/a.png', Buffer.from('old invalid file'));
  assert.equal(prepareMenuAssets(root, ['a.png']).copied, 0);
  assert.deepEqual(readFileSync(join(root, 'public/menu-products/a.png')), png);
});
test('blocks missing files and files that are not PNGs', () => {
  const root = fixture();
  assert.throws(() => prepareMenuAssets(root, ['missing.png']), /Missing missing.png/);
  put(root, 'menu-products/a.png', Buffer.from('version https:\/\/git-lfs.github.com/spec/v1'));
  assert.throws(() => prepareMenuAssets(root, ['a.png']), /Invalid image file/);
});
test('checks masks and rejects paths outside the image directory', () => {
  const root = fixture();
  put(root, 'public/menu-products/mask.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'));
  assert.equal(prepareMenuAssets(root, ['mask.svg']).checked, 1);
  assert.throws(() => prepareMenuAssets(root, ['../a.png']), /Invalid menu asset filename/);
});
