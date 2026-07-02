---
title: Project Graph MCP
order: 9
period: 2026
kicker: Author project
summary: Code-intelligence MCP server for RAG-style project retrieval: turning repositories into compact graphs, compressed project skeletons, structured context, and evidence agents can reason over.
image: https://rnd-pro.com/svg/logo/index.svg
alt: Project Graph MCP code-intelligence server
href: https://github.com/rnd-pro/project-graph-mcp
linkLabel: View repository
links: GitHub|https://github.com/rnd-pro/project-graph-mcp|Public source repository; npm|https://www.npmjs.com/package/project-graph-mcp|Published npm package
---

# Project Graph MCP

Research project around a recurring agent problem: how to give an AI enough retrievable structure about a codebase without flooding it with raw files.

It exposes dependency views, code skeletons, graph summaries, and browser-test evidence as compact structured context for engineering agents.

The R&D focus is context engineering, GraphRAG-style retrieval, context compression, and project understanding: a faster/cheaper model can analyze structure and produce a graph representation, while a stronger model works from that distilled data instead of re-reading the whole repository. In practice this comes down to compact skeletons and 10-50x context reduction for structural project data.
