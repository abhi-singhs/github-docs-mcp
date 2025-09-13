# GitHub Docs MCP Server

A Model Context Protocol (MCP) server exposing GitHub documentation (enterprise site) topics via the Context7 API to AI clients.

## Features
- `get_github_docs` – Retrieve a GitHub documentation excerpt by topic slug / keyword

## Requirements
- Node.js 18+

## Install
```bash
npm install
```

## Build
```bash
npm run build
```

## Test
```bash
npm test
```
Runs the Vitest suite (`test/` directory) covering the fetch helper and truncation behavior.

## Run (stdio)
Integrate with an MCP-compatible client (the client is responsible for spawning the process over stdio):
```bash
node build/index.js
```
You should see on stderr:
```
GitHub Docs MCP Server running on stdio
```

## Tool Schemas
### get_github_docs
Input:
```json
{ "topic": "enterprise" }
```
Output: Text excerpt (truncated to ~5KB) of the requested GitHub documentation topic.

## Development
- Source in `src/`
- Compiled JS in `build/`
- Shared HTTP helper: `fetchGitHubDocs`
- Validation via `zod`

### Add a New Tool
Follow the pattern in `src/tools/github-docs.ts` (temporary filename) (see `copilot-instructions.md` for full guidelines):
1. Describe succinctly
2. Validate inputs with `zod`
3. Wrap logic in try/catch; return friendly failures
4. Keep responses concise

## Logging & Errors
- All operational logs to stderr
- User-facing messages are short, no stack traces

## Contributing
PRs welcome. Keep diffs minimal and aligned with existing style. See `copilot-instructions.md` for acceptance criteria.

## License
MIT
