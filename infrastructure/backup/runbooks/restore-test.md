# Restore Test Runbook

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-020

---

## Steps

1. Create or select a backup artifact.
2. Run the restore validation script.
3. Verify data integrity.
4. Confirm dependent services are healthy.
5. Log the result of the test.

## Command

```powershell
node scripts/restore-database.mjs <backup-file>
```
