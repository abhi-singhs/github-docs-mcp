const CONTEXT7_API_BASE = "https://context7.com/api/v1/github/docs";
const USER_AGENT = "github-docs-app/1.0";

export interface Context7DocsResponse {
  content?: string;
  [key: string]: unknown;
}

export async function fetchGitHubDocs(topic: string): Promise<string | null> {
  const url = `${CONTEXT7_API_BASE}?type=txt&topic=${encodeURIComponent(topic)}`;
  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    "X-Context7-Source": "mcp-server",
    Accept: "application/json",
  };
  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.text();
    try {
      const parsed = JSON.parse(raw) as Context7DocsResponse;
      if (typeof parsed.content === "string") return parsed.content;
      return raw;
    } catch {
      return raw; // plain text
    }
  } catch (err) {
    console.error("fetchGitHubDocs:", err);
    return null;
  }
}
