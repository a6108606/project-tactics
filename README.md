# Project Tactics

RPG tactique coopératif privé (1–4 joueurs), inspiré des principes de jeu de Disgaea et DOFUS, avec **univers et ressources originaux**.

**Décisions retenues** : monde 2D isométrique continu (aucun passage carte par carte), chargement par chunks, combats tactiques sur place, contrôle manuel du héros et des compagnons, initiative individuelle, progression modérée.

## Références
- [GDD v0.2](docs/GDD-v0.2.md)
- [Architecture technique](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Backlog](docs/backlog/ISSUES.md)
- [Runners locaux](docs/RUNNERS.md)
- [ADR runner](docs/adr/0001-self-hosted-runners.md)

## Technologies proposées
Godot 4 .NET (C#), simulation C# testable sans moteur, réseau ENet à hôte autoritaire, Git LFS pour assets volumineux.

## Vertical slice
Une zone continue de 128×128 cellules, 16 chunks de 32×32, village, forêt, rencontre et boss; 1 héros + 1 compagnon contrôlé manuellement par joueur; deux clients connectés dans une campagne privée.

## Statut
**Préproduction documentaire uniquement.** Aucun build, runner, pipeline externe ou service n'est installé/activé. Les chiffres sont des hypothèses de design à tester.

## CI
Tout job GitHub Actions doit cibler exclusivement des runners **auto-hébergés localement**. Aucun `ubuntu-latest`, `windows-latest` ou runner GitHub-hosted, même en repli. Workflow manuel seulement en V0.
