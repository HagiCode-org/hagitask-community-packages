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
pnpm install
pnpm run validate
pnpm test
```

Fix validator diagnostics in the authored package; do not relax schemas or patch generated output.

Node.js 24+ is required (`engines`; CI runs Node 24). `.github/workflows/validate-community-packages.yml` runs `pnpm install`, `pnpm run validate`, and `pnpm test` (`test/validate.test.mjs`); it runs for pull requests and pushes to `main` (job `validate-packages`); keep local runs equivalent. `validate` is `hagitask validate .` from the pinned `@hagicode/hagitask` devDependency.

## Conventions

- Keep each package's directory name and `manifest.json.taskPresetId` aligned.
- Preserve the shared `manifest`, `frontend`, `backend`, `locales`, and `store-page` layout.
- Use the published HagiTask schemas and bump package semantic versions for published changes.
- Do not copy or edit local schema files; schema changes belong in HagiTask.
- A new `data/<taskId>/` package needs a scenario image: a recipe in the img-gen set `scenario-stage-backgrounds` and a registry entry for the script key `hagitask.<taskId>` in the frontend registry `repos/web/src/config/scenarioBackgrounds.ts` (monorepo path). A package without one shows its group's default picture (`group-hagitask`). A missing image is not a validation failure.
- Enabled task target selections may use only the scope sources `owner-project-repositories`, `vault-registry`, or `project-registry`; unknown sources fail validation.

## Deployment

The site build shallow-clones the exact commit recorded in `community-packages.commit`. A successful site deployment publishes the catalog and package archives; package changes must pass local validation before they are promoted. Do not manually change the commit marker or publish artifacts.

## Publish Preparation

The `publish` operation receives the absolute Contrib source checkout and this Community Packages target checkout from its execution context. Treat those paths as authoritative; verify that both exist and are distinct repository roots. Do not infer paths or use remotes, `gh`, forks, commits, pushes, pull requests, merges, or releases.

The source checkout must complete `pnpm run validate` and `pnpm test` before any copy. Accept only the selected `data/<taskId>/` package after confirming its directory name, `manifest.json.taskPresetId`, and requested target semantic version. Copy only authored package source into `data/<taskId>/`, update the copied `manifest.json` to that version, and preserve the public `$schema` URL. If copying or any validation fails, stop and report the failure without modifying the Contrib source.

After copying, run this repository's real `pnpm run validate` and `pnpm test`. Do not edit or generate `/index.json`, `/tasks/<taskId>.json`, `/packages/<taskId>.zip`, catalogs, archives, build output, unrelated packages, or repository-level files. Report the task ID, old and new versions, copied and skipped files, Contrib and Community validation/test exit statuses, and this local target path. This operation prepares local repository content only.

## Package management

- The repository uses pnpm, pinned in `package.json` `packageManager`. Run `corepack enable` once, then `pnpm install`. `pnpm-lock.yaml` is the only lockfile; do not commit `package-lock.json`.
- Settings live in `pnpm-workspace.yaml`. `allowBuilds` lists the dependencies whose install scripts may run (reviewed individually, `false` means reviewed and denied); review any new dependency that has an install script and add it there.
- A local registry mirror belongs in `~/.npmrc` only. Never commit a `registry=` line or a mirror URL; `pnpm run check:registry` (also run in CI) fails on any non-`registry.npmjs.org` `tarball` in the lockfile and on mirror hosts in tracked files.
- Undeclared imports fail under pnpm's strict layout: declare the package instead of hoisting it.
