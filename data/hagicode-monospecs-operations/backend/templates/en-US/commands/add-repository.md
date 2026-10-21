## Command: add-repository

Add one or more repositories to `.hagicode/monospecs.yaml` from the URLs in the operation description.

1. Read and validate `.hagicode/monospecs.yaml` and its `repositories` array.
2. Extract one or more valid absolute URLs from the operation description.
3. Infer each repository name, relative `path`, and `displayName`, and use default `tags`; stop if inference is unreliable.
4. Normalize paths and reject duplicates, missing fields, or invalid URLs without writing.
5. Append entries in URL input order, and revalidate the complete document before writing.
6. Report inferred values, write path, validation result, and final repository count.
