# HagiTask Community Packages - Agent Configuration

## Root Configuration

Inherits the monorepo rules from `/AGENTS.md`. This repository is the source of truth for public HagiTask community task definitions.

## Overview and Architecture

- Edit package sources under `data/<taskId>/`.
- The pinned `@hagicode/hagitask` npm dependency supplies the authoritative package schemas.
- HagiTask Site consumes a pinned commit and generates `/index.json`, task details, and package archives.
- Generated catalogs, archives, and build output are not repository source.

## Commands and Testing

Run from `repos/hagitask-community-packages/`:

```bash
npm ci
npm run validate
npm test
```

Fix validator diagnostics in the authored package; do not relax schemas or patch generated output.

## Conventions

- Keep each package's directory name and `manifest.json.taskPresetId` aligned.
- Preserve the shared `manifest`, `frontend`, `backend`, `locales`, and `store-page` layout.
- Use the published HagiTask schemas and bump package semantic versions for published changes.
- Do not copy or edit local schema files; schema changes belong in HagiTask.

## Deployment

The site build shallow-clones the exact commit recorded in `community-packages.commit`. A successful site deployment publishes the catalog and package archives; package changes must pass local validation before they are promoted. Do not manually change the commit marker or publish artifacts.

## Publish Preparation

The `publish` operation receives the absolute Contrib source checkout and this Community Packages target checkout from its execution context. Treat those paths as authoritative; verify that both exist and are distinct repository roots. Do not infer paths or use remotes, `gh`, forks, commits, pushes, pull requests, merges, or releases.

The source checkout must complete `npm run validate` and `npm test` before any copy. Accept only the selected `data/<taskId>/` package after confirming its directory name, `manifest.json.taskPresetId`, and requested target semantic version. Copy only authored package source into `data/<taskId>/`, update the copied `manifest.json` to that version, and preserve the public `$schema` URL. If copying or any validation fails, stop and report the failure without modifying the Contrib source.

After copying, run this repository's real `npm run validate` and `npm test`. Do not edit or generate `/index.json`, `/tasks/<taskId>.json`, `/packages/<taskId>.zip`, catalogs, archives, build output, unrelated packages, or repository-level files. Report the task ID, old and new versions, copied and skipped files, Contrib and Community validation/test exit statuses, and this local target path. This operation prepares local repository content only; it does not create commits, pushes, pull requests, merges, releases, or remote changes.
