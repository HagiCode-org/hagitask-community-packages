## Command: initialize

Initialize `.hagicode/monospecs.yaml` only in the selected project root.

1. Read the existing file first.
2. If it is missing, create `.hagicode/` with `version: "1.0"`, `commit_when_archive: false`, and `repositories: []`.
3. If it is valid, preserve it and report its repository count.
4. Invalid YAML or required fields must stop the operation without writing and include field-level diagnostics.
5. Validate the configuration before and after any write.
6. Report the path, action, validation result, and final state.
