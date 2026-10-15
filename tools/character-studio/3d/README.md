# Ryuu — étude 3D stylisée à valider

Décision utilisateur du 15 octobre 2026 : **« Vraie 3D stylisée, avec validation du nouveau rendu »**. Cette étude traduit le design Ryuu en volumes ; elle ne constitue pas une extraction fidèle du PNG ni un design déjà approuvé. Les références V2 et le pilote 2D sont conservés.

## Essayer

Depuis la racine du dépôt :

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir <http://127.0.0.1:8765/tools/character-studio/3d/>. Le serveur doit rester actif. WebGL et un navigateur récent sont nécessaires ; les fichiers, Three.js et sa licence sont locaux. Aucun CDN, appel à une IA, transfert de référence ou service payant pendant l’utilisation.

- Deux bases Ryuu : masculine et féminine ; états distincts.
- Deux formes de visage : joues arrondies / mâchoire affinée.
- Deux coiffures : pointes libres / mèches rabattues. Ce sont de nouvelles études, pas neuf variantes extraites de la fiche.
- Cinq matériaux : peau, cheveux, pantalon, tissu de taille, gilet et liens.
- Quatre groupes d’équipements amovibles : cuirs et ornements, bandeau et rubans, pans de ceinture, dague. Ils ont uniquement des matériaux `fixed_*`.
- Rotation 360° à la souris ou avec boutons/curseur, zoom et rotation automatique.
- Comparaison avec le recadrage original, sauvegarde locale des deux bases, import/export JSON validé, remise à zéro.
- PNG issu du framebuffer visible : même caméra, mêmes couleurs, même pose et même fond que l’aperçu. La référence et les commandes ne sont pas intégrées au PNG. La résolution dépend de la taille de l’aperçu et du facteur de pixels de l’écran (plafonné à 2).

## Ce qui est reconstruit et reste à valider

**Tous les maillages sont nouveaux.** Les PNG ne contenaient aucun volume ou calque de production. La silhouette, le visage, les mèches, l’épaisseur des vêtements et les équipements sont modélisés pour cette proposition. Le dos, les surfaces sous les accessoires, la nuque et la continuité des vêtements sont des interprétations explicites. L’arrière de la coiffure a été complété après contrôle à 180°.

Les signes distinctifs repris sont les cheveux menthe, le bandeau violet, le cuir brun, les volumes amples, les pans rouges et les ornements dorés. Les écarts restent visibles dans la comparaison : expression plus ronde, visage et anatomie simplifiés, mèches plus géométriques, motifs et drapés simplifiés, posture neutre et symétrique. La base féminine dispose d’un chignon, d’une couronne moins pointue, d’un torse plus étroit et d’une pièce de vêtement supplémentaire sur la poitrine.

**Pas de validation esthétique acquise**, pas de rig, de déformation articulée, d’animation, de UV/textures peints ou d’optimisation finale pour le jeu. Les huit autres bases et les monstres ne sont pas produits. L’issue #27 reste ouverte. Une décision sur le rendu précède toute généralisation.

## Sources éditables et génération

`models/ryuu-*.blend` contient les maillages, matériaux et scène de revue. `models/ryuu-*.glb` est le modèle servi dans l’atelier ; ce ne sont pas des images sur un plan. Les variantes sont des groupes de géométries distincts dans chaque GLB. Les modèles n’utilisent aucune texture PNG.

`production/build_ryuu.py` décrit les formes, mèches et détails de cette étude et exporte les deux bases avec Blender **4.5.14 LTS** :

```sh
blender -b --threads 6 --python tools/character-studio/3d/production/build_ryuu.py
node tools/character-studio/3d/tests/assets.mjs
```

Attention : régénérer remplace les modèles générés et les scènes de revue ; intégrer les retouches manuelles au script ou les conserver dans un nouveau fichier source avant de lancer cette commande. Les `.blend` ne sont pas annoncés reproductibles octet pour octet entre installations. Le manifeste contient les empreintes des livrables effectivement exportés.

Les `*-review.png` sont des rendus Blender destinés à inspecter la géométrie, avec éclairage différent du shader toon WebGL. Ils ne sont pas présentés comme des captures de l’atelier. Les PNG de [comparaison](../../../docs/art/evidence/ryuu-3d/index.html) proviennent de l’export de l’application.

Blender officiel utilisé : `blender-4.5.14-linux-x64.tar.xz`, SHA-256 `9ba871ff2ecd36526b77432745980b7e6664ecd0c7ca11c48849073dcfe06da3`, vérifié contre la somme publiée par Blender. Il n’est pas nécessaire pour consulter l’atelier. Three.js 0.180.0 est embarqué sous licence MIT ; provenance et intégrité du paquet dans `vendor/provenance.json`.

## Méthode commune pour les prochains assets

1. Conserver une référence approuvée et son SHA-256. Définir les proportions, la pose de revue et les surfaces non documentées.
2. Produire un vrai mesh spécifique au personnage ; ne pas transformer le générateur Ryuu en silhouette universelle pour les héros et monstres.
3. Respecter cinq matériaux `base_skin`, `base_hair`, `base_clothing1`, `base_clothing2`, `base_clothing3`. Décrire les zones dans le manifeste du personnage. Tous les matériaux d’équipement commencent par `fixed_`.
4. Grouper les variantes sous `face_<id>` et `hair_<id>`, les équipements sous `equip_<id>`. Chaque variante doit contenir une vraie géométrie. Conserver un corps et des vêtements continus sous les pièces retirables.
5. Exporter un GLB par base (Y vertical, pieds au sol, face vers +Z), conserver la source Blender et générer un manifeste d’empreintes et de disponibilité. Adapter le cadrage à la créature.
6. Tester géométries, matériaux, cinq recolorisations, équipements, JSON et PNG ; inspecter face, profil, dos et variantes dans le même viewer.
7. Présenter les comparaisons et écarts. Passer le statut `proposal-awaiting-art-approval` à validé seulement après décision utilisateur ; puis seulement produire le lot suivant.

Le viewer et le contrat des matériaux sont réutilisables. L’interface actuelle reste volontairement un pilote Ryuu : elle n’annonce pas de catalogue universel opérationnel et la production artistique de chaque créature reste nécessaire.

## Vérification

```sh
python3 tools/art/import_reference_bundle.py --verify-only
node tools/character-studio/3d/tests/assets.mjs
```

Tests WebGL : <http://127.0.0.1:8765/tools/character-studio/3d/tests/browser.html>. Le rapport navigateur vérifie les changements de pixels, les matériaux fixes, les variantes, le dos, le retour au canon et l’égalité RGBA du PNG décodé avec le canvas. Ce sont des vérifications techniques, pas une validation artistique. Voir le [suivi 3D](../../../docs/art/RYUU_3D_REVIEW.md) pour les limites et ART-01 à ART-12.
