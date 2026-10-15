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

## Invocations — atelier et chara design (2026-10-15)
- [Règles et catalogue v0.5](docs/design/INVOCATIONS-v0.5.md) : 1–4 points par créature, cinq rangs, progression envisagée jusqu’à 1 000.
- [Brief chara design / prompt de reprise](docs/art/INVOCATIONS-CHARA-DESIGN.md) : dix créatures, rôles, silhouettes proposées et évolutions de rang.
- [Données structurées](content/summons/catalog-v0.5.json) : 10 créatures, 60 sorts, valeurs et coefficients proposés.
- [Modèle de croissance](content/summons/model-v0.5.cjs) et [tests](tests/summons-model-v0.5.test.cjs) : niveau, caractéristiques, Vitalité, résistances.
- [Atelier interactif](https://tactics-grimoire-atelier.a6108606.chatgpt.site?view=invocations).

## Stack
Godot 4 .NET / C#, separate engine-agnostic combat logic, ENet private sessions.

## Status
Preproduction plan only, no playable code yet.

## CI
GitHub Actions uses `ubuntu-latest`, triggered on pushes to main and PRs. Jobs are gated to run **only when the repository is public**. Tests execute automatically once a C# solution is added; Godot builds need a separate workflow in P0.

## License
No open-source code license has been selected yet. Public visibility does not itself grant reuse rights. Do not add third-party proprietary assets.
