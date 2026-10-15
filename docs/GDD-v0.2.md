# Project Tactics — Game Design Document v0.2
Date : 2026-10-15 · Statut : préproduction · Valeurs chiffrées à tester

## Vision
Jeu de rôle tactique en coop privée de 1 à 4 joueurs. Monde original 2D isométrique continu façon illustration de RPG, sans transition carte par carte. Des ennemis visibles déclenchent une grille tactique **sur le terrain existant**. Le monde et les visuels sont originaux; ne pas utiliser les assets, marques ou codes propriétaires des jeux de référence.

## Décisions figées
- Contrôle : héros et compagnons **manuels en combat**; les compagnons suivent en exploration.
- Tours : initiative individuelle, 1 activation/unité/round.
- Progression : modérée (niveaux, classes, équipements), sans réincarnation / Item World en V0.
- Session : monde privé 1–4 joueurs; validation initiale à 2 joueurs.
- Rendu : sprites 2D, décors isométriques, caméra fixe avec suivi et zoom.
- Navigation : clic, chemin fluide, grille logique unique; passage inter-chunks invisible.
- Combats : mêmes coordonnées et terrain qu'en exploration; jamais d'arène séparée.

## Exploration et monde
- Région de vertical slice : **128×128 cellules**, chunks **32×32** (16 chunks au total).
- Cellule : X,Y, hauteur logique (0–2), terrain, passabilité, collision, occultation, coût PM.
- Tuiles graphiques de référence : **128×64 pixels**, à optimiser et valider.
- Chargement client autour des joueurs : rayon indicatif de 2 chunks, préchargement vers la direction de marche.
- États dynamiques persistés séparément de la géométrie; un chunk peut être déchargé visuellement sans perdre son état.
- Les positions fluides d'exploration se projettent sur la même grille logique pour le combat.
- Compagnon suiveur en exploration; propriété individuelle et contrôle entièrement manuel lors des tours.
- Un combat actif par groupe dans le vertical slice; les membres doivent être rassemblés pour y participer.

## Règles tactiques provisoires
| Paramètre | Proposition |
|---|---|
| Grille de référence | Portion locale de monde, environ 12×12 cellules |
| PA / PM | 6 PA / 3 PM à chaque activation |
| PV de référence | 100 |
| Initiative | 100, ordre décroissant fixé au début; égalités départagées de manière stable |
| Tour humain | 30 s configurables, hors mode solo pause |
| Portée de lancer | 3 cellules |
| Niveaux de relief | 0,1,2 |
| Franchissement | 1 niveau maximum, +1 PM |
| Bonus d'attaque en hauteur | +10 % pour actions éligibles |
| Déplacement horizontal | 1 PM/cellule |
| Attaque simple | 3 PA |
| Compétence légère / forte | 2 / 4 PA |
| Porter / lancer | 2 / 2 PA |
| Terrain difficile | +1 PM à l'entrée |
| Feu | 10 dégâts à l'entrée, une fois/activation |
| Protection | -20 % de dégâts subis |
| Niveaux V0 / cible | 1–5 / 100 |

Ordre d'initiative individuel pour héros, compagnons et monstres; PA/PM rechargés lors de chaque activation. Le serveur valide coûts, propriétaire, cible, portée, collision et état avant d'appliquer les effets. Actions et événements journalisés pour diagnostic et replay.

## Projection, hauteur, combos
- Une seule unité portée; case de destination libre et valide; aucune projection à travers un obstacle.
- Boss non portables; consentement explicite du propriétaire pour porter un allié.
- Combo entre deux alliés : 3 PA initiateur + 2 PA partenaire, débit atomique; 150 % des dégâts simples de référence, une utilisation/unité/round en V0.
- Ligne de vue tenant compte de la hauteur, des obstacles et de la cellule cible.
- Aucun effet de chute complexe ou empilement de personnages en V0.

## Classes V0
- **Guerrier** : Frappe 3 PA/portée 1/25 dégâts; Garde 2 PA/-30 % dégâts jusqu'à prochaine activation; projection.
- **Mage** : Projectile 3 PA/portée 1–5/22 dégâts; Explosion 4 PA/portée 2–4/18 dégâts de zone (feu ami activé); Mur 3 PA/2 cellules temporaires.
- **Soigneur** : après vertical slice : soin 25 PV/3 PA, bouclier 20/3 PA, +1 PM/2 PA.

## Ennemis V0
- Brute : 100 PV, 6 PA, 3 PM, 20 dégâts contact.
- Archer : 70 PV, 6 PA, 3 PM, 16 dégâts à distance.
- Boss Gardien : 300 PV, 6 PA, 3 PM, attaque de zone télégraphiée.
- IA ennemie déterministe simple (distance, dégâts attendus, danger, obstacles), sans LLM.

## Compagnons et progression
Un héros et un compagnon actif par joueur pendant le vertical slice; collection de compagnons extensible ultérieurement. Progression par classe, points de vie +5 et caractéristique principale +2 par niveau (hypothèses). PA/PM fixes sur niveaux 1–5. Équipements arme/armure/2 accessoires; environ 10 objets dans la démo.

## Rencontre sur place
1. Ennemi visible engagé dans le monde.
2. Hôte fige les positions des participants et détermine le périmètre local.
3. Chunks du combat épinglés en mémoire; construction d'un snapshot terrain autoritaire.
4. Positions ajustées vers cellules légales proches si nécessaire, sans transfert de scène.
5. Grille tactique visible, initiative individuelle, actions par commandes validées.
6. Fin de combat : récompenses, persistance, retrait overlay, reprise de l'exploration aux positions atteintes.
Les acteurs du monde externes ne modifient pas la rencontre pendant V0.

## Vertical slice et qualité
Village, forêt continue, PNJ, groupe ennemi, deux rencontres et boss, récompenses; session cible 20–30 min. Deux clients / deux joueurs avec 1 compagnon manuel chacun. Cible 60 FPS sur machine de référence; 5–10 min/combat standard. Aucun crash bloquant, état synchronisé après chaque résolution, zéro action illégale acceptée.

## Hors scope
MMO, marché, PvP, guildes, métiers étendus, item world, réincarnation, IA des compagnons en combat, génération procédurale poussée, mobile, combats parallèles dans le même monde, migration d'hôte.

## Risques
Pathfinding inter-chunks; fluidité du streaming; projection exploration→grille; verrouillage des chunks pendant le combat; écarts d'état réseau; rythme des activations manuelles. Mesurer et itérer avant d'agrandir le monde.
