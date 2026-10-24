---
public: true
multilingual: false
style: product
---

# README requirements

## Product focus

- Introduce this repository as the public collection of HagiTask community task definitions: ready-made task packages (manifest, panel, prompts, localized text and store page) that appear in the HagiTask catalog at https://tasks.hagicode.com once published.
- Address people who want to contribute a task definition to the HagiTask community, and people who want to know what a community package contains. Contributors are the repository's direct users, so developer-facing wording is appropriate.
- Lead with what the collection provides and who it is for; point to the HagiTask community guide at https://docs.hagicode.com/guides/hagitask/community/ for the full contribution walkthrough instead of copying it.

## Required content

- Open with a short product introduction, the community guide link and the website badge the README already carries.
- Describe what a community task package contains, based on the package layout the README shows under `data/<taskId>/`, and name the published `@hagicode/hagitask` CLI as the schema source.
- Show the user-facing contribution steps the README carries: validate locally with `npm ci` and `npm run validate`, run `npm test` when changing validation tooling, and bump the manifest version for every published package change.
- Validation commands must match `package.json`; the package layout and schema names must match the real `data/<taskId>/` directories and the published schemas.

## Exclusions

- Exclude tokens, secret values, internal hosts, machine-specific paths and private links.
- Keep repository maintenance instructions out of the README: artifact ownership tables, generated catalog and archive pipelines, internal architecture and CI details. Do not list features the repository does not show.
