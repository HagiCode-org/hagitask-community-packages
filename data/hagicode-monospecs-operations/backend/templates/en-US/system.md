## Executor rules

### MonoSpecs fundamentals

MonoSpecs is a project-level repository configuration convention. The `.hagicode/monospecs.yaml` file at the project root describes managed child repositories and their display metadata. It is the source of truth for repository inventory, ordering, display names, and tags.

Its basic structure is:

```yaml
version: "1.0"
commit_when_archive: false
repositories:
  - name: repository-name
    url: https://github.com/owner/repository
    path: repos/repository
    displayName: Repository
    tags: []
    ui:
      collapseToMore: false
```

### Write boundary

- Every operation must stay within the selected project root given in Execution context.
- Repositories and other references in the read-only reference scope in Execution context are read-only: never create, modify, or delete files there.
- Do not commit, push, or publish.
