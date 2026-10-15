# Backlog — issues publiées

Les IDs PT-001 à PT-024 sont des identifiants de planification; les numéros GitHub peuvent différer.

- **PT-001 · P0** Bootstrap Godot .NET et conventions de dépôt — Projet Godot 4 .NET ouvrable sous Linux; README build et conventions.
- **PT-002 · P0** Installer core C# et tests xUnit — Tests du domaine sans lancer Godot; commande dotnet test documentée.
- **PT-003 · P0** ADR architecture serveur autoritaire et projection isométrique — Documenter invariants, frontières du domaine, responsabilités.
- **PT-004 · P1** Définir modèle monde, coordonnées et ChunkId — Tester négatifs, hauteurs, coordonnées globales et locales.
- **PT-005 · P1** Implémenter ChunkRepository et chargement asynchrone sûr — Load/unload sans perte d'état; changements de scène sur thread Godot approprié.
- **PT-006 · P1** Rendu isométrique 16 chunks et caméra — Traverser la région sans transition; mesurer p95 des frames.
- **PT-007 · P2** A* inter-chunks et collisions — Chemin validé à travers frontières et obstacles.
- **PT-008 · P2** Click-to-move et prévisualisation du trajet — Un clic distant produit un chemin correct et visible.
- **PT-009 · P3** Héros, compagnon suiveur et patrouilles visibles — Compagnon suit hors combat sans blocage récurrent.
- **PT-010 · P4** EncounterManager, pinning de chunks et snapshots — Terrain snapshot concordant et chunks épinglés pendant combat.
- **PT-011 · P4** Projection monde vers grille tactique et retour — Combats au même endroit, aucune arène séparée.
- **PT-012 · P5** Scheduler d'initiative individuelle — Une activation par unité par round; départages déterministes.
- **PT-013 · P5** Coûts PA/PM, sorts, états et validation — Le serveur rejette toutes les actions illégales, tests unitaires.
- **PT-014 · P5** Contrôle manuel compagnon et IA ennemie — Combat solo complet sans IA pour le compagnon.
- **PT-015 · P6** Hauteur, ligne de vue et effets de terrain — Tests limites portée/élévation/obstacles.
- **PT-016 · P6** Porter/lancer et consentement du propriétaire — Pas de destination invalide ni déplacement sans autorisation.
- **PT-017 · P6** Combo à deux unités et réservation de PA — Débits atomiques, impossibilité double-dépense.
- **PT-018 · P7** Session privée deux joueurs et ownership — Deux clients synchronisés; chacun ne commande que ses unités.
- **PT-019 · P7** Journal d'événements, séquences et replay — Détecter divergences d'état; replay reproductible.
- **PT-020 · P8** Village, forêt, boss et récompenses — Session complète 20–30 min jouable.
- **PT-021 · P8** Sauvegarde locale versionnée — Rechargement identique de progression et état du monde.
- **PT-022 · P9** Benchmark streaming et profil FPS — Mesures et environnement reproduits dans docs.
- **PT-023 · P9** Runner local dédié et workflow à activation manuelle — Aucun job GitHub-hosted; VM locale isolée, revue de sécurité avant activation.
- **PT-024 · P9** Release de test Linux et Windows — Builds testés sur plateformes cibles, procédure reproductible.
