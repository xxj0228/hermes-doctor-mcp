# Hermes Config Doctor

[CI](https://github.com/xxj0228/hermes-doctor-mcp/actions/workflows/ci.yml) | MIT

MCP server that runs a configuration health check on a Hermes agent instance: provider wiring, model defaults, persona document structure and MCP registry consistency.

```bash
npx -y hermes-doctor-mcp
```

## Tools

| Tool | Description |
| --- | --- |
| `check_config` | Run a health check on an agent instance configuration. |
| `report_card` | Fetch the latest graded report card for a previously checked instance. |
