import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGitHubDocs } from '../src/context7.js';

// Helper to mock global fetch
function mockFetchOnce(response: { ok: boolean; status?: number; body?: string }) {
  (globalThis.fetch as any) = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    text: async () => response.body ?? '',
  });
}

describe('fetchGitHubDocs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns content field when JSON has content', async () => {
    const payload = JSON.stringify({ content: 'Hello Docs' });
    mockFetchOnce({ ok: true, body: payload });
    const result = await fetchGitHubDocs('enterprise');
    expect(result).toBe('Hello Docs');
  });

  it('falls back to raw JSON text when content field missing', async () => {
    const payload = JSON.stringify({ somethingElse: 'value' });
    mockFetchOnce({ ok: true, body: payload });
    const result = await fetchGitHubDocs('missing');
    expect(result).toBe(payload);
  });

  it('returns plain text when non-JSON body', async () => {
    const body = 'Plain text body';
    mockFetchOnce({ ok: true, body });
    const result = await fetchGitHubDocs('plaintext');
    expect(result).toBe(body);
  });

  it('returns null on HTTP error', async () => {
    mockFetchOnce({ ok: false, status: 404, body: 'Not Found' });
    const result = await fetchGitHubDocs('bad');
    expect(result).toBeNull();
  });

  it('returns null on thrown fetch rejection', async () => {
    (globalThis.fetch as any) = vi.fn().mockRejectedValue(new Error('network'));
    const result = await fetchGitHubDocs('error');
    expect(result).toBeNull();
  });
});
