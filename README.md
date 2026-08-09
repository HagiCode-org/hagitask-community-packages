# hagitask-community-packages

Source of truth for the public HagiTask community catalog.

This repository is mounted by [`hagitask-site`](https://github.com/HagiCode-org/hagitask-site)
as its `data/` Git submodule. The site build reads these directories, validates them
against the v1 community schemas, generates `/index.json`, `/tasks/<taskId>.json`, and
downloadable `/packages/<taskId>.zip` archives, then publishes them as static assets.

## Layout

```
<taskId>/
  manifest.json            # package identity, version, owner, localization, entrypoints
  backend/
    task-preset.json       # normalized requirements (agent / skills / cli)
    prompts.json           # prompt package
    templates/<locale>/    # system + user prompt templates
  frontend/
    panel.json
    commands.json
  locales/
    en-US.json
    zh-CN.json
  store-page/
    index.en-US.md         # localized store page (frontmatter drives category/tags/name/summary)
    index.zh-CN.md
```

## Canonical IDs

| Display label | `taskId` |
| --- | --- |
| UI Master | `ui-master` |
| AgentsMD | `claude-md-update` |
| Last 30 Days | `last30days` |
| Ponytail | `ponytail` |
| Goal | `goal` |
| OpenSpec Spec Compress | `openspec-spec-compress` |

`agentsmd` and `portytail` are human-facing aliases only; they are not canonical IDs.

## Rules

- This repository is the only source of truth for these six task definitions.
- Do not duplicate these definitions inside `hagitask-site`.
- Bump `version` in `manifest.json` using semantic versioning when publishing a change.
