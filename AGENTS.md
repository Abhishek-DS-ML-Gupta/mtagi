# AGENTS.md

This document provides guidance for AI coding agents working in this repository.

## Project Overview

This is an **Mtagi** project written in TypeScript. Mtagi is an AI-powered agent and chat system with a modern TypeScript stack.

## Commands

Use these commands to interact with the project.

### Installation

```bash
bun install
```

### Development

Start the development server by running the `dev` script:

```bash
bun run dev
```

### Build

In order to build a production-ready server, run the `build` script:

```bash
bun run build
```

## Project Structure

Folders organize your agent's resources, like agents, tools, and workflows.

| Folder                | Description                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/mtagi`           | Entry point for all Mtagi-related code and configuration.                                                                                |
| `src/mtagi/agents`    | Define and configure your agents - their behavior, goals, and tools.                                                                     |
| `src/mtagi/workflows` | Define multi-step workflows that orchestrate agents and tools together.                                                                  |
| `src/mtagi/tools`     | Create reusable tools that your agents can call                                                                                          |
| `src/mtagi/mcp`       | (Optional) Implement custom MCP servers to share your tools with external agents                                                         |
| `src/mtagi/scorers`   | (Optional) Define scorers for evaluating agent performance over time                                                                     |
| `src/mtagi/public`    | (Optional) Contents are copied into the `.build/output` directory during the build process, making them available for serving at runtime |

### Top-level files

Top-level files define how your Mtagi project is configured, built, and connected to its environment.

| File                 | Description                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/mtagi/index.ts` | Central entry point where you configure and initialize Mtagi.                                                     |
| `.env.example`       | Template for environment variables - copy and rename to `.env` to add your secret [model provider](/models) keys. |
| `package.json`       | Defines project metadata, dependencies, and available npm scripts.                                                |
| `tsconfig.json`      | Configures TypeScript options such as path aliases, compiler settings, and build output.                          |

