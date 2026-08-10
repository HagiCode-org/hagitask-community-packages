---
locale: en-US
slug: add-community-task
title: Add Community Task
summary: Turns Community Task authoring into a structured task - collect the brief, generate every required package file, validate it for real, and open a pull request from your own GitHub fork.
eyebrow: Task Preset Store
status: experimental
primaryCtaLabel: Install task preset
secondaryCtaLabel: Preview contract
catalog:
  - authoring
  - community
tags:
  - community-packages
  - scaffolding
  - github-pull-request
  - bilingual
badges:
  - Fork-scoped writes
  - Validation enforced
  - Bilingual output
---

Add Community Task is for contributors who want to publish a HagiTask Community Task without hand-assembling a dozen interlocking files. A Community package is a manifest, a panel, a task preset, a prompt package, per-locale templates, locale bundles, and per-locale store pages — and every one of those has to agree with the others. Miss one and the validator rejects the package; get one subtly wrong and it ships broken.

This task front-loads the format into the panel and the prompt, then carries the contribution all the way to a pull request.

## What it does

### Collects a real brief before generating anything

The panel requires the objective, the input fields the new task should collect, the execution and quality rules it must enforce, and the acceptance criteria that decide whether a run succeeded. Those four answers are what separate a usable package from an empty skeleton, so they are required rather than optional.

### Writes only inside your fork

Repository, vault, and project selections are read-only context. The executor resolves the upstream repository from its public GitHub URL, reuses your existing fork or creates one with `gh`, works in a temporary checkout, and writes only under `data/<task-id>/` on a working branch. Nothing writes to the repositories you attached, and nothing writes to the read-only `hagitask` schema submodule.

### Treats validation as a completion condition

After generating the package the executor initializes the nested schema submodule and runs the repository's own `npm run validate` and `npm test`. It reports the real exit status. Editing generated output or dropping an error to make the run look clean is explicitly forbidden.

### Finishes the contribution

Once validation passes, the executor commits to the working branch, pushes to your fork, and opens a pull request against the upstream default branch with `gh pr create`. The result reports the fork, the branch, the validation outcome, and the pull request URL. If authentication fails or the fork cannot be created, the task stops with diagnostics instead of claiming a pull request that does not exist.

## Requirements

- `gh` installed and authenticated (`gh auth status` must pass)
- `git` and Node.js available in the execution environment
- A GitHub account that can fork the upstream Community Packages repository

## Best fit

- Best for: publishing a new Community Task, and doing it end to end from brief to pull request.
- Also good for: learning the package format by generating a correct one and reading the diff.
- Not for: editing an already-published package, changing HagiTask schemas, or modifying the site build.

## FAQ

### Does it write to the repositories I select in the panel?

No. Repository selection is `read` only. It exists so the executor can consult your code as reference when shaping the new task. The single write scope is `data/<task-id>/` in a branch of your fork.

### What if I already have a fork of the Community Packages repository?

It is reused. The executor checks for an existing fork with `gh repo view` before calling `gh repo fork`, so you do not end up with duplicates.

### Does a passing validation mean the package is ready to merge?

No. The validator checks structure: schemas, canonical ids, declared paths, locale coverage, template resolution, and store-page frontmatter. It does not judge whether the prompt text is coherent, whether both locale bundles carry the same keys, or whether the store page describes real behavior. The task reports those as manual review items, and a human reviewer still owns the merge decision.
