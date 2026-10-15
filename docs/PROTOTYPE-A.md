# Prototype A — Exploration continue (P0/P1)

## Statut
Premier code de démonstration, non validé sur une installation Godot réelle. Aucun jeu complet, aucun combat, aucun réseau. À examiner et tester sur GitHub CI avant merge.

## Lancer localement
1. Installer **Godot 4.3 .NET** et **.NET SDK 8** sur Linux ou Windows.
2. Ouvrir le dossier `game/` depuis Godot .NET.
3. Construire le projet C# si Godot le demande et lancer la scène principale.
4. Clic gauche pour se déplacer; molette pour zoomer; un compagnon violet suit le héros bleu.
5. Le terrain est dessiné procéduralement avec une grille logique 128×128 cellules / 16 chunks de 32×32.

## Limitations délibérées
- Pas encore de véritable I/O de chunks ni de chargement d'assets asynchrone : la fenêtre visible est dessinée à la volée; `_loaded` simule le périmètre d'intérêt.
- Objets et personnages temporaires vectoriels, pas de direction artistique définitive.
- Pas de collisions physiques Godot, uniquement grille logique bloquante.
- Pas d'animations de sprites, de combat ou de coop.
- Pas d'optimisation du rendu pour une vaste zone.
- Les déplacements peuvent être interrompus par un nouveau clic; compagnon uniquement en exploration.

## Validation
`dotnet run --project tests/ProjectTactics.Smoke/ProjectTactics.Smoke.csproj -c Release` vérifie la projection isométrique, les chunks (y compris négatifs) et un trajet inter-chunks.

## Étape suivante
Vérifier build Godot headless dans une CI dédiée; profiler le rendu, ajouter cache réel des chunks puis décors et animations temporaires. Ne pas promettre de streaming réel avant cette implémentation.
