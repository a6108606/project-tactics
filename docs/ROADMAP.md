# Roadmap — Project Tactics

## Portée
Vertical slice en 2D isométrique avec monde continu de 128×128 cellules (16 chunks 32×32), 2 joueurs privés maximum validés, un héros et un compagnon manuel chacun, combat sur place. Préproduction : les durées doivent être recalibrées selon compétences/ressources.

| Lot | Objectif | Gate de sortie |
|---|---|---|
| P0 — Fondations | Godot .NET, domaine C#, tests, ADR | build local reproductible |
| P1 — Monde continu | 16 chunks, streaming et caméra | aucune transition de carte |
| P2 — Navigation | clic, collisions, A* inter-chunks | traversée correcte |
| P3 — Personnages | héros, compagnon suiveur, patrouilles | navigation stable |
| P4 — Combat sur place | snapshot de terrain, overlay, retour | aucune arène séparée |
| P5 — Combat complet | initiative, PA/PM, sorts, IA | victoire solo |
| P6 — Disgaea-like | hauteur, porter/lancer, combo | tests de bord |
| P7 — Coop | 2 clients, ownership, logs | états identiques |
| P8 — Contenu | village, forêt, boss, progression | 20–30 min jouables |
| P9 — Validation | profil streaming, sauvegardes, builds | tests et rapports archivés |

## Stratégie
Développer d'abord Prototype A (exploration continue), puis B (combat sur place), puis C (coopération). Pas d'extension de carte tant que les tests de streaming, combat et synchronisation ne sont pas acceptés.

## Cadence
Les issues sont classées dans [ISSUES.md](backlog/ISSUES.md). Chaque PR documente tests, captures/logs, risques et conformité au scope. Aucun runner activé automatiquement.
