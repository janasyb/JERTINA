# Backend Services Architecture

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-007

---

## Service Layout

- `services/api` — HTTP entrypoint and route orchestration
- `services/auth` — authentication and session logic
- `services/commerce` — product and catalog business rules
- `services/orders` — order lifecycle and state transitions
- `services/inventory` — stock and availability logic
- `services/payments` — payment orchestration and provider adapters
- `services/notifications` — email, SMS, and platform notifications
- `services/search` — indexing and discovery orchestration

---

## Principles

- Each service has a clear domain boundary.
- Shared types live in `packages/types`.
- Shared utilities live in `packages/utils`.
- Database access flows through `packages/database`.
- Services remain modular and independently testable.
