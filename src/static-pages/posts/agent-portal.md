---
title: Agent Portal
order: 1
period: 2025-2026
kicker: Selected project
summary: R&D workspace for AI-assisted engineering and loop engineering: project memory, context engineering, RAG-style context retrieval, graph-based context, model/resource routing, task orchestration, evals/guardrails, and controlled delivery.
image: https://rnd-pro.com/svg/logo/index.svg
alt: Agent Portal AI engineering workspace
href: https://rnd-pro.com/projects/agent-portal/
linkLabel: View project
---

# Agent Portal

Built around a practical R&D question: how can teams use several AI agents without losing context, ownership, verification, and control?

The product combines durable project memory, context engineering, RAG-style context retrieval, model routing, tool use, task orchestration, and browser-facing operations into one engineering environment that keeps AI-assisted work auditable.

One focus is resource-aware agent development: the board and resource groups route work to agents with different model tiers, so routine or exploratory tasks can run on cheaper/faster models while stronger models operate on the distilled project context and make higher-impact decisions.

The current R&D line is loop engineering for autonomous software work: running coding agents end to end — picking up a task, working in an isolated branch, proving the work is done, then reviewing and merging — with evals, guardrails, observability, and human-in-the-loop control when the loop cannot safely continue.

Agent Portal is built on a suite of MCP servers I authored, each usable on its own and composed into the product: agent execution (Agent Pool), graph-based code intelligence and retrieval (Project Graph), and browser, context, and terminal automation.
