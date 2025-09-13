import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGitHubDocsTools } from '../src/tools/github-docs.js';

// We'll intercept fetchGitHubDocs by mocking the global fetch, since the helper is used internally.

describe('get_github_docs truncation', () => {
  it('truncates responses larger than 5000 chars', async () => {
    const big = 'A'.repeat(6000);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ content: big })
    }) as any;

    const server = new McpServer({ name: 'test', version: '1.0.0' });
    let capturedHandler: any;
    // Intercept tool registration to capture handler without relying on internal structure
    const originalTool = (server as any).tool.bind(server);
    (server as any).tool = (name: string, description: string, schema: any, handler: any) => {
      if (name === 'get_github_docs') capturedHandler = handler;
      return originalTool(name, description, schema, handler);
    };
    registerGitHubDocsTools(server);
    expect(capturedHandler).toBeDefined();

    const result = await capturedHandler({ topic: 'enterprise' });
    const textBlock = result.content[0];
    expect(textBlock.type).toBe('text');
    const txt: string = (textBlock as any).text;
    expect(txt.length).toBeLessThanOrEqual(5100); // includes header + truncated marker
    expect(txt).toContain('... (truncated)');
  });
});
