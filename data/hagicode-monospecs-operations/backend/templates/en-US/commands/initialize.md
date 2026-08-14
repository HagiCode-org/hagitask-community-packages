# initialize command

Initialize `.hagicode/monospecs.yaml` only in the selected project root. Read the existing file first. If it is missing, create `.hagicode/` with `version: "1.0"`, `commit_when_archive: false`, and `repositories: []`; if it is valid, preserve it and report its repository count. Invalid YAML or required fields must stop the operation without writing and include field-level diagnostics. Validate the configuration before and after any write, then report the path, action, validation result, and final state.
