# Service Runtime Consolidation

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-015

---

## Goals

- Make the API and AI services self-contained and runnable.
- Produce a real build artifact for each service.
- Remove scaffold-only build commands from the runtime packages.
- Keep the repository portable and reviewable.

---

## Runtime Strategy

- Use plain Node runtimes for service entrypoints.
- Copy runtime files into `dist/` during build.
- Keep build output predictable for CI and deployment.
- Continue to use the shared workspace structure for orchestration.

---

## Target Services

- `services/api`
- `services/ai`
