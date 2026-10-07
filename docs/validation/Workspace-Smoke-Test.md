# Workspace Smoke Test

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-012

---

## Purpose

The workspace smoke test confirms that the key packages, services, and applications exist and can be loaded from the repository root.

---

## Checks

- Shared packages exist
- Services exist
- Applications exist
- Key entrypoints are present
- Modules can be imported without path errors

---

## Execution

Run from the repository root:

```powershell
pnpm.cmd smoke
```
