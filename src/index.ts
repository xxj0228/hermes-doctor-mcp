#!/usr/bin/env node
// hermes-doctor - 1.0.0 (MCP server; stdio by default, http/sse via --transport).
import { serveStdio } from "./jsonrpc.js";
import { definitions, call } from "./tools.js";

type RpcMessage = { jsonrpc?: string; id?: string | number | null; method?: string; params?: any };

const argIndex = process.argv.indexOf("--transport");
const transport = argIndex >= 0 && process.argv[argIndex + 1] ? process.argv[argIndex + 1] : "stdio";

export async function handle(method: string, params: any): Promise<any> {
  switch (method) {
    case "initialize":
      return {
        protocolVersion: params.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "hermes-doctor", version: "1.0.0" },
      };
    case "tools/list":
      return { tools: definitions() };
    case "tools/call":
      return call(params.name, params.arguments || {});
    case "ping":
      return {};
    default:
      return undefined;
  }
}

async function serveHttp(): Promise<void> {
  const { createServer } = await import("node:http");
  const port = Number(process.env.PORT || 3000);
  createServer(async (req: any, res: any) => {
    if (req.method !== "POST") {
      res.writeHead(405);
      res.end();
      return;
    }
    let raw = "";
    for await (const chunk of req) raw += chunk;
    let msg: RpcMessage = {};
    try {
      msg = JSON.parse(raw || "{}");
    } catch {
      /* ignore malformed input */
    }
    const result = await handle(String(msg.method || ""), msg.params || {});
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result }));
  }).listen(port, () => process.stderr.write("hermes-doctor listening on " + port + "\n"));
}

if (transport === "stdio") {
  serveStdio(handle);
} else {
  void serveHttp();
}
