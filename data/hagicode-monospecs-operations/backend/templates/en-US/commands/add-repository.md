# add-repository command

Read and validate `.hagicode/monospecs.yaml` and its `repositories` array. Extract one or more valid absolute URLs from the operation description, infer each repository name, relative `path`, and `displayName`, and use default `icon` and `tags`; stop if inference is unreliable. Normalize paths and reject duplicates, missing fields, or invalid URLs without writing. Append entries in URL input order, revalidate the complete document before writing, and report inferred values, write path, validation result, and final repository count.
