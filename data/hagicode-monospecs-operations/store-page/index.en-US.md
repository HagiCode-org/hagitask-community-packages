---
locale: en-US
slug: hagicode-monospecs-operations
title: HagiCode MonoSpecs Operations
summary: Initialize MonoSpecs configuration, batch-add repositories, and reorder repositories by observable activity through a structured task.
eyebrow: Task Preset Store
status: experimental
primaryCtaLabel: Install task preset
secondaryCtaLabel: Preview operation contract
catalog:
  - configuration
  - repositories
tags:
  - monospecs
  - bilingual
  - validation
badges:
  - Selected-project writes
  - Read-only references
  - Pre-write validation
---

HagiCode MonoSpecs Operations provides three structured commands: `initialize` creates a missing `.hagicode/monospecs.yaml`, `add-repository` accepts one or more absolute URLs and infers repository metadata, and `reorder-repositories` builds a proposed order from observable activity signals.

## What it does

### Initializes a usable configuration

`initialize` creates the missing MonoSpecs configuration without overwriting an existing file. The task keeps the repository inventory in the expected structure so later operations can validate it consistently.

### Adds repositories from canonical URLs

`add-repository` accepts absolute GitHub URLs, infers the repository name and local path, and rejects malformed URLs, duplicate entries, and unsafe path collisions before proposing a change.

### Reorders without changing repository data

`reorder-repositories` derives a proposed order from observable activity signals, shows the preview, and requires explicit confirmation. It changes only the `repositories` array order.

## Before you start

- Select the MonoSpecs project as the `write` target.
- Keep attached repositories as `read`-only references; they are used for context, not as write destinations.
- Provide canonical absolute repository URLs and review the inferred local paths before accepting an addition.

## Safety boundaries

Every candidate configuration is fully revalidated before writing. A failed validation, rejected duplicate, or missing confirmation leaves the configuration unchanged.

## Best fit

- Best for: initializing MonoSpecs, onboarding repositories, and making a reviewed activity-based ordering change.
- Not for: editing application source, changing repository metadata, or silently rewriting unrelated configuration.
