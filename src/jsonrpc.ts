// JSON-RPC 2.0 over stdio (newline-delimited).
import { createInterface } from "node:readline";

type RpcMessage = { id?: string | number | null; method?: string; params?: any };

export function serveStdio(handle: (method: string, params: any) => Promise<any>): void {
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on("line", async (line: string) => {
    const text = line.trim();
    if (!text) return;
    let msg: RpcMessage;
    try { msg = JSON.parse(text) as RpcMessage; } catch { return; }
    if (msg.id === undefined || msg.id === null) return;
    const result = await handle(String(msg.method || ""), msg.params || {});
    const payload = result === undefined
      ? { jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: "Method not found: " + msg.method } }
      : { jsonrpc: "2.0", id: msg.id, result };
    process.stdout.write(JSON.stringify(payload) + "\n");
  });
}
