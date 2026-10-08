# Performance Budgets

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-022

---

## Budget Targets

### Web Storefront
- First contentful render: under 2.5s on standard broadband
- Largest contentful paint: under 3.0s on standard broadband
- JavaScript bundle growth: review on every major release

### Admin Portal
- Dashboard interactive time: under 3.0s on standard broadband
- Critical UI paths should remain responsive under normal load

### API
- Health check response: under 500ms in healthy environments
- Core endpoints should remain predictable and observable

---

## Review Requirement

Performance regressions must be reviewed before production release.
