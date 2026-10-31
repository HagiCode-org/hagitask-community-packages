import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const repoRoot = resolve(import.meta.dirname, '..');
// The CLI only runs when invoked by its real path; pnpm's node_modules entry is a symlink, so resolve it.
const cli = realpathSync(resolve(repoRoot, 'node_modules/@hagicode/hagitask/dist/cli.js'));

function runValidation(target) {
  return spawnSync(process.execPath, [cli, 'validate', target], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

test('published CLI validates the repository packages and reports the package set', () => {
  const result = runValidation(repoRoot);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Packages discovered: \d+/);
  assert.match(result.stdout, /data\/[a-z0-9-]+/);
});

test('published CLI reports package and field diagnostics for invalid manifests', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'hagitask-community-cli-'));
  try {
    cpSync(join(repoRoot, 'data'), join(tempRoot, 'data'), { recursive: true });
    const manifestPath = join(tempRoot, 'data', 'add-community-task', 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    delete manifest.taskPresetId;
    writeFileSync(manifestPath, JSON.stringify(manifest));

    const result = runValidation(tempRoot);
    assert.equal(result.status, 1);
    assert.match(`${result.stdout}${result.stderr}`, /add-community-task/);
    assert.match(`${result.stdout}${result.stderr}`, /taskPresetId/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

// Shared three-section output contract; must match the heading map in repos/web finalResponseSections.ts.
const outputFormatContract = {
  'en-US': {
    heading: '## Output format',
    headings: ['## Conclusion', '## Assumptions (if any)', '## Next step'],
  },
  'zh-CN': {
    heading: '## 输出格式',
    headings: ['## 结论', '## 假设（如有）', '## 下一步'],
  },
};

// Packages whose reply is not meant to follow the three-section shape. Each entry needs a reason string.
const outputFormatExemptions = {};

function packageIds() {
  return readdirSync(join(repoRoot, 'data'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function readUserTemplate(packageId, locale) {
  return readFileSync(join(repoRoot, 'data', packageId, 'backend', 'templates', locale, 'user.hbs'), 'utf8');
}

function outputFormatSection(text, heading) {
  const lines = text.split('\n');
  const start = lines.indexOf(heading);
  if (start === -1) return null;
  const next = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  return lines.slice(start, next === -1 ? lines.length : next).join('\n');
}

test('output-format exemptions name existing packages and each carries a reason', () => {
  const ids = new Set(packageIds());
  for (const [id, reason] of Object.entries(outputFormatExemptions)) {
    assert.ok(ids.has(id), `output-format exemption ${id} does not match a package`);
    assert.equal(typeof reason, 'string', `output-format exemption ${id} needs a reason string`);
    assert.ok(reason.trim().length > 0, `output-format exemption ${id} needs a non-empty reason`);
  }
});

test('every non-exempt user template carries the output-format block with its headings in order', () => {
  for (const id of packageIds()) {
    if (Object.hasOwn(outputFormatExemptions, id)) continue;
    for (const [locale, { heading, headings }] of Object.entries(outputFormatContract)) {
      const section = outputFormatSection(readUserTemplate(id, locale), heading);
      assert.notEqual(section, null, `${id} ${locale} user.hbs is missing "${heading}"`);
      let previous = -1;
      for (const expected of headings) {
        const at = section.indexOf(`\`${expected}\``);
        assert.ok(at > previous, `${id} ${locale} output format must name \`${expected}\` after the previous heading`);
        previous = at;
      }
    }
  }
});

// The project selector rule covers the packages this change touches. Other packages are exempt by name.
const projectPickerRulePackages = ['codegraph-tasks', 'github-tasks'];
const projectPickerExemptions = {
  'agents-md-update': 'declares the picker first but optional (required: false); outside this change until its required flag is decided',
};

function bundleValue(bundle, key) {
  return key.split('.').reduce((node, part) => node?.[part], bundle);
}

test('project selector exemptions name existing packages, carry a reason and sit outside the rule', () => {
  const ids = new Set(packageIds());
  for (const [id, reason] of Object.entries(projectPickerExemptions)) {
    assert.ok(ids.has(id), `project selector exemption ${id} does not match a package`);
    assert.ok(reason.trim().length > 0, `project selector exemption ${id} needs a non-empty reason`);
    assert.equal(projectPickerRulePackages.includes(id), false, `${id} cannot be both exempt and checked`);
  }
});

test('every rule package declares a required project-picker first in its first section, with both locale keys', () => {
  for (const id of projectPickerRulePackages) {
    const panel = JSON.parse(readFileSync(join(repoRoot, 'data', id, 'frontend', 'panel.json'), 'utf8'));
    const field = panel.sections[0].fields[0];
    assert.equal(field.id, 'projectId', `${id} must declare the project selector first`);
    assert.equal(field.renderer, 'project-picker', `${id} project selector renderer`);
    assert.equal(field.required, true, `${id} project selector must be required`);
    for (const locale of ['en-US', 'zh-CN']) {
      const bundle = JSON.parse(readFileSync(join(repoRoot, 'data', id, 'locales', `${locale}.json`), 'utf8'));
      for (const key of [field.label.key, field.hint.key]) {
        const value = bundleValue(bundle, key);
        assert.equal(typeof value, 'string', `${id} ${locale} bundle must define ${key}`);
        assert.ok(value.trim().length > 0, `${id} ${locale} ${key} must not be empty`);
      }
    }
  }
});
