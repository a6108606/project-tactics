# Zones et bestiaire niveaux 1–30 — v0.1

Date : 2026-10-15. Projet : Project Tactics.

## Statut et périmètre

Base de conception acceptée par l'utilisateur : deux grandes zones, six sous-zones, 24 monstres ordinaires, six chefs et six collections d'équipement. Les noms restent provisoires.

Les plages de niveaux, ressources et orientations d'équipement ci-dessous constituent la base de travail. Les comportements sont des **intentions à détailler**, pas des fiches de combat implémentables. Nombre et types de sorts, stratégie, IA, valeurs, résistances, PA/PM et équilibrage seront définis dans une prochaine étape. Les taux de butin sont des propositions à tester.

Le chara design des monstres sera défini avec l'utilisateur dans une autre discussion : voir [la passation artistique](../art/BESTIAIRE-CHARA-DESIGN.md). Aucune illustration finale de monstre n'est approuvée par ce document.

Ce contenu décrit la cible de préproduction 1–30 ; il n'étend pas automatiquement le vertical slice 1–5 du [GDD](../GDD-v0.2.md), ni son budget de carte. Guilde et artisans désignent ici des lieux et PNJ narratifs : cela ne valide pas un système de guildes de joueurs, de marché ou de métiers étendus.

## Ouverture et territoire

Le personnage a été tué, puis se réveille dans une forêt inconnue. Il rejoint un petit village possédant une maison de guilde et découvre progressivement le monde et les portails reliant plusieurs mondes. Cause du retour à la vie, meurtrier et vérité sur les portails restent à écrire.

Clairval est le nom provisoire du village ; Val des Échos est une proposition de nom régional. La clairière du réveil est une poche paisible dans la forêt. Un chemin praticable rejoint les zones débutantes puis le village ; les embranchements dangereux deviennent intéressants plus tard. La distance doit permettre une véritable découverte avant l'arrivée au refuge.

Direction d'ambiance : forêt ancienne et village accueillant inspirés de Suikoden Tierkreis, traitement original 2D isométrique stylisé inspiré de DOFUS. Maison de guilde, place avec puits, auberge, forge, jardins ; chemins de pierre, arbres massifs, cours d'eau et arche ancienne envahie de végétation. Le concept d'ensemble présenté dans la discussion est une image d'ambiance, pas un plan jouable à l'échelle. Il n'est pas inclus dans ce commit.

Les combats se déroulent sur le terrain d'exploration selon le GDD. Les espaces de combat des chefs ne supposent pas une arène séparée.

## Répartition

| Grande zone | Sous-zone | Niveaux | Famille | Ambiance |
|---|---|---:|---|---|
| Les abords de Clairval — 1–15 | Les Clairières chantantes | 1–6 | Plumets ; référence de rôle : Pious | Fleurs, petits arbres, nids, chemins lumineux |
| Les abords de Clairval — 1–15 | Les Haies bondissantes | 5–10 | Trottins ; référence de rôle : Tofus | Hautes herbes, terriers, vergers, clôtures |
| Les abords de Clairval — 1–15 | Le Jardin sauvage | 9–15 | Gueulefleurs ; plantes carnivores | Sous-bois humide, mares, lianes, ruines envahies |
| Les terres de Clairval — 15–30 | Le Bois des Vieilles Racines | 15–22 | Filombres et Sylvaronces ; araignées et arbres animés | Toiles, racines, forêt ancienne, vestiges |
| Les terres de Clairval — 15–30 | Les Prairies laineuses | 19–26 | Bourlaines ; référence de rôle : Bouftous | Collines, troupeaux, bergeries |
| Les terres de Clairval — 15–30 | Les Champs éveillés | 23–30 | Créatures des cultures | Blé, moulins, potagers, épouvantails animés |

Les plages se chevauchent volontairement. Le niveau désigne une créature individuelle ; le danger réel dépend du nombre d'ennemis, des synergies et du terrain. Composition des groupes, accès et adaptation au solo/coop restent à définir.

## 1. Les Clairières chantantes — 1–6

**Identité proposée :** petits oiseaux ronds et expressifs, crêtes en forme de feuilles.

| Monstre | Niveau | Intention de comportement, à détailler | Ressource distinctive |
|---|---:|---|---|
| Plumet des mousses | 1–2 | Attaque de mêlée Terre simple | Plume mousseuse |
| Plumet braise | 2–3 | Petit projectile Feu à courte portée | Duvet chaud |
| Plumet de rosée | 3–4 | Attaque Eau ; petit soin allié avec relance | Perle de rosée |
| Plumet voltigeur | 4–5 | Attaque Air ; recule d'une case après avoir frappé | Plume légère |
| **Chef : Grand Plumet** | **6** | Renforce les dégâts des alliés proches pendant deux tours | Aigrette du Grand Plumet |

Apprentissage visé : déplacement, portée, identification des soutiens, choix de cible.

## 2. Les Haies bondissantes — 5–10

