# Bestiaire 1–30 — passation chara design

Date : 2026-10-15. Statut : brief pour une autre discussion ; chara design à définir et valider avec l'utilisateur.

## Lire d'abord

- [Zones et bestiaire 1–30 v0.1](../design/ZONES-BESTIAIRE-1-30-v0.1.md) : source du catalogue, des niveaux et des intentions de rôle.
- Les références artistiques des cinq héros et, lorsqu'ils sont disponibles dans la branche de travail, `docs/art/CHARACTER_DESIGN_LOCK.md` et `docs/art/INTERACTIVE_ATELIER_HANDOFF.md`. La passation héros a été publiée dans la PR #26 ; vérifier son état actuel avant de choisir une branche. Ce chantier ne remplace pas le travail de l'issue #27.
- [Invocations : brief séparé](INVOCATIONS-CHARA-DESIGN.md). Les invocations de classe et les monstres sauvages sont des catalogues distincts.

## Direction et limites

Univers original de Project Tactics : fantasy 2D isométrique stylisée, silhouettes lisibles, contours nets, cel-shading et couleurs cohérentes avec les héros approuvés. Ambiance de village et forêt inspirée de Suikoden Tierkreis, rendu dans l'esprit de DOFUS. Les références DOFUS servent à comprendre les familles et leurs rôles ; les silhouettes, accessoires et illustrations finales doivent être originaux.

Les descriptions ci-dessous sont des pistes acceptées pour démarrer la recherche, pas un verrouillage du design. L'utilisateur définira le chara design dans cette nouvelle discussion. Ne pas redessiner les héros approuvés. Ne pas modifier les sorts, statistiques, niveaux, drops ou panoplies pendant le travail esthétique.

Le concept d'ensemble forêt/village présenté dans la discussion d'origine est une référence d'ambiance, pas une carte à reproduire à l'échelle. L'image n'est pas versionnée avec ce brief : demander la référence à l'utilisateur si elle est nécessaire.

## Catalogue à illustrer

| Sous-zone | Créatures ordinaires | Chef | Pistes visuelles |
|---|---|---|---|
| Clairières chantantes | Plumet des mousses ; Plumet braise ; Plumet de rosée ; Plumet voltigeur | Grand Plumet | Petits oiseaux ronds, crête-feuille ; variations de silhouette et de motifs correspondant aux affinités |
| Haies bondissantes | Trottin des haies ; Trottin piqueur ; Trottin poudré ; Trottin meneur | Grand Trottin | Oiseaux coureurs, grandes pattes, petites ailes, longue queue végétale |
| Jardin sauvage | Bulbe mordeur ; Liane agrippeuse ; Gueulefleur venimeuse ; Fleur nourricière | Mâche-Racine | Plantes prédatrices, mâchoires, bulbes, lianes ; aspect de sous-bois humide |
| Bois des Vieilles Racines | Filombre tisseuse ; Filombre venimeuse ; Souche éveillée ; Sylvaronce gardien | Le Vieux Noueux | Deux familles : araignées forestières et bois animé ; toiles, écorces et racines |
| Prairies laineuses | Bourlaine jeune ; Bourlaine cornue ; Bourlaine épaisse ; Berger des hardes | Bélier Couronné | Créatures laineuses de troupeau ; cornes, crinière et densité de toison différenciées |
| Champs éveillés | Sporignon ; Chardon frondeur ; Solépi ; Paillotin | Le Moissonneur Creux | Champignon, chardon, fleur solaire, épouvantail ; cultures et outils agricoles animés |

Total : 24 monstres ordinaires et six chefs. Noms provisoires ; conserver une correspondance explicite si un nom change.

## Points de lisibilité à explorer

- Différencier Plumets et Trottins par les proportions et la locomotion, pas seulement par les couleurs.
- Distinguer les Gueulefleurs prédatrices des créatures agricoles des Champs éveillés.
- Faire reconnaître les soutiens et les menaces à leur silhouette et leurs attributs, sans figer des sorts encore non définis.
- Le Berger des hardes est une créature laineuse âgée, pas un personnage humain.
- Renforcer la présence des chefs tout en gardant une lecture claire sur la grille ; taille graphique et emprise de collision ne sont pas encore fixées.
- Éviter que les grands feuillages, toiles ou accessoires masquent les cases et les personnages.
- Les évolutions visuelles par rang prévues pour les invocations ne s'appliquent pas automatiquement aux monstres sauvages.

## Panoplies comme contexte visuel

Plumet : plumes et quatre affinités élémentaires. Trottin : mobilité et légèreté. Gueulefleur : bulbes, lianes et nectar. Sylvaronce : écorce et soie forestière. Bourlaine : laine et cornes. Moisson : paille, graines et cultures.

Le design porté des équipements est un travail distinct ; ne pas modifier les fiches de héros pour l'anticiper. Les ressources nommées dans le document de conception peuvent guider les matériaux visibles des monstres.

## Déroulé proposé pour la discussion artistique

1. Choisir avec l'utilisateur une famille à traiter.
2. Proposer une planche de recherche montrant ses quatre monstres et son chef.
3. Valider silhouettes, palette, proportions et échelle relative avant de finaliser.
4. Décliner des vues cohérentes pour la 2D isométrique et répertorier les besoins d'animation.
5. Versionner les références et leur statut : proposé, à retoucher, approuvé.
6. Revenir sur les animations d'attaque lorsque les fiches de sorts auront été définies.

Ces étapes sont une proposition de méthode, pas une approbation des futures images.

## Prompt de reprise

> Reprends le chara design du bestiaire de départ de Project Tactics dans le dépôt a6108606/project-tactics.
>
> Lis d'abord docs/design/ZONES-BESTIAIRE-1-30-v0.1.md et docs/art/BESTIAIRE-CHARA-DESIGN.md. Consulte les références approuvées des cinq héros pour assurer la cohérence visuelle, sans les modifier ; vérifie la passation de la PR #26 si nécessaire.
>
> La base contient deux grandes zones de niveaux 1–15 et 15–30, six sous-zones, 24 monstres ordinaires et six chefs. Les noms sont provisoires. Les références Pious, Tofus, plantes carnivores, Araknes/Abraknydes, Bouftous et créatures des champs indiquent des inspirations ; nous créons notre propre bestiaire.
>
> Je souhaite définir et valider le chara design famille par famille : silhouettes, couleurs, proportions, attributs distinctifs, cohérence 2D isométrique et différences entre monstres ordinaires et chef. Commence par les Plumets, sauf indication contraire de ma part.
>
> Les mécaniques, stratégies, nombre de sorts, types de sorts et valeurs seront traités séparément. N'en invente pas pour verrouiller un design et ne modifie pas les héros approuvés ni les règles de combat.
