# Workspace Smoke Test

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-013

---

## Purpose

The workspace smoke test confirms that the repository contains the expected files and package manifests across the platform.

---

## Checks

- Root repository files exist
- Shared packages exist
- Services exist
- Applications exist
- Package manifests parse correctly
- The lockfile is present

---

## Execution

Run from the repository root:

```powershell
pnpm.cmd smoke
```
