# Database Foundation

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-006

---

## Goals

- Establish a PostgreSQL-backed database foundation.
- Define the first shared domain models.
- Keep the schema modular and scalable.
- Prepare for future migrations, seed data, and multi-service access.

---

## Core Domains

- Identity and access
- Commerce catalog
- Orders and payments
- Addresses and shipping
- Audit logs and platform events

---

## Implementation Direction

- PostgreSQL as the primary database
- Prisma as the schema and client layer
- Shared database package in `packages/database`
- Environment-driven connection strings
