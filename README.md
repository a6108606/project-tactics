# Project Tactics

Original 2D isometric tactical cooperative RPG project, inspired by the tactical depth of Disgaea and DOFUS. World and assets must be original.

## Product direction
Continuous 2D isometric world with chunk streaming, encounters on the existing terrain, manual hero and companion control, individual initiative, moderate progression and 1–4 players in private co-op sessions.

## Planning documents
- [GDD v0.2](docs/GDD-v0.2.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Backlog](docs/backlog/ISSUES.md)
- [CI on GitHub-hosted runners](docs/RUNNERS.md)
- [ADR 0002 — CI decision](docs/adr/0002-github-hosted-ci.md)

## Stack
Godot 4 .NET / C#, separate engine-agnostic combat logic, ENet private sessions.

## Status
Preproduction plan only, no playable code yet.

## CI
GitHub Actions uses `ubuntu-latest`, triggered on pushes to main and PRs. Jobs are gated to run **only when the repository is public**. Tests execute automatically once a C# solution is added; Godot builds need a separate workflow in P0.

## License
No open-source code license has been selected yet. Public visibility does not itself grant reuse rights. Do not add third-party proprietary assets.
