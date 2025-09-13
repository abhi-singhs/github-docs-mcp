import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createWeatherServer } from "./server.js";
import { registerWeatherTools } from "./tools/weather.js";

// Express handler for stateless Streamable HTTP MCP requests
async function handleMcpRequest(req: Request, res: Response) {
  try {
    const server = createWeatherServer();
    registerWeatherTools(server);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
}

function startHttpServer() {
  const app = express();
  app.use(express.json());

  app.post("/mcp", handleMcpRequest);

  // Explicitly disallow GET/DELETE for stateless mode like spec example
  app.get("/mcp", (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    });
  });
  app.delete("/mcp", (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    });
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, () => {
    console.error(`Weather MCP Server (stateless Streamable HTTP) listening on port ${port}`);
  });
}

startHttpServer();