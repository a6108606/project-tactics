# Architecture technique — v0.2

## Principes
Godot 4 .NET pour client et présentation, **C# pur** pour domaine logique et tests. Un monde logique commun exploration/combat. Hôte autoritaire pour actions, inventaire et monde persistant. Monolithe modulaire, pas de microservices prématurés.

## Architecture
- **Game/Client** : TileMapLayer, sprites, caméra, VFX, UI, interpolation et chemin affiché.
- **Core/World** : WorldCell(X,Y,Height), ChunkId, ChunkRepository, world state, pathfinding inter-chunks, navigation.
- **Core/Combat** : TacticalGridBuilder, TurnScheduler, CommandValidator, CombatResolver, CombatEventLog, sérialisation.
- **Core/Characters** : stats, inventaire, classes, propriété, état d'unité.
- **Server/Session** : ENet/transport, autorité, sessions privées, intérêt spatial, sauvegardes.
- **Content** : données de classes, compétences, monstres, objets, cartes.
- **Tests** : unitaires pures + intégration 2 clients.

## Coordonnées
Cellule globale entière X,Y et niveau Height. Isométrie = projection de rendu, ne change pas les règles. ChunkId = floor(X/32), floor(Y/32), y compris valeurs négatives. L'exploration à sous-cellules se ramène à une cellule valide à l'entrée du combat.

## Streaming
- Monde visible découpé en chunks 32×32; fichier de chunk statique et état dynamique séparés.
- Préparer I/O et décodage hors du thread principal; appliquer les mutations de scènes/TileMapLayer sur le thread autorisé par Godot.
- Pool de ressources, budget mémoire et métriques de latence/p95.
- Le client charge autour de sa caméra; côté hôte états pertinents et zones d'intérêt de chaque joueur.
- Pin/ref-count des chunks impliqués dans des combats; ne jamais décharger leur géométrie logique pendant l'affrontement.
- Décharger la présentation n'efface jamais l'état du monde, des monstres ou des coffres.

## Exploration → combat → exploration
Engagement → verrouillage d'une zone locale → snapshot déterministe des cellules/hauteurs/obstacles → conversion des positions fluides en cellules légales → CombatState → journal d'actions → commit atomique des conséquences (PV, position, loot, états persistants) → retour au mode exploration au même endroit. Une seule rencontre par groupe en V0.

## Réseau et fiabilité
Client envoie **intention/commande**, hôte vérifie propriété, tour, PA/PM, portée, ressources, état et cible. Réponse : événements ordonnés avec séquence + hash état/snapshot de resynchronisation si besoin. Exploration via mise à jour positions pertinentes et interpolation. Combat fiable/ordonné. Tous les clients suivent les événements du serveur; n'inventent pas les résultats. Gestion des déconnexions initialement : pause/abandon sûr, pas migration d'hôte.

## Persistance
Save local versionnée côté hôte; IDs stables; progression héros/compagnons, objets, quêtes, états de chunks, positions. Sauvegardes atomiques (temp + rename), migrations de schéma documentées.

## Modules prévus
```
game/        Godot scenes, scripts, artwork
core/        C# World, Combat, Characters
content/     data definitions
server/      session host and persistence
tests/       core + integration
docs/        GDD, ADR, roadmap, performance reports
.github/     opt-in self-hosted CI only
```

## Tests à écrire en premier
Conversion coordonnées négatives, mouvement inter-chunks, collisions, cohérence du snapshot combat, ordre des tours, coûts PA/PM, propriété des unités, projectile avec relief, ref-count du pinning, commandes dupliquées/rejouées, synchronisation 2 clients.

## Contraintes de sécurité CI
**Runner exclusivement local**, voir [RUNNERS](RUNNERS.md). Pas de runner GitHub-hosted, pas de CI automatique non validée.
