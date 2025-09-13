import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function createWeatherServer(): McpServer {
  return new McpServer({
    name: "weather",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });
}
