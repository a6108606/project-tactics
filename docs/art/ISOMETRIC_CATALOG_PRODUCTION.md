# Production du catalogue isométrique

Périmètre demandé : cinq héros, leurs deux bases, tous les monstres et créatures définis dans GitHub, dix invocations **en forme de base uniquement**, huit orientations chacun. Le catalogue machine est `tools/character-studio/isometric/assets/catalog/catalog.json` ; son état distingue explicitement les éléments réalisés et ceux à produire.

## Inventaire

53 formes, soit 424 vues : 10 bases de héros, 30 monstres des six familles, 10 invocations de rang I, 3 archétypes historiques (Brute, Archer, Boss Gardien). Les trois derniers proviennent du GDD v0.2 et sont séparés du bestiaire actuel. La branche du prototype d’exploration ne définit pas d’autre espèce : son compagnon est une forme provisoire sans identité propre.

Les documents récents de main ont été consultés au commit `e13b1456ab75899fb55082a30f6efd64f12d06be`. Copies de consultation exactes dans `production-sources/`, avec empreintes et liens canoniques dans `provenance.json`. Les liens relatifs de ces copies restent ceux des documents originaux. Aucun contenu de combat n’est importé ou modifié.

## Direction et autorisation

Le commanditaire a approuvé l’étude Ryuu isométrique, demandé la généralisation autonome aux huit orientations, puis demandé une inspiration Dofus mêlée à des bestiaires d’animation. Repères : silhouettes exagérées, contours sombres, ombres en aplats, caractère expressif, détails lisibles à 160 px. Les héros restent fondés sur les cinq fiches originales. Les créatures sans image sont des créations depuis les descriptions ; elles sont indiquées comme propositions, jamais comme individuellement approuvées.

Références de recherche : [bestiaire Dofus](https://www.tofus.fr/items/bestiaire), [Pokédex](https://www.pokemon.com/pokedex/), [œuvres du Studio Ghibli](https://www.ghibli.jp/works/). Influences de langage visuel ; aucun asset de ces catalogues n’est distribué dans le projet.

## Méthode

- Une planche source de huit orientations cohérentes par forme, produite avec l’outil imagegen intégré ; prompt exact conservé.
- Ordre : dos, dos droite, droite, face droite, face, face gauche, gauche, dos gauche.
- Découpe, suppression du fond de détourage, contrôle des marges et ancrage reproductibles. Ne pas supposer que la grille générée est parfaite.
- Sources conservées, empreintes SHA-256, PNG transparents séparés et planche, comparaison aux références lorsqu’elles existent.
- Même moteur de personnalisation et d’export que l’atelier approuvé. Les masques restent distincts des illustrations ; les accessoires des héros doivent rester fixes.
- Contrôle visuel des huit orientations, contrôle à taille de jeu, tests de dimensions, alpha, identité de la palette par défaut et export. Une image générée seule ne vaut pas validation.
- Publication par lots dans la branche `feat/art-character-studio-v3` et la PR #28.

Il s’agit de poses de repos, pas d’animations. Les reconstructions de dos et les variations mineures entre dessins sont documentées. Les variantes de visage/coiffure de l’issue initiale restent un travail distinct à suivre, sans les présenter comme réalisées.
