# Weather MCP Server

A Model Context Protocol (MCP) server exposing National Weather Service (NWS) alert and forecast data to AI clients over stdio.

## Features
- `get_alerts` – Active weather alerts by 2‑letter US state code
- `get_forecast` – Multi-period forecast for a latitude/longitude (US only)

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

## Run (stdio)
Integrate with an MCP-compatible client (the client is responsible for spawning the process over stdio):
```bash
node build/index.js
```
You should see on stderr:
```
Weather MCP Server running on stdio
```

## Tool Schemas
### get_alerts
Input:
```json
{ "state": "CA" }
```
Output: Text summary of active alerts or a no-alerts message.

### get_forecast
Input:
```json
{ "latitude": 37.7749, "longitude": -122.4194 }
```
Output: Text table-like list of forecast periods.

## Development
- Source in `src/`
- Compiled JS in `build/`
- Shared HTTP helper: `makeNWSRequest`
- Validation via `zod`

### Add a New Tool
Follow the pattern in `src/index.ts` (see `copilot-instructions.md` for full guidelines):
1. Name in `snake_case`
2. Describe succinctly
3. Validate inputs with `zod`
4. Wrap logic in try/catch; return friendly failures
5. Keep responses concise

## Logging & Errors
- All operational logs to stderr
- User-facing messages are short, no stack traces

## Roadmap (Short List)
- Point metadata tool
- In-memory caching layer
- Test suite (vitest)
- ESLint + Prettier

## Contributing
PRs welcome. Keep diffs minimal and aligned with existing style. See `copilot-instructions.md` for acceptance criteria.

## License
TBD (no explicit license file yet).
