# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, bootstrapped with `create-next-app`. Deploy target: Vercel.

**Important:** installed Next.js is v16.2.11, newer than this model's training data — App Router conventions/APIs may differ from what you'd expect. Check `node_modules/next/dist/docs/01-app/` before relying on remembered Next.js behavior (see `AGENTS.md` at repo root).

## Commands

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)

No test runner is configured yet.

## Structure

- `src/app/` — App Router pages/layouts (`layout.tsx`, `page.tsx`, `globals.css`). Site content currently lives entirely in `src/app/page.tsx` (default create-next-app starter, not yet customized).
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Tailwind v4 is configured via `@tailwindcss/postcss` in `postcss.config.mjs` (no separate `tailwind.config.js` — v4 uses CSS-based config in `globals.css`).

## Project goal

A personal portfolio website for the site owner, an AI/automation freelancer/developer. The site must present and showcase their project work, including:

- AI agents that solve business problems
- Business/company process automation
- Websites with AI agents that auto-generate and publish blog articles
- Bots of various kinds (task bots, workflow bots, etc.)
- Chatbots and AI clones for companies that answer end-user questions
- Advertising, social media management, and copywriting services

## Design direction

- Visually modern and cutting-edge — this is a portfolio meant to demonstrate the owner's skill, so design quality itself is part of the pitch.
- Unique, polished graphic animations are a core requirement, not a nice-to-have.
- The site should function as a personal showcase: who the owner is, and the full range of what they build.

## Notes

- An MCP tool permission for `generate-design` is already granted in `.claude/settings.local.json`, suggesting design/graphic asset generation via MCP is expected to be part of the workflow.
