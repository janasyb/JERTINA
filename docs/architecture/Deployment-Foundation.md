# Deployment Foundation

## JERTINA

**Version:** v0.1.0  
**Status:** Draft for Review  
**Milestone:** RF-017

---

## Purpose

This milestone establishes the first deployment-ready environment layer for JERTINA.

## Goals

- Provide container files for the main apps and services.
- Standardize environment templates for local and production usage.
- Prepare the repository for future cloud deployment work.
- Keep deployment definitions inside version control.

## Deployment Targets

- Web storefront
- Admin portal
- API service
- AI service

## Strategy

- Use Docker for local and future container deployment.
- Keep environment values in example files.
- Use one compose file for local orchestration.
- Keep Dockerfiles close to their targets for clarity.
