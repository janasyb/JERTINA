# Rollback Plan

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-023

---

## Purpose

Provide the fallback path when launch validation fails or a critical issue appears after cutover.

## Rollback Triggers

- failed smoke or build verification
- major service outage
- data integrity issue
- critical security issue
- repeated error spikes after launch

## Rollback Steps

1. Stop new traffic.
2. Restore previous deployment state.
3. Verify service availability.
4. Validate data integrity.
5. Confirm monitoring stability.
6. Document the incident.
7. Resume only after explicit approval.
