import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function createGitHubDocsServer(): McpServer {
  return new McpServer({
    name: "github-docs",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });
}
