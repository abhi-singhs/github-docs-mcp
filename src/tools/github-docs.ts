import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchGitHubDocs } from "../context7.js";

export function registerGitHubDocsTools(server: McpServer): void {
  server.tool(
    "get_github_docs",
    "Fetch GitHub Enterprise documentation excerpt by topic",
    {
      topic: z.string().min(1).describe("Topic slug or keyword to fetch (e.g. enterprise, actions, security)"),
    },
    async ({ topic }) => {
      const data = await fetchGitHubDocs(topic.trim());
      if (!data) {
        return { content: [{ type: "text", text: `Failed to retrieve GitHub documentation for topic: ${topic}` }] };
      }
      const MAX_LEN = 5000;
      let text = data;
      if (text.length > MAX_LEN) {
        text = text.slice(0, MAX_LEN) + "\n... (truncated)";
      }
      return { content: [{ type: "text", text: `GitHub Docs (${topic})\n\n${text}` }] };
    }
  );
}
