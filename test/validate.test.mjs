/**
 * Fixture-oriented tests for the Community package validator.
 *
 * Each scenario builds a throwaway repository root (with the vendored schemas
 * copied in) and runs `validateCommunityPackages`, asserting the expected
 * pass/fail behaviour and the aggregated error format.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  rmSync,
  mkdirSync,
  writeFileSync,
  cpSync,
  existsSync,
} from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { validateCommunityPackages } from '../scripts/validate-community-packages.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SR = 'https://hagicode.local/designs/task-preset-plugin-schemas';

let root;

before(() => {
  root = mkdtempSync(join(tmpdir(), 'comm-val-'));
  cpSync(join(repoRoot, 'schemas'), join(root, 'schemas'), { recursive: true });
});

after(() => rmSync(root, { recursive: true, force: true }));

function writePackage(dirName, files) {
  const dir = join(root, dirName);
  mkdirSync(dir, { recursive: true });
  for (const [rel, content] of Object.entries(files)) {
    const f = join(dir, rel);
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, content);
  }
}

function manifest(id, overrides = {}) {
  return JSON.stringify(
    {
      $schema: '../../schemas/task-preset-plugin/manifest.schema.json',
      schemaVersion: '1.0',
      taskPresetId: id,
      version: '1.0.0',
      icon: 'star',
      displayName: { key: 'taskPreset.displayName' },
      description: { key: 'taskPreset.description' },
      kind: 'custom-executor',
      status: 'experimental',
      owner: 'Test',
      entrypoints: { menuSurface: 'session-create', drawerId: id },
      activation: { defaultState: 'passive' },
      localization: {
        strategy: 'plugin-bundles',
        namespace: id,
        defaultLocale: 'en-US',
        supportedLocales: ['en-US', 'zh-CN'],
        bundles: { 'en-US': './locales/en-US.json', 'zh-CN': './locales/zh-CN.json' },
      },
      capabilities: { supportsSceneBinding: false, supportsCommandCatalog: false },
      ui: { panel: './frontend/panel.json' },
      site: { storePage: './store-page/' },
      backend: {
        taskPreset: './backend/task-preset.json',
        prompts: './backend/prompts.json',
      },
      ...overrides,
    },
    null,
    2,
  );
}

function taskPreset() {
  return JSON.stringify(
    {
      $schema: '../../../schemas/task-preset-plugin/task-preset.schema.json',
      taskKey: 'test',
      scriptKey: 'autotask.test',
      defaultTargetType: 'repository',
      requirements: [{ type: 'agent', name: 'any' }],
      targets: {
        repositories: {
          enabled: true,
          selections: [
            {
              id: 'targetRepositories',
              selectionMode: 'multiple',
              allowedAccessTypes: ['read', 'write'],
              output: 'targetRepositories',
              scope: { source: 'owner-project-repositories' },
            },
          ],
        },
        vaults: { enabled: false },
        projects: { enabled: false },
      },
      inputBindings: [
        { input: 'scope', promptParameter: 'scope', metadataKey: 'autoTaskScope', required: true },
      ],
    },
    null,
    2,
  );
}

function prompts() {
  return JSON.stringify(
    {
      $schema: '../../../schemas/task-preset-plugin/prompt-package.schema.json',
      version: '1.0.0',
      templateEngine: 'handlebars',
      defaultLocale: 'en-US',
      supportedLocales: ['en-US', 'zh-CN'],
      inputs: [{ name: 'scope', source: 'task-preset-input', required: true }],
      rendering: { strictVariables: false, trimBlocks: true },
      locales: {
        'en-US': {
          systemTemplate: './templates/en-US/system.md',
          userTemplate: './templates/en-US/user.hbs',
        },
        'zh-CN': {
          systemTemplate: './templates/zh-CN/system.md',
          userTemplate: './templates/zh-CN/user.hbs',
        },
      },
    },
    null,
    2,
  );
}

function panel() {
  return JSON.stringify(
    {
      $schema: '../../../schemas/task-preset-plugin/panel.schema.json',
      surface: 'drawer',
      title: { key: 'panel.title' },
      description: { key: 'panel.description' },
      defaultTitle: { key: 'panel.defaultTitle' },
      submitLabel: { key: 'panel.submit' },
      sections: [
        {
          id: 'main',
          layout: 'stack',
          fields: [
            {
              id: 'scope',
              renderer: 'text',
              output: 'scope',
              inputType: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    null,
    2,
  );
}

function locales(loc) {
  return JSON.stringify({
    $schema: '../../../schemas/task-preset-plugin/locales.schema.json',
    taskPreset: {
      displayName: `Test ${loc}`,
      description: `Test description ${loc}`,
    },
  });
}

function storePage(id, loc, title, langTag) {
  return `---
locale: ${loc}
slug: ${id}
title: ${title}
summary: A test preset for validation.
status: experimental
catalog:
  - test
tags:
  - sample
---

Body content for ${langTag}.
`;
}

function validPackageFiles(id) {
  return {
    'manifest.json': manifest(id),
    'backend/task-preset.json': taskPreset(),
    'backend/prompts.json': prompts(),
    'frontend/panel.json': panel(),
    'locales/en-US.json': locales('en-US'),
    'locales/zh-CN.json': locales('zh-CN'),
    'backend/templates/en-US/system.md': '# system',
    'backend/templates/en-US/user.hbs': '{{scope}}',
    'backend/templates/zh-CN/system.md': '# system',
    'backend/templates/zh-CN/user.hbs': '{{scope}}',
    'store-page/index.en-US.md': storePage(id, 'en-US', 'Test', 'en'),
    'store-page/index.zh-CN.md': storePage(id, 'zh-CN', '测试', 'zh'),
  };
}

test('valid package passes with no errors', () => {
  writePackage('good-pkg', validPackageFiles('good-pkg'));
  const { packages, errors } = validateCommunityPackages(root);
  assert.ok(errors.length === 0, `expected no errors, got:\n${errors.map((e) => e.message).join('\n')}`);
  assert.ok(packages.includes('good-pkg'));
});

test('invalid JSON is reported as a parse failure', () => {
  writePackage('bad-json', {
    'manifest.json': '{ this is not valid json',
  });
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find((e) => e.packageId === 'bad-json' && e.field === 'parse');
  assert.ok(hit, 'expected a parse error for invalid JSON');
});

test('unresolved schema reference is reported', () => {
  const files = validPackageFiles('unresolved');
  files['manifest.json'] = JSON.stringify({
    $schema: '../../schemas/task-preset-plugin/does-not-exist.schema.json',
    taskPresetId: 'unresolved',
    version: '1.0.0',
  });
  writePackage('unresolved', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.packageId === 'unresolved' && e.message.includes('unresolved schema reference'),
  );
  assert.ok(hit, 'expected unresolved schema reference error');
});

test('malformed package directory (no manifest) is not treated as a package', () => {
  writePackage('empty-dir', { 'readme.txt': 'not a package' });
  const { packages, errors } = validateCommunityPackages(root);
  assert.ok(!packages.includes('empty-dir'));
  assert.ok(!errors.some((e) => e.packageId === 'empty-dir'));
});

test('duplicate canonical ids are detected', () => {
  writePackage('dup-a', validPackageFiles('dup-id'));
  writePackage('dup-b', validPackageFiles('dup-id'));
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.field === 'taskPresetId' && e.message.includes('duplicate canonical id'),
  );
  assert.ok(hit, 'expected duplicate canonical id error');
});

test('path traversal is rejected', () => {
  const files = validPackageFiles('traversal');
  files['manifest.json'] = manifest('traversal', { ui: { panel: '../escape.json' } });
  writePackage('traversal', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find((e) => e.message.includes('path escapes package directory'));
  assert.ok(hit, 'expected path traversal error');
});

test('missing declared resource is an explicit failure', () => {
  // Declare a panel path but do not create the file.
  const files = validPackageFiles('missing');
  delete files['frontend/panel.json'];
  writePackage('missing', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.packageId === 'missing' && e.message.includes('missing declared file'),
  );
  assert.ok(hit, 'expected missing declared file error');
});

test('missing prompt template is an explicit failure', () => {
  const files = validPackageFiles('missing-tpl');
  delete files['backend/templates/en-US/system.md'];
  writePackage('missing-tpl', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.packageId === 'missing-tpl' && e.message.includes('prompt template file not found'),
  );
  assert.ok(hit, 'expected missing prompt template error');
});

test('inconsistent localization: store page slug must equal taskId', () => {
  const files = validPackageFiles('wrong-slug');
  files['store-page/index.en-US.md'] = storePage('different-id', 'en-US', 'Test', 'en');
  writePackage('wrong-slug', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.packageId === 'wrong-slug' && e.field === 'slug' && e.message.includes('must equal taskId'),
  );
  assert.ok(hit, 'expected slug mismatch error');
});

test('inconsistent localization: missing store page for supported locale', () => {
  const files = validPackageFiles('missing-locale');
  delete files['store-page/index.zh-CN.md'];
  writePackage('missing-locale', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.packageId === 'missing-locale' && e.message.includes('missing store page for supported locale'),
  );
  assert.ok(hit, 'expected missing store page error');
});

test('schema violation is reported with field location', () => {
  // manifest with an invalid kind value (not in enum).
  const files = validPackageFiles('schema-violation');
  const m = JSON.parse(files['manifest.json']);
  m.kind = 'not-a-kind';
  files['manifest.json'] = JSON.stringify(m, null, 2);
  writePackage('schema-violation', files);
  const { errors } = validateCommunityPackages(root);
  const hit = errors.find(
    (e) => e.packageId === 'schema-violation' && e.field.includes('schema:manifest.schema.json'),
  );
  assert.ok(hit, `expected schema violation error, got:\n${errors.map((e) => e.message).join('\n')}`);
});

// ensure SR constant is referenced (keeps the import intent explicit)
assert.ok(typeof SR === 'string' && SR.endsWith('task-preset-plugin-schemas'));
