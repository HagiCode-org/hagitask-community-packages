# hagitask-community-packages

[![last commit](https://img.shields.io/github/last-commit/HagiCode-org/hagitask-community-packages)](https://github.com/HagiCode-org/hagitask-community-packages/commits/main)
[![website](https://img.shields.io/website?url=https%3A%2F%2Fdocs.hagicode.com%2Fguides%2Fhagitask%2Fcommunity%2F&label=website)](https://docs.hagicode.com/guides/hagitask/community/)

The public collection of HagiTask community task definitions: ready-made task packages
(manifest, panel, prompts, localized text and store page) that appear in the HagiTask catalog at
https://tasks.hagicode.com once published. It is for people who want to contribute a task
definition to the HagiTask community, and for anyone who wants to know what a community
package contains.

The full contribution walkthrough is maintained in the
[HagiTask community guide](https://docs.hagicode.com/guides/hagitask/community/).

## Package layout

```text
data/<taskId>/
  manifest.json
  frontend/
    panel.json
    commands.json                # optional
  backend/
    task-preset.json
    prompts.json
    templates/<locale>/
      system.md
      user.hbs
  locales/
    en-US.json
    zh-CN.json
  store-page/
    index.en-US.md
    index.zh-CN.md
```

The directory name is the canonical `taskId` and must match `manifest.json`'s
`taskPresetId`. The full ID rules, required resources, locale/store-page behavior, versioning,
and Pull Request process are documented in the
[community guide](https://docs.hagicode.com/guides/hagitask/community/).

## Schema reference

The published [`@hagicode/hagitask`](https://www.npmjs.com/package/@hagicode/hagitask) CLI is the
authoritative schema source. Package `$schema` values use the public distribution root:

```text
https://tasks.hagicode.com/schemas/task-preset-plugin/<schema>.schema.json
```

| Package file | Schema URL suffix |
| --- | --- |
| `manifest.json` | `manifest.schema.json` |
| `frontend/panel.json` | `panel.schema.json` |
| `frontend/commands.json` | `commands.schema.json` |
| `backend/task-preset.json` | `task-preset.schema.json` |
| `backend/prompts.json` | `prompt-package.schema.json` |
| `locales/<locale>.json` | `locales.schema.json` |

## Validate locally

```bash
npm ci
npm run validate
```

Run the validator tests when changing validation tooling:

```bash
npm test
```

Fix validation errors in `data/<taskId>/`. Do not remove `$schema` references, relax the
contract locally.

Enabled task target selections may use `owner-project-repositories`, `vault-registry`, or
`project-registry`. Unknown scope sources fail validation with a selection-specific diagnostic
before publication.

## Rules

- Do not copy or edit local schema files; schema changes belong in HagiTask and its published CLI.
- Bump `manifest.json`'s semantic version for every published package change.
- Submit package Pull Requests to this repository, not HagiTask Site or HagiTask.

For the complete creation, validation, publishing, and troubleshooting flow, follow the
[HagiTask community guide](https://docs.hagicode.com/guides/hagitask/community/).
