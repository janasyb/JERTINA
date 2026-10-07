# Runtime Execution

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-014

---

## Purpose

This document captures how the main runtime commands map to the repository.

---

## Runtime Commands

- `pnpm dev` → workspace development mode
- `pnpm build` → workspace build pass
- `pnpm test` → workspace test pass
- `pnpm typecheck` → workspace typecheck pass
- `pnpm smoke` → repository smoke test
- `pnpm validate:structure` → repository structure validation

---

## Service Runtimes

- `services/api` → `pnpm --filter @jertina/api dev`
- `services/ai` → `pnpm --filter @jertina/ai dev`
- `apps/web` → `pnpm --filter @jertina/web dev`
- `apps/admin` → `pnpm --filter @jertina/admin dev`
