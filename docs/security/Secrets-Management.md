# Secrets Management

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-018

---

## Rules

- Never commit live secrets.
- Use `.env.example` and `.env.production.example` as templates.
- Keep secrets in the deployment platform or secret manager.
- Rotate secrets on a schedule.
- Remove expired or unused secrets immediately.

## Secret Categories

- database credentials
- auth secrets
- storage credentials
- AI provider API keys
- third-party integration tokens

## Operational Guidance

- Use least privilege.
- Separate secrets by environment.
- Review access on every release milestone.
- Log secret usage only in secure systems.
