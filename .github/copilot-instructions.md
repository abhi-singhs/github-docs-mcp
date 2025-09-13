# Copilot Instructions

These instructions define how AI assistants (and human contributors) should work within this repository.

## 0. Documentation
- MCP implementation Document: (docs/mcp.md)[docs/mcp.md]

## 1. Project Overview
- **Name:** GitHub Docs MCP Server (`github-docs`)
- **Purpose:** Provide GitHub documentation excerpts (enterprise site) via the Context7 API through the Model Context Protocol (MCP) standard I/O transport.
- **Primary Consumers:** AI clients / tooling that speak MCP.
- **Current Tools:**
  - `get_github_docs(topic: string)` — Returns a truncated (~5KB) excerpt of a GitHub documentation topic.

## 2. Tech Stack
- **Language:** TypeScript (compiled to Node.js JavaScript in `build/`)
- **Runtime:** Node 18+ (fetch API assumed available)
- **Key Dependencies:**
  - `@modelcontextprotocol/sdk` — MCP server framework
  - `zod` — Input schema validation
- **Entrypoints:**
  - Source: `src/index.ts`
  - Built file: `build/index.js`

## 3. Development Workflow
1. Install deps:
   ```bash
   npm install
   ```
2. Build:
   ```bash
   npm run build
   ```
3. (Optional) Run directly with `ts-node` if added later; currently build→run pattern.
4. Integrate with an MCP-compatible client by launching the built `build/index.js` over stdio.

## 4. Adding a New Tool
When creating a new MCP tool:
1. Define a clear, snake_case tool name.
2. Provide a concise description (imperative mood, present tense).
3. Use `zod` to declare and validate all inputs.
4. Perform external I/O via helper helpers (e.g., add beside `fetchGitHubDocs` or a new module if it grows).
5. Return structured content: prefer a single `type: "text"` block unless multiple modalities are required.
6. Handle all error paths with safe, user-friendly text (never throw uncaught errors from the handler).
7. Summarize or truncate payloads if > ~5 KB (consistent with `get_github_docs`).

Template snippet:
```ts
server.tool(
  "tool_name",
  "What the tool does (concise)",
  {
    paramA: z.string().describe("Meaningful description"),
    // ...more params
  },
  async ({ paramA }) => {
    try {
      // logic
      return { content: [{ type: "text", text: "Result text" }] };
    } catch (err) {
      console.error("tool_name error", err);
      return { content: [{ type: "text", text: "Failed to perform tool_name" }] };
    }
  }
);
```

## 5. Error Handling & Logging
- **Never** let an exception escape `server.tool` handlers; catch and return a friendly message.
- Log internal technical details to `stderr` with context tags (e.g., `fetchGitHubDocs:`).
- Avoid leaking stack traces or raw HTTP response bodies to the user-facing output.
- Network interactions should go through helper functions (`fetchGitHubDocs` or future equivalents) for consistency and headers.

## 6. API Interaction Guidelines (Context7 / External)
- Set a meaningful `User-Agent` (currently `github-docs-app/1.0`; update alongside version bumps).
- Respect rate limits: avoid aggressive parallel topic fetches; consider simple queue/backoff if expanding.
- Validate input parameters (topic strings non-empty, length bounds if needed) before fetch.
- For new endpoints, create narrow TypeScript interfaces for only required response fields.

## 7. Code Style
- Prefer small, pure helper functions.
- Type all function return values explicitly when exported.
- Use `const` over `let` unless reassignment is required.
- Keep line length reasonable (<120 chars).
- Avoid in-line comments explaining obvious code; focus comments on reasoning / non-obvious constraints.
- Use singular TypeScript interfaces for response fragments (e.g., `ForecastPeriod`).

## 8. Directory & Build Conventions
- All source code lives in `src/`.
- The build output directory is `build/` (git-ignored if configured; ensure build artifacts are not manually edited).
- Add new modules as additional `.ts` files; update imports accordingly.

## 9. Testing (Future Work)
Currently no automated tests. When adding:
- Use `vitest` or `jest` for unit tests.
- Mock fetch responses for deterministic tests.
- Add a `test` npm script.

## 10. Performance & Reliability
- Batch sequential external calls wherever possible (avoid duplicate calls inside loops — prefetch and reuse data structures).
- Fail fast on invalid inputs before hitting network.
- Degrade gracefully (partial data > full failure) but clearly label incomplete results.

## 11. Security & Safety
- Do not execute arbitrary user-provided URLs—construct them from validated components only.
- Never interpolate unsanitized input into headers beyond controlled values.
- Avoid adding dependencies that are unmaintained / low-signal. Prefer standard library or well-adopted libraries.

## 12. Versioning
- Update the `version` in server initialization (`createGitHubDocsServer`) and `package.json` together for user-agent & bin consistency.
- Document changes succinctly in a future `CHANGELOG.md` (not yet present).

## 13. Documentation Expectations
When adding features:
- Update this file if guidelines change.
- Add short JSDoc above new helper functions (what, not how).
- Keep tool descriptions accurate—they are surfaced to clients.

## 14. Common Pitfalls
- Forgetting to validate parameters — always use `zod` schemas.
- Returning large raw JSON — format or summarize instead.
- Letting unhandled promise rejections occur — always wrap async logic in try/catch at tool boundary.

## 15. Suggested Backlog (Optional)
- Add a `search_github_docs` tool (if API supports discovery) to list possible topics.
- Add caching (in-memory TTL) for frequent repeated topic queries.
- Provide metric logging hook (timings, success/failure counts).
- Introduce linting (`eslint + @typescript-eslint`) and formatting (`prettier`).

## 16. AI Assistant Conduct
When an AI assistant proposes code:
- Must not remove existing tools unless instructed.
- Must keep function signatures stable unless a migration is explicitly requested.
- Should propose minimal diffs; avoid sweeping refactors without necessity.
- Should verify TypeScript builds (`npm run build`) after changes.

## 17. Quick Reference
| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Build | `npm run build` |

## 18. Acceptance Criteria for New Tools
A PR (or AI change) adding a tool is acceptable if:
- Schema uses `zod` with descriptive `describe()` for each param.
- All network failures return a friendly text message.
- No uncaught exceptions are possible in handler.
- Output is human-readable, truncated/summarized if large, and not raw JSON unless explicitly required.

---
Maintainers & assistants should keep this document lean and accurate. Remove obsolete sections rather than letting them drift.
