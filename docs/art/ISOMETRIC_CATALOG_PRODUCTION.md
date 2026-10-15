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


## Lot livré le 15 octobre 2026

Les 53 formes sont disponibles dans le catalogue, soit 424 vues de repos. Les 52 nouvelles sources ont été produites avec Imagegen intégré ; les huit dessins du pilote Ryuu masculin sont conservés. Contrôles exécutés : **1 858 vérifications des assets**, **222 vérifications navigateur du catalogue**, **140 vérifications du pilote Ryuu**, aucun échec ; les dix fichiers V2 sont exacts. Les résultats techniques sont dans `verification-catalog.json` et `verification-browser-catalog.json`, avec les pages de tests exécutables à côté de l’atelier.

La normalisation conserve les dessins sans les agrandir. Sources 1254 × 1254, cellules 384 × 640 et ancre au sol `[192,615]`. Une grille adaptative convient à 50 planches ; pour Trottin piqueur et Porte-étendard, des silhouettes disjointes dépassaient les séparations verticales. L’extraction par composantes connexes conserve chaque silhouette complète, sans couper ni recomposer les membres. Les sources choisies et les corrections de Mâche-Racine, Trottin poudré et Trottin piqueur sont tracées dans `assets/catalog/prompts.json`.

### État artistique et points à reprendre

- Toutes les nouvelles créatures sans fiche illustrée sont des propositions depuis les descriptions GitHub. L’autorisation de produire le lot ne vaut pas approbation individuelle des 52 nouvelles planches.
- Les héros sont des adaptations dessinées des références, et non leurs pixels d’origine. Des changements de proportions, de plis et de motifs existent. Ryuu féminin simplifie l’asymétrie des bas ; les mèches de Sela et les attaches des armes demandent une harmonisation entre vues. Les dos et parties cachées sont des reconstructions locales.
- Les masques détaillés et les témoins fixes de Ryuu masculin sont conservés. Sur les neuf nouvelles bases, les cinq canaux sont actifs mais leurs sélections restent provisoires : cheveux longs et équipements de teintes voisines demandent des masques manuels plus fins. Le catalogue et l’interface le signalent. Aucun résultat de test ne doit être lu comme une validation de cette séparation sémantique.
- Les créatures emploient des familles de teintes. Cela peut changer plusieurs matières partageant une même couleur ; les contours et les pixels hors masque restent fixes.
- Les huit directions sont huit dessins indépendants, pas une rotation géométriquement exacte. Pas d’animations, ni variantes de visage/coiffure, ni équipement amovible dans ce lot. L’issue #27 demeure ouverte pour ces critères et la validation artistique.

Aucun sort, caractéristique, équilibrage ou fichier du prototype parallèle n’a été modifié.