**Identité proposée :** oiseaux coureurs à petites ailes, grandes pattes et longue queue végétale.

| Monstre | Niveau | Intention de comportement, à détailler | Ressource distinctive |
|---|---:|---|---|
| Trottin des haies | 5–6 | Frappe au contact puis cherche à s'éloigner | Duvet de Trottin |
| Trottin piqueur | 6–7 | Attaque en ligne ; baisse la résistance à son élément de 5 points de pourcentage, un tour, sans cumul | Bec effilé |
| Trottin poudré | 7–8 | Poussière réduisant la portée de 1 pendant un tour | Poudre de nid |
| Trottin meneur | 8–9 | Donne temporairement 1 PM à un allié | Plume de meneur |
| **Chef : Grand Trottin** | **10** | Charge annoncée en ligne ; repousse de deux cases | Ergot du Grand Trottin |

La baisse de résistance du piqueur n'est pas une érosion des PV maximaux. Son élément reste à choisir.

Apprentissage visé : couper une trajectoire, utiliser les obstacles, anticiper les déplacements.

## 3. Le Jardin sauvage — 9–15

**Identité proposée :** prédateurs végétaux à mâchoires, bulbes et lianes, distincts des cultures animées des Champs éveillés.

| Monstre | Niveau | Intention de comportement, à détailler | Ressource distinctive |
|---|---:|---|---|
| Bulbe mordeur | 9–10 | Morsure Eau avec petit vol de vie | Pulpe de bulbe |
| Liane agrippeuse | 10–12 | Attire de deux cases ; faible attaque au contact | Liane souple |
| Gueulefleur venimeuse | 12–14 | Poison de deux tours, non cumulable avec lui-même | Poche de venin |
| Fleur nourricière | 13–15 | Soigne les alliés ; faible menace seule | Nectar épais |
| **Chef : Mâche-Racine** | **15** | Attire, puis prépare une forte morsure au tour suivant ; mobilité limitée par les racines | Cœur de Mâche-Racine |

Apprentissage visé : poison, menace annoncée, priorité au soigneur. Mâche-Racine conclut le premier contrat important de la guilde.

## 4. Le Bois des Vieilles Racines — 15–22

**Identité proposée :** deux familles complémentaires, araignées Filombres et arbres animés Sylvaronces. Ressources distinctes réunies dans les recettes locales.

| Monstre | Niveau | Intention de comportement, à détailler | Ressource distinctive |
|---|---:|---|---|
| Filombre tisseuse | 15–17 | Pose une toile visible pouvant retirer 1 PM | Soie de Filombre |
| Filombre venimeuse | 17–19 | Poison, déplacement rapide, faible résistance | Crochet venimeux |
| Souche éveillée | 18–20 | Résistante et lente ; repousse d'une case | Écorce vivante |
| Sylvaronce gardien | 20–22 | Bouclier temporaire sur un allié proche | Sève ancienne |
| **Chef : Le Vieux Noueux** | **22** | Racines destructibles fermant certains passages | Noyau du Vieux Noueux |

Le retrait de PM devra suivre la future règle de Sagesse et de résistance aux retraits ; il n'est pas garanti.

Apprentissage visé : gestion du terrain, contournement d'un protecteur, choix entre destruction d'obstacle et détour.

## 5. Les Prairies laineuses — 19–26

**Identité proposée :** troupeaux de créatures laineuses, jeunes boules de laine, adultes massifs et béliers territoriaux. Motifs de cornes et de toison originaux.

| Monstre | Niveau | Intention de comportement, à détailler | Ressource distinctive |
|---|---:|---|---|
| Bourlaine jeune | 19–20 | Mêlée simple ; rejoint le troupeau | Laine souple |
| Bourlaine cornue | 20–22 | Charge en ligne et repousse d'une case | Corne courbe |
| Bourlaine épaisse | 22–24 | Forte résistance au contact ; lente, facile à contourner | Toison dense |
| Berger des hardes | 24–26 | Cri renforçant temporairement les dégâts des Bourlaines proches | Crinière de harde |
| **Chef : Bélier Couronné** | **26** | Charge annoncée ; collision avec un obstacle retire sa protection pendant un tour | Corne couronnée |

Le Berger des hardes est une créature laineuse âgée à crinière, pas un berger humain.

Apprentissage visé : séparer un groupe, éviter les alignements, exploiter le décor.

## 6. Les Champs éveillés — 23–30

**Identité proposée :** cultures et outils agricoles animés par une perturbation magique ; esthétique rurale distincte des plantes carnivores.

| Monstre | Niveau | Intention de comportement, à détailler | Ressource distinctive |
|---|---:|---|---|
| Sporignon | 23–25 | Petite zone visible et temporaire de spores empoisonnées | Spores dorées |
| Chardon frondeur | 24–26 | Tir à distance ; réduit les chances de critique de 5 points de pourcentage pendant un tour | Épine de chardon |
| Solépi | 26–28 | Fleur solaire ; soin allié ou rayon Feu en ligne | Graine solaire |
| Paillotin | 27–29 | Épouvantail animé ; repousse et protège les cultures proches | Paille ensorcelée |
| **Chef : Le Moissonneur Creux** | **30** | Prépare une attaque sur une bande de terrain ; haies et obstacles offrent des abris | Cœur de moisson |

