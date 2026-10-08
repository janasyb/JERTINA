# Production Cutover Plan

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-023

---

## Purpose

Define the sequence for moving JERTINA from release candidate to production launch.

## Cutover Steps

1. Freeze release scope.
2. Confirm CI, smoke, build, and test status.
3. Verify monitoring and alerts.
4. Confirm backup integrity.
5. Confirm secrets and environment values.
6. Switch traffic to production endpoints.
7. Validate service health.
8. Monitor initial launch window.
9. Approve completion or initiate rollback.

## Roles

- Founder: final launch approval
- Engineering: technical execution
- Operations: monitoring and incident coordination
