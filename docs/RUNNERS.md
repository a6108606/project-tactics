# GitHub Actions — GitHub-hosted CI

Decision superseded by [ADR-0002](adr/0002-github-hosted-ci.md). Project Tactics is intended to be **public** and use GitHub-hosted runners (`ubuntu-latest`) for CI; self-hosted runners are not required.

Workflow: `.github/workflows/local-ci.yml` (legacy filename; workflow name is CI). Triggered on pushes to main, pull requests and manual requests.

**Safety gate:** job runs only when `github.event.repository.private == false`. Before visibility is changed to public, the job is skipped. The owner must change visibility in GitHub Settings manually because repository visibility is not writable through the connected GitHub tool.

Current checks: presence of planning documents and `dotnet test` when a root C# solution exists. This does NOT yet build the Godot project or run game integration tests; expand coverage in P0.

Security: minimal read-only token permissions, no committed secrets, no client data. Do not add sensitive assets/files before going public. Review repository history, issues and branches before publishing. Public fork PRs must never receive privileged tokens or secrets.