Apprentissage visé : gérer des menaces complémentaires et reconnaître les zones sûres.

Référence d'inspiration consultée le 2026-10-15 : [guide du Donjon des Champs, Tofus.fr](https://www.tofus.fr/donjons/champ), qui présente notamment Champ Champ, Pissenlit Diabolique, Rose Démoniaque et Tournesol Sauvage. Source communautaire pour l'inspiration uniquement ; les niveaux, valeurs et taux de ce document sont nos propositions, pas une reproduction des règles DOFUS.

## Panoplies

| Panoplie | Niveaux des équipements | Pièces proposées | Orientation |
|---|---:|---|---|
| Plumet | 2–6 | Coiffe, cape, amulette | Quatre déclinaisons élémentaires de valeur équivalente |
| Trottin | 6–10 | Cape, bottes, ceinture, anneau | Agilité, fuite, dégâts fixes |
| Gueulefleur | 10–15 | Coiffe, amulette, ceinture, bottes | Chance, Vitalité, résistance fixe Eau |
| Sylvaronce | 16–22 | Coiffe, cape, ceinture, anneau | Force, Vitalité, tacle |
| Bourlaine | 20–26 | Coiffe, cape, amulette, bottes | Force/Intelligence, Vitalité ; moins spécialisée que Sylvaronce |
| Moisson | 24–30 | Coiffe, amulette, ceinture, anneau | Intelligence, soins, portée |

Six collections, dont la Plumet possède quatre variantes élémentaires. Aucune restriction par classe. Fabrication principale chez les artisans du village, à partir de ressources locales et de matériaux récoltés.

Bonus progressifs à deux et trois pièces, puis quatre lorsqu'il existe une quatrième pièce. Le mélange entre collections doit rester viable. Aucun bonus exact, nombre final d'emplacements d'équipement ou catalogue de recettes n'est figé ici ; ces propositions ne remplacent pas les emplacements simplifiés du prototype.

Définir le budget des objets 1–30 avec la [calibration des dégâts v0.6](EQUILIBRAGE-DEGATS-v0.6.md) avant de chiffrer les bonus. Rappel : un point de Vitalité vaut +5 PV.

## Butin — hypothèses de départ

| Type | Obtention proposée | Usage |
|---|---|---|
| Ressource commune de famille | 50 % par monstre | Base des recettes : plumes, fibres, bois, laine… |
| Ressource distinctive | 20 % sur le monstre concerné | Chasse ciblée d'une espèce |
| Ressource rare de famille | 5 % | Pièces recherchées et améliorations |
| Ressource du chef | Une garantie par victoire et par joueur éligible | Pièce principale de la panoplie |
| Pièce de panoplie directe | 2 % sur le chef, parmi les pièces locales | Complément de l'artisanat |

Pour les chefs, la ressource distinctive nommée dans leur ligne est la ressource garantie : ne pas appliquer aussi le tirage ordinaire de 20 % à cette même ressource.

Tirages individuels par joueur. Les invocations ne créent pas de participants supplémentaires ; les créatures invoquées par les ennemis ne donnent pas de butin. Quantités, éligibilité, pondération des pièces, éventuels modificateurs, recettes et cadence de récolte restent à définir. Ne pas déduire de ces taux un système de prospection ou un effet de la Chance sur le butin.

## Fil narratif proposé

Premières missions ordinaires : oiseaux envahissants, plantes agressives, troupeaux agités. La guilde constate progressivement que les perturbations suivent les anciennes pierres des portails. Le Moissonneur Creux apporte le premier indice concret d'une activité venue d'un autre monde.

Cette piste ne fixe ni l'origine de la mort du personnage ni l'explication de son réveil.

## Prochaine étape : fiches de combat

À définir avec l'utilisateur, monstre par monstre :
- Rôle, stratégie, priorités de cible, synergies et contre-jeu.
- Nombre de sorts actifs et passifs ; types et éléments.
- PA/PM, portée minimale/maximale vue du dessus, ligne de vue, lancer en ligne, zones et obstacles.
- Coûts, relances, limites par tour/cible, déclencheurs et ordre des effets.
- Dégâts, soins, protections, poisons, durées, cumul et dissipations.
- PV, caractéristiques, résistances fixes et en pourcentage, faiblesse, tacle/fuite, Sagesse.
- Compositions de groupes, densité, réapparition et difficulté solo/coop.
- Stratégies des chefs, signaux visibles, fenêtres de vulnérabilité et récupération après erreur.
- XP, recettes, quantités de ressources et temps d'obtention des équipements.

Le nombre de sorts des invocations de classe (2 puis +1 par rang) ne s'applique pas automatiquement aux monstres sauvages. Aucun nombre de sorts n'est décidé dans cette version.
