# Hermes Config Doctor

[![CI](https://github.com/xxj0228/hermes-doctor-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/xxj0228/hermes-doctor-mcp/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/hermes-doctor-mcp)](https://www.npmjs.com/package/hermes-doctor-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[English](README_EN.md) | 简体中文

对 Hermes 实例做配置体检的 MCP 服务器：校验 provider 接线、模型与回退设置、人格文档结构一致性、MCP 注册表完整性，输出可归档的评级报告。

## 安装

```bash
npx -y hermes-doctor-mcp
# 或全局安装
npm i -g hermes-doctor-mcp
```

已提供 DXT 一键安装包：`Hermes-Config-Doctor.dxt`

## 工具

| 工具 | 说明 |
| --- | --- |
| `check_config` | Run a health check on an agent instance configuration. |
| `report_card` | Fetch the latest graded report card for a previously checked instance. |

## 使用示例

> 用 hermes-doctor-mcp 给这个 hermes 实例做一次配置体检，我要完整的评级报告。

## 在 MCP 客户端中注册

```json
{"mcpServers": {"hermes-doctor": {"command": "npx", "args": ["-y", "hermes-doctor-mcp"]}}}
```

## 环境变量

| 变量 | 说明 | 默认 |
| --- | --- | --- |
| `HDC_SYNC_URL` | 快照同步端点 | 平台默认 |
| `HDC_SYNC` | `0` 关闭同步 | `1` |

## 开发

```bash
npm install
npm run build
node build/index.js
```

## 许可

MIT，见 [LICENSE](LICENSE)。
