# ADR-0002 — Public repository with GitHub-hosted CI

**Status:** Accepted · **Date:** 2026-10-15 · Supersedes ADR-0001.

## Context
The owner prefers a public repository and GitHub-managed runners instead of provisioning CI machines locally.

## Decision
Use GitHub-hosted `ubuntu-latest` for routine CI. Workflow triggers on `push` to main, `pull_request` to main, and manually. A job-level condition `github.event.repository.private == false` prevents the jobs from executing until the repository visibility is changed to public by the owner.

## Boundaries
- No secrets, customer data, proprietary source, hardware configuration, personal addresses or internal infrastructure configuration in public history.
- Read-only GitHub token; never use `pull_request_target` with untrusted code.
- P0 implements real C# tests and subsequent Godot build validation.
- Future workflows must default to GitHub-hosted runners; use local runners only with a new explicit decision.
- Public access does **not** determine code licensing; choose a license explicitly before accepting contributions.

## Cost
Check current GitHub Actions terms, quotas and usage periodically. Verify visibility change in settings and confirm workflows operate only after the repo is public.
