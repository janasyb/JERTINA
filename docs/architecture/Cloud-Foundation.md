# Cloud Foundation

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-018

---

## Purpose

This milestone establishes the cloud and secrets management foundation for JERTINA.

## Goals

- Define environment tiers for local, staging, and production.
- Establish a standard secrets-handling workflow.
- Prepare the repository for provider-specific infrastructure.
- Keep deployment assumptions explicit and reviewable.

## Environment Tiers

- local
- development
- staging
- production

## Core Principles

- Secrets are never committed.
- Environment variables are documented and versioned as templates.
- Production values are managed outside the repository.
- Infrastructure code should remain provider-agnostic until the deployment target is selected.
