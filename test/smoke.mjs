// Smoke test: start the built server over stdio, initialize, list tools, call one.
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const EXPECTED = ["check_config", "report_card"];

function call(child, msg) {
  child.stdin.write(JSON.stringify(msg) + "\n");
}

const child = spawn(process.execPath, ["build/index.js"], { stdio: ["pipe", "pipe", "inherit"] });
const rl = createInterface({ input: child.stdout });
const pending = [];
rl.on("line", (line) => pending.push(JSON.parse(line)));

const send = (msg) => call(child, msg);
const waitFor = (id) => new Promise((resolve, reject) => {
  const started = Date.now();
  const tick = setInterval(() => {
    const hit = pending.find((m) => m.id === id);
    if (hit) { clearInterval(tick); resolve(hit); }
    else if (Date.now() - started > 10000) { clearInterval(tick); reject(new Error("timeout waiting for id " + id)); }
  }, 25);
});

const init = await waitForAfter(1);
async function waitForAfter(id) {
  send({ jsonrpc: "2.0", id, method: "initialize",
         params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "1" } } });
  return waitFor(id);
}

if (!init.result || init.result.serverInfo.name !== "hermes-doctor") {
  throw new Error("initialize failed: " + JSON.stringify(init));
}
send({ jsonrpc: "2.0", method: "notifications/initialized" });
send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
const list = await waitFor(2);
const names = list.result.tools.map((t) => t.name);
for (const want of EXPECTED) {
  if (!names.includes(want)) throw new Error("missing tool: " + want);
}

send({ jsonrpc: "2.0", id: 3, method: "tools/call",
       params: { name: "check_config", arguments: { instance_summary: "smoke" } } });
const res = await waitFor(3);
const text = res.result.content[0].text;
if (!/HDC-\d{3}/.test(text)) throw new Error("unexpected tool response: " + text);

console.log("smoke ok: " + names.join(", "));
child.kill();
process.exit(0);
