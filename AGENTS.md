# Codex instructions

Keep work in this repository focused and economical. Use these instructions for Codex; do not load broad project history or unrelated files unless the task needs them.

## Project

- LinkedIn Aid is a browser extension built with WXT, Vue 3, TypeScript, and Vuetify.
- Source is under `src/`. Extension entrypoints are in `src/entrypoints/`; shared UI is in `src/components/`; data and API code is in `src/db/`, `src/graphql/`, `src/services/`, and `src/store/`.
- Package scripts are the source of truth for available commands. Common checks: `bun run compile`, `bun run build`; use Firefox variants only when the task concerns Firefox.

## Efficient workflow

- Start with `git status --short` and a narrow `rg` search for the relevant symbol or behavior. Read only the files that search identifies and their direct dependencies.
- For edits, inspect the target section and nearby conventions; avoid dumping whole directories, generated files, lockfiles, or `node_modules`.
- Make the smallest change that satisfies the request. Preserve unrelated user changes and inspect the final diff for scope.
- Batch independent file reads or searches in one command. Prefer `rg`/`rg --files` over broad recursive dumps.
- Do not browse the web for repository questions. Browse only when the task needs current external facts or the user asks for research.
- Use a connected app/tool only when the task needs that app's data or action. For repository work, use the shell for search, edits, git status, and diffs; use the browser only for an actual UI check that cannot be answered from source.
- Avoid parallel agents for small tasks. Delegate only when the user requests it or independent research materially shortens substantial work.
- Do not run checks or tests unless the user asks for verification. If asked, choose the narrowest relevant package script and report its result.

## Response style

- Keep updates and the final response concise. State changed files and verification only; include detail when it affects how the user should proceed.
- Ask only when a missing decision blocks progress. Otherwise make a reasonable assumption and continue.
