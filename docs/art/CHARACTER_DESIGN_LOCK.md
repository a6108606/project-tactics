# Character design — références approuvées et verrouillées

Statut : décision esthétique utilisateur du 15 octobre 2026. Périmètre : esthétique uniquement.

## Autorité visuelle

Les références sont **les cinq fiches individuelles re-jointes et approuvées par l'utilisateur**, avec une base masculine et une base féminine pour chaque personnage : Ryuu, Kael, Sela, Leo et Lina. Le manifeste `reference_bundle_manifest.json` identifie leurs fichiers exacts par taille et SHA-256.

La planche collective ultérieure qui réinterprétait les silhouettes et les costumes a été **rejetée**. Elle ne doit pas servir de référence, de miniature ou de source pour une génération. Les versions antérieures des mêmes fiches ne remplacent pas les cinq PNG identifiés dans le manifeste.

Conserver les proportions, silhouettes, visages de référence, coiffures canoniques, costumes, détails, accessoires, palettes par défaut, contours nets, cel-shading et expressions de ces fiches. La présentation de l'atelier reste parchemin, bleu nuit et doré. L'inspiration DOFUS décrit le style approuvé ; elle n'autorise ni un nouveau dessin des héros ni l'import d'assets propriétaires du jeu.

**Kael reste blond, avec sa tenue violette et dorée.** Son parallèle de gameplay avec un Sram n'autorise pas un assassin encapuchonné redessiné. Le même principe vaut pour les quatre autres héros. Les intitulés de rôles ou textes narratifs visibles sur les fiches ne sont pas une spécification de gameplay.

## Personnalisation commune aux cinq personnages

- Deux bases : `masculine` et `feminine` ; mêmes possibilités de personnalisation, aucune différence de puissance.
- Deux familles de variantes : **visage** et **coiffure**. Cela ne signifie pas seulement deux visages ou deux coiffures. Le nombre de variantes de production reste à valider ; les neuf études d'une planche ne constituent pas neuf assets modulaires validés.
- Exactement cinq canaux de couleur de la base : `skin`, `hair`, `clothing1`, `clothing2`, `clothing3`.
- La forme du visage et la teinte de peau sont indépendantes ; la coupe et la teinte des cheveux le sont également.
- Les trois canaux textiles désignent des zones documentées de la tenue de base, pas nécessairement « haut / pantalon / accessoire ». Leur cartographie doit être définie pour chaque base sans changer le costume.

Les armes, armures, casques, épaulières, capes et accessoires équipés restent des **calques indépendants**. Leurs textures et palettes ne reçoivent jamais les couleurs personnalisées de la base. La même couleur RGB peut apparaître dans un vêtement et un équipement : ce n'est pas un critère suffisant pour les recolorer ensemble.

Les calques d'équipement peuvent passer devant ou derrière selon la pose et masquer une partie du corps, des cheveux ou de la tenue. Ne pas supposer qu'un ordre d'empilement unique suffit à toutes les orientations.

## Source immuable, dérivés séparés

Après import, conserver `content/art/characters/reference-v2/` inchangé, notamment les PNG et l'HTML V2. Les masques, découpes, calques, points d'ancrage et assets de production vont dans un dossier séparé, avec leur source et leur état de validation.

Le découpage et la préparation de calques sont autorisés pour rendre le design interactif. **Une modification substantielle du dessin nécessite une validation utilisateur explicite.** Ne pas régénérer tout un personnage pour contourner un problème de détourage. Les parties cachées n'existent pas dans une image aplatie : une reconstruction locale éventuelle doit être identifiée et présentée pour validation, pas attribuée à la source originale.

## Statut de l'atelier V2

La V2 approuvée consulte les cinq fiches, change la base affichée, montre des études, enregistre des choix et exporte des configurations. Les choix de visage, coiffure et couleurs **ne modifient pas encore l'illustration centrale**. Ses exports PNG sont des références canoniques.

Les huit vues et les poses sont des études statiques, pas des directions ou animations de production déjà vérifiées. Les résultats présents dans `validation_tests.json` appartiennent à la livraison V2 : ne pas les présenter comme des tests de la future V3.

## Hors périmètre

Ne pas modifier les sorts, voies élémentaires, caractéristiques, statistiques, équilibrage ou histoire : ces sujets sont traités en parallèle. Ne pas modifier la CI, les runners, les permissions ou la visibilité du dépôt pour cette tâche.

Prochaine étape : [atelier réellement interactif](INTERACTIVE_ATELIER_HANDOFF.md), sans nouvelle direction artistique.

## Décision ultérieure — pilote 3D autorisé

Le 15 octobre 2026, l’utilisateur choisit explicitement « Vraie 3D stylisée, avec validation du nouveau rendu ». Une traduction en volume sur Ryuu masculin/féminin est donc autorisée comme proposition distincte, avec reconstructions et écarts signalés. La validation du nouveau rendu reste requise avant généralisation. Les sources approuvées restent immuables ; aucun autre héros ni gameplay ne change. Voir [la revue du pilote 3D](RYUU_3D_REVIEW.md).

## Décision ultérieure — retour à la 2D isométrique

Le 15 octobre 2026, après les essais de volume, l’utilisateur demande « dans ce cas là fait la version dofus 2 en isométrique ». La suite active devient un sprite dessiné sur une grille isométrique. Le premier lot est Ryuu masculin, une pose sud-est, avec cinq couleurs et PNG transparent. Il s’agit d’une nouvelle interprétation signalée et comparée à la fiche, à valider avant les autres vues, Ryuu féminin et les autres personnages. Voir [le pilote isométrique et sa méthode](../../tools/character-studio/isometric/README.md). Les sources V2 restent immuables. Le choix d’une direction 2D ne vaut pas approbation automatique du dessin livré.
